import { serverSupabaseUser, serverSupabaseClient } from "#supabase/server";
import { useServerDefaultValues } from "~/server/utils/useServerDefaultValues.js";
import { useServerFetchAllPagination } from "~/server/utils/useServerFetchAllPagination.ts";
import { useProductSync } from "~/server/utils/useProductSync.js";
import { randomUUID } from 'crypto';
import {useServerMeli} from "~/server/utils/useServerMeli.ts";

const {
    shippingType
} = useServerDefaultValues();

/**
 * Handler principal da rota, responsável por buscar, filtrar e retornar os produtos do Mercado Livre.
 */
export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event);
    if (!user) {
        throw createError({
            status: 401,
            statusMessage: 'Usuário não autenticado',
        });
    }

    const { meliFetch, getSellerId } = await useServerMeli(event);
    const { getProductsFromDatabase, syncProduct } = await useProductSync(event);
    const query = getQuery(event);
    const sellerId = await getSellerId();

    const statusFilter = query.status || 'all_products';

    try {
        // Adicionar user_id ao query para buscar produtos do banco
        query.user_id = user.id;

        // Buscar produtos do banco de dados
        let dbProducts = [];
        try {
            dbProducts = await getProductsFromDatabase(query);
        } catch (error) {
            if (error.message === 'Conexão não encontrada') {
                throw createError({
                    status: 400,
                    statusMessage: 'Nenhuma conexão com o Mercado Livre encontrada. Por favor, configure uma conexão primeiro.',
                });
            }
            throw error;
        }

        // Buscar produtos da API para verificar se há novos ou atualizações
        console.log('Buscando produtos da API para verificar atualizações...');

        const searchPromises = [
            await useServerFetchAllPagination(meliFetch, `/users/${sellerId}/items/search`, {...query, sort: 'date_desc', status: 'active'}),
            await useServerFetchAllPagination(meliFetch, `/users/${sellerId}/items/search`, {...query, sort: 'date_desc', status: 'paused'})
        ];

        if (statusFilter === 'closed' || statusFilter === 'all_products') {
            searchPromises.push(useServerFetchAllPagination(meliFetch, `/users/${sellerId}/items/search`, { ...query, sort: 'date_desc', status: 'closed' }));
        }

        const results = await Promise.all(searchPromises);
        const allProductsIds = [...new Set(results.flat())];

        if (!allProductsIds || !allProductsIds.length) {
            return { data: { products: [], report: {} } };
        }

        // Verificar se há produtos novos ou que precisam ser sincronizados
        const dbProductIds = dbProducts.map(p => p.meli_id);
        const newProductIds = allProductsIds.filter(id => !dbProductIds.includes(id));
        const existingProductIds = allProductsIds.filter(id => dbProductIds.includes(id));

        // Processar produtos novos
        if (newProductIds.length > 0) {
            console.log(`Encontrados ${newProductIds.length} novos produtos, processando...`);
            const newProductsDetails = await fetchProductsDetails(meliFetch, newProductIds, true, event);
            await saveProductsToDatabase(newProductsDetails, user.id, event);
        }

        // Sincronizar produtos existentes que precisam de atualização
        const productsToSync = dbProducts.filter(product =>
            product.needs_sync ||
            !product.api_last_checked ||
            (new Date() - new Date(product.api_last_checked)) > 30 * 60 * 1000 // 30 minutos
        );

        for (const product of productsToSync) {
            try {
                await syncProduct(product, null, meliFetch);
            } catch (error) {
                console.error(`Erro ao sincronizar produto ${product.meli_id}:`, error.message);
            }
        }

        // Buscar produtos atualizados do banco
        const updatedProducts = await getProductsFromDatabase(query);

        // Converter dados do banco para o formato esperado pelo frontend
        const productsDetails = convertDbProductsToApiFormat(updatedProducts);

        // Aplicar filtro final
        const filteredProducts = filterProducts(productsDetails, statusFilter);

        const { report } = generateProductsReport(filteredProducts);

        return {
            data: {
                products: filteredProducts,
                report,
            }
        };

    } catch (error) {
        console.error('Erro ao buscar produtos:', error);

        if (error.status === 429) {
            throw createError({
                status: 429,
                statusMessage: 'Rate limit excedido. Tente novamente em alguns minutos.',
            });
        }

        if (error.status === 403) {
            throw createError({
                status: 403,
                statusMessage: 'Token de acesso inválido ou expirado.',
            });
        }

        throw createError({
            status: 500,
            statusMessage: 'Erro interno do servidor',
        });
    }
});

/**
 * Filtra a lista de produtos com base no status solicitado.
 * Esta função agora funciona corretamente porque `products` contém todos os itens (ativos, pausados, etc.),
 * e o status 'no_stock' é definido em `createProductData`.
 */
const filterProducts = (products, filter) => {
    if (filter === 'all_products') {
        return products;
    } else if (filter === 'no_stock') {
        return products.filter(product => product.stock_available <= 0);
    } else if (filter === 'no_cost') {
        return products.filter(product => !product.cost_unit || product.cost_unit <= 0);
    }
    return products.filter(product => product.status === filter);
};

/**
 * Monta o objeto final do produto, calculando métricas e definindo o status correto.
 */
const createProductData = async (product, visitsData, meliFetch, productId, visitsHistory = {}) => {
    const tax_nfe = 0.04;

    // 4. LÓGICA DE STATUS REFINADA: Essencial para o filtro funcionar.
    let finalStatus = product.status; // 'active', 'paused', 'closed'
    if (finalStatus === 'active' && product.available_quantity === 0) {
        finalStatus = 'no_stock';
    }

    const data = {
        id_meli: product.id,
        title: product.title,
        thumbnail: product.thumbnail,
        permalink: product.permalink,
        status: finalStatus, // Atribui o status final calculado
        shipping_type: shippingType[product.shipping?.logistic_type] || 'Customizado',
        shipping_free: product.shipping?.free_shipping || false,
        health: product.health,
        created_at: product.date_created,
        updated_at: product.last_updated,
        visits: visitsHistory,
        stock_available: product.available_quantity,
        stock_init: product.initial_quantity,
        product_data: product,
        total_sold: product.sold_quantity,
        sale_price: product.price,
        cost_unit: 0,

    };

    // O restante da função permanece o mesmo para calcular taxas, lucros, etc.
    data.tax_nfe_unit = data.sale_price * tax_nfe;
    data.total_visits = (visitsData && !visitsData.error && visitsData[productId]) ? visitsData[productId] : 0;

    const [sellingFeesData, shippingCostData] = await Promise.all([
        fetchSellingFees(meliFetch, product).catch(() => ({ cost: 0, error: 'failed_to_fetch' })),
        fetchShippingCosts(meliFetch, product).catch(() => ({ cost: 0, error: 'failed_to_fetch' }))
    ]);

    data.selling_fees = sellingFeesData;
    data.marketplace_fee_total = sellingFeesData?.total_fee || 0;

    data.shipping_costs = shippingCostData;
    data.estimated_shipping_cost = data.shipping_free ? (shippingCostData?.cost || 0) : 0;

    data.tax_meli_unit = data.estimated_shipping_cost + data.marketplace_fee_total;
    data.profit_unit = data.sale_price - data.cost_unit - data.tax_nfe_unit - data.tax_meli_unit;
    data.profit_unit_percent = data.sale_price > 0 ? (data.profit_unit / data.sale_price * 100).toFixed(2) : "0.00";
    data.markup_percent = data.cost_unit > 0 ? (data.profit_unit / data.cost_unit * 100).toFixed(2) : "0.00";

    data.received_total_gross = data.sale_price * data.total_sold;
    data.received_total_cost = data.cost_unit * data.total_sold;
    data.received_total_profit = data.profit_unit * data.total_sold;

    data.receivable_total_gross = data.sale_price * data.stock_available;
    data.receivable_total_cost = data.cost_unit * data.stock_available;
    data.receivable_total_profit = data.profit_unit * data.stock_available;
    data.receivable_total_profit_percent = data.receivable_total_gross > 0 ? (data.receivable_total_profit / data.receivable_total_gross * 100).toFixed(2) : "0.00";

    if (product.variations?.length > 0) {
        data.variations = product.variations.map(variation => {
            const attributes = {
                ...variation,
                attribute_1_name: variation.attribute_combinations[0]?.name,
                attribute_1_value: variation.attribute_combinations[0]?.value_name,
                title: `${variation.attribute_combinations[0]?.value_name}`,
                thumbnail: getThumbnailUrl(product, variation.picture_ids[0]),
            };
            if (variation.attribute_combinations[1]?.name) {
                attributes.attribute_2_name = variation.attribute_combinations[1].name;
                attributes.attribute_2_value = variation.attribute_combinations[1].value_name;
            }
            attributes.profit_unit = variation.price - data.cost_unit - data.tax_nfe_unit - data.tax_meli_unit;
            attributes.receivable_total_gross = attributes.price * attributes.available_quantity;
            attributes.receivable_total_cost = data.cost_unit * attributes.available_quantity;
            attributes.receivable_total_profit = attributes.profit_unit * attributes.available_quantity;
            attributes.receivable_total_profit_percent = attributes.receivable_total_gross > 0 ? (attributes.receivable_total_profit / attributes.receivable_total_gross * 100).toFixed(2) : "0.00";
            return attributes;
        });
    }

    return data;
};

/**
 * Orquestra a busca dos detalhes de múltiplos produtos em lotes para evitar rate limits.
 */
const fetchProductsDetails = async (meliFetch, allProductsIds, fetchCompleteData = false, event = null) => {
    const batchSize = 5; // Lote pequeno para evitar sobrecarga na API
    const productsDetails = [];

    for (let i = 0; i < allProductsIds.length; i += batchSize) {
        const batch = allProductsIds.slice(i, i + batchSize);
        const batchPromises = batch.map(productId => fetchSingleProductDetails(meliFetch, productId, fetchCompleteData, event));

        try {
            const batchResults = await Promise.allSettled(batchPromises) || [];
            batchResults.forEach((result, index) => {
                if (result.status === 'fulfilled' && result.value) {
                    productsDetails.push(result.value);
                } else {
                    console.error(`Erro ao processar produto ${batch[index]}:`, result.reason);
                    productsDetails.push(createBasicData({ id: batch[index] }));
                }
            });

            // Delay entre os lotes para respeitar os limites da API
            if (i + batchSize < allProductsIds.length) {
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        } catch (error) {
            console.error(`Erro no processamento do lote ${i}-${i + batchSize}:`, error);
        }
    }

    // Ordena os produtos para uma exibição consistente no front-end.
    productsDetails.sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (a.status !== 'active' && b.status === 'active') return 1;
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateB - dateA;
    });

    return productsDetails;
};

/**
 * Cria um objeto de produto básico em caso de falha na busca, para manter a integridade dos dados.
 */
const createBasicData = (product) => ({
    ...product,
    fetched_at: new Date().toISOString(),
    fetch_errors: {
        product: 'failed_to_fetch',
        shipping: 'failed_to_fetch',
        advertising: 'failed_to_fetch',
        shipping_cost: 'failed_to_fetch',
        visits: 'failed_to_fetch',
        selling_fees: 'failed_to_fetch',
    },
    status: 'error'
});

/**
 * Busca os detalhes individuais de um único produto (item e visitas).
 */
const fetchSingleProductDetails = async (meliFetch, productId, fetchCompleteData = false, event = null) => {
    if (!productId) {
        return null;
    }

    const [productDetail, visitsData] = await Promise.all([
        meliFetch(`items/${productId}?include_attributes=all`).catch(err => ({ error: 'product_details_fetch_failed', details: err })),
        meliFetch(`visits/items?ids=${productId}`).catch(err => ({ error: 'visits_fetch_failed', details: err }))
    ]);

    if (productDetail.error) {
        console.error(`Falha ao buscar detalhes do produto ${productId}:`, productDetail.details);
        return createBasicData({ id: productId });
    }

    // Buscar histórico completo de visitas desde a criação do produto
    const visitsHistory = await fetchProductVisitsHistory(meliFetch, productId, event);

    return createProductData(productDetail, visitsData, meliFetch, productId, visitsHistory);
};

/**
 * Busca as taxas de venda de um produto na API do Mercado Livre.
 */
const fetchSellingFees = async (meliFetch, product) => {
    try {
        const siteId = product.site_id || product.id.substring(0, 3);
        const listingTypeId = product.listing_type_id || 'gold_special';
        let categoryId = product.category_id;

        if (!categoryId) {
            return { percentage: 0, fixed_fee: 0, total_fee: 0, error: 'no_category_id' };
        }

        await new Promise(resolve => setTimeout(resolve, 100)); // Pequeno delay
        const apiUrl = `sites/${siteId}/listing_prices?price=${product.price}&listing_type_id=${listingTypeId}&category_id=${categoryId}`;
        const feesResponse = await meliFetch(apiUrl);

        if (feesResponse?.sale_fee_details) {
            return {
                percentage: feesResponse.sale_fee_details.percentage_fee || 0,
                fixed_fee: feesResponse.sale_fee_details.fixed_fee || 0,
                total_fee: feesResponse.sale_fee_details.gross_amount || 0,
                raw_data: feesResponse
            };
        }
        return { percentage: 0, fixed_fee: 0, total_fee: 0, error: 'no_fees_found' };
    } catch (error) {
        console.error(`[fetchSellingFees] Erro ao buscar taxas para ${product.id}:`, error);
        throw error;
    }
};

/**
 * Busca os custos de envio de um produto na API do Mercado Livre.
 */
const fetchShippingCosts = async (meliFetch, product) => {
    try {
        const userId = '1492625301'; // ID do vendedor
        if (!product.shipping?.free_shipping) {
            return { cost: 0, currency: 'BRL', error: 'not_free_shipping' };
        }

        const params = new URLSearchParams({
            item_price: product.price,
            listing_type_id: product.listing_type_id || 'gold_special',
            mode: product.shipping?.mode || 'me2',
            condition: product.condition || 'new',
            logistic_type: product.shipping?.logistic_type || 'fulfillment',
            verbose: 'true',
            dimensions: product.shipping?.dimensions || '10x10x10,100',
        });

        if (product.category_id) {
            params.append('category_id', product.category_id);
        }

        const apiUrl = `users/${userId}/shipping_options/free?${params.toString()}`;
        const shippingResponse = await meliFetch(apiUrl);

        if (shippingResponse?.coverage?.all_country?.list_cost !== undefined) {
            return {
                cost: shippingResponse.coverage.all_country.list_cost,
                currency: shippingResponse.coverage.all_country.currency_id || 'BRL',
                raw_data: shippingResponse
            };
        }
        return { cost: 0, currency: 'BRL', error: 'no_cost_found' };
    } catch (error) {
        console.error(`[fetchShippingCosts] Erro ao buscar custos de envio para ${product.id}:`, error);
        throw error;
    }
};

/**
 * Gera um relatório agregado com base nos detalhes dos produtos filtrados.
 */
const generateProductsReport = (productDetails) => {
    const report = {
        total_products: productDetails.length,
        total_stock_available: 0,
        total_cost: 0,
        total_gross: 0,
        total_profit: 0,
        total_profit_percent: 0,
        total_products_active: 0,
        total_products_paused: 0,
        total_visits: 0,
        total_marketplace_fees: 0,
        total_shipping_costs: 0
    };

    productDetails.forEach(product => {
        if (product.status === 'active') report.total_products_active++;
        else if (product.status === 'paused') report.total_products_paused++;

        report.total_visits += product.total_visits || 0;

        if (!product.product_data?.catalog_listing) {
            report.total_stock_available += product.stock_available || 0;
            report.total_cost += product.receivable_total_cost || 0;
            report.total_gross += product.receivable_total_gross || 0;
            report.total_profit += product.receivable_total_profit || 0;
            report.total_marketplace_fees += (product.marketplace_fee_total * product.stock_available) || 0;
            report.total_shipping_costs += (product.estimated_shipping_cost * product.stock_available) || 0;
        }
    });

    if (report.total_gross > 0) {
        report.total_profit_percent = (report.total_profit / report.total_gross * 100);
    }

    return { report };
};

/**
 * Obtém a URL da miniatura de uma variação específica do produto.
 */
const getThumbnailUrl = (product, pictureId) => {
    return product.pictures?.find(picture => picture.id === pictureId)?.url || product.thumbnail || '';
};

/**
 * Busca o histórico completo de visitas de um produto e atualiza o registro no banco.
 * Formato do retorno: { "2025-01-13": 45, "2025-01-12": 32, ... }
 */
const fetchProductVisitsHistory = async (meliFetch, productId, event) => {
    try {
        const supabase = await serverSupabaseClient(event);

        // Buscar o registro atual do produto para pegar o histórico existente
        const { data: existingProduct } = await supabase
            .from('products')
            .select('visits, created_at, connection_id')
            .eq('meli_id', productId)
            .single();

        // Pegar histórico existente ou iniciar novo objeto
        const visitsHistory = existingProduct?.visits || {};

        // Calcular quantos dias desde a criação do produto (máximo 90 dias pela API do ML)
        const createdAt = existingProduct?.created_at ? new Date(existingProduct.created_at) : new Date();
        const today = new Date();
        const daysSinceCreation = Math.ceil((today - createdAt) / (1000 * 60 * 60 * 24));
        const daysToFetch = Math.min(daysSinceCreation, 90); // API do ML limita a 90 dias

        // Buscar visitas dos últimos dias disponíveis
        const response = await meliFetch(`items/${productId}/visits/time_window?last=${daysToFetch}&unit=day`);

        if (response && response.results) {
            response.results.forEach(dayData => {
                const dateKey = dayData.date.split('T')[0]; // Formato: "2025-01-13"
                visitsHistory[dateKey] = dayData.total;
            });
        }

        return visitsHistory;
    } catch (error) {
        console.error(`[fetchProductVisitsHistory] Erro ao buscar histórico de visitas para ${productId}:`, error);
        return {};
    }
};

// Função para salvar produtos no banco de dados
async function saveProductsToDatabase(productsDetails, userId, event) {
    const supabase = await serverSupabaseClient(event);

    // Buscar connection_id do usuário
    const { data: connection } = await supabase
        .from('connections')
        .select('id')
        .eq('profile_id', userId)
        .single();

    if (!connection) {
        throw new Error('Conexão não encontrada');
    }

    // Preparar dados para inserção
    const productsToInsert = productsDetails.map(product => ({
        id: randomUUID(),
        meli_id: product.id_meli,
        title: product.title,
        thumbnail: product.thumbnail,
        permalink: product.permalink,
        status: product.status,
        health: product.health,
        created_at: product.created_at,
        updated_at: product.updated_at,

        connection_id: connection.id,

        // Dados de estoque e vendas
        stock_init: product.stock_init,
        stock_available: product.stock_available,
        qtd_sold: product.total_sold,
        visits: product.visits,
        sale_price: product.sale_price,

        // Dados de envio
        shipping_type: product.shipping_type,
        shipping_free: product.shipping_free,
        shipping_costs: product.shipping_costs,
        shipping_cost_estimated: product.estimated_shipping_cost,

        // Dados de taxas
        selling_fees: product.selling_fees,
        marketplace_fee_percentage: product.selling_fees?.percentage || 0,
        marketplace_fee_fixed: product.selling_fees?.fixed_fee || 0,
        marketplace_fee_total: product.marketplace_fee_total,

        // Variações
        variations: product.variations,

        // Dados de sincronização
        api_last_checked: new Date().toISOString(),
        needs_sync: false,
        sync_attempts: 0,
        last_sync_error: null,

        // Dados completos para auditoria
        fetch_data: product.product_data
    }));

    // Inserir ou atualizar produtos no banco (upsert)
    const { error } = await supabase
        .from('products')
        .upsert(productsToInsert, {
            onConflict: 'meli_id,connection_id',
            ignoreDuplicates: false
        });

    if (error) {
        throw new Error(`Erro ao salvar produtos: ${error.message}`);
    }
}

// Função para converter dados do banco para formato da API
function convertDbProductsToApiFormat(dbProducts) {
    const tax_nfe = 0.04;

    return dbProducts.map(product => {
        // Calcular total de visitas do objeto visits (chave = data, valor = total)
        const total_visits = product.visits
            ? Object.values(product.visits).reduce((sum, val) => sum + (val || 0), 0)
            : 0;

        // Calcular custos e lucros - usar o cost_unit do banco de dados
        const cost_unit = product.cost_unit || 0;
        const tax_nfe_unit = product.sale_price * tax_nfe;
        const tax_meli_unit = product.shipping_cost_estimated + product.marketplace_fee_total;
        const profit_unit = product.sale_price - cost_unit - tax_nfe_unit - tax_meli_unit;
        const profit_unit_percent = product.sale_price > 0 ? (profit_unit / product.sale_price * 100).toFixed(2) : "0.00";

        // LINHA ADICIONADA: Cálculo do Markup sobre o custo
        const markup_percent = cost_unit > 0 ? (profit_unit / cost_unit * 100).toFixed(2) : "0.00";

        // Calcular totais recebidos
        const received_total_gross = product.sale_price * product.qtd_sold;
        const received_total_cost = cost_unit * product.qtd_sold;
        const received_total_profit = profit_unit * product.qtd_sold;

        // Calcular totais a receber
        const receivable_total_gross = product.sale_price * product.stock_available;
        const receivable_total_cost = cost_unit * product.stock_available;
        const receivable_total_profit = profit_unit * product.stock_available;
        const receivable_total_profit_percent = receivable_total_gross > 0
            ? (receivable_total_profit / receivable_total_gross * 100).toFixed(2)
            : "0.00";

        return {
            id_meli: product.meli_id,
            title: product.title,
            thumbnail: product.thumbnail,
            permalink: product.permalink,
            status: product.status,
            health: product.health,
            created_at: product.created_at,
            updated_at: product.updated_at,

            // Dados de estoque e vendas
            stock_init: product.stock_init,
            stock_available: product.stock_available,
            total_sold: product.qtd_sold,
            visits: product.visits,
            total_visits,
            sale_price: product.sale_price,

            // Custos e taxas
            cost_unit,
            tax_nfe_unit,
            tax_meli_unit,
            profit_unit,
            profit_unit_percent,
            markup_percent, // CAMPO ADICIONADO AO RETORNO

            // Dados de envio
            shipping_type: product.shipping_type,
            shipping_free: product.shipping_free,
            shipping_costs: product.shipping_costs,
            estimated_shipping_cost: product.shipping_cost_estimated,

            // Dados de taxas
            selling_fees: product.selling_fees,
            marketplace_fee_total: product.marketplace_fee_total,

            // Totais recebidos
            received_total_gross,
            received_total_cost,
            received_total_profit,

            // Totais a receber
            receivable_total_gross,
            receivable_total_cost,
            receivable_total_profit,
            receivable_total_profit_percent,

            // Variações
            variations: product.variations,

            // Dados do produto original
            product_data: product.fetch_data || {},

            // Timestamps para auditoria
            fetched_at: product.api_last_checked,

            // Flags de erro para debug
            fetch_errors: product.fetch_data?.fetch_errors || {}
        };
    });
}

