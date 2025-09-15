
import { serverSupabaseUser } from "#supabase/server";
import { useServerDefaultValues } from "~/server/utils/useServerDefaultValues.js";
import { useServerFetchAllPagination } from "~/server/utils/useServerFetchAllPagination.ts";

const {
    productCost,
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
    const query = getQuery(event);
    const sellerId = await getSellerId();

    const statusFilter = query.status || 'all_products';

    const searchPromises = [
        await useServerFetchAllPagination(meliFetch, `/users/${sellerId}/items/search`, {...query, sort: 'date_desc', status: 'active'}),
        await useServerFetchAllPagination(meliFetch, `/users/${sellerId}/items/search`, {...query, sort: 'date_desc', status: 'paused'})
    ];

    if (statusFilter === 'closed' || statusFilter === 'all_products') {
        searchPromises.push(useServerFetchAllPagination(meliFetch, `/users/${sellerId}/items/search`, { ...query, sort: 'date_desc', status: 'closed' }));
    }

    const results = await Promise.all(searchPromises);
    const allProductsIds = [...new Set(results.flat())]; // Usa Set para remover IDs duplicados

    if (!allProductsIds || !allProductsIds.length) {
        return { data: { products: [], report: {}, report_per_product: [] } };
    }

    // 2. Buscar os detalhes completos dos produtos.
    // A função fetchProductsDetails já chama createProductData, que define o 'finalStatus'.
    const productsDetails = await fetchProductsDetails(meliFetch, allProductsIds);

    // 3. Aplicar o filtro final após ter todos os dados, incluindo o 'no_stock'.
    const filteredProducts = filterProducts(productsDetails, statusFilter);

    const { report } = generateProductsReport(filteredProducts);

    return {
        data: {
            products: filteredProducts,
            report,
        }
    };
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
    }
    return products.filter(product => product.status === filter);
};

/**
 * Monta o objeto final do produto, calculando métricas e definindo o status correto.
 */
const createProductData = async (product, visitsData, meliFetch, productId, visitsLast3Days = { today: 0, yesterday: 0, day_before_yesterday: 0 }) => {
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
        visits: product.visits,
        stock_available: product.available_quantity,
        stock_init: product.initial_quantity,
        product_data: product,
        total_sold: product.sold_quantity,
        sale_price: product.price,
        cost_unit: productCost[product.id] || 0,
        visits_last_3_days: visitsLast3Days, // Adiciona o novo campo com detalhes por dia (today, yesterday, day_before_yesterday)

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
const fetchProductsDetails = async (meliFetch, allProductsIds) => {
    const batchSize = 5; // Lote pequeno para evitar sobrecarga na API
    const productsDetails = [];

    for (let i = 0; i < allProductsIds.length; i += batchSize) {
        const batch = allProductsIds.slice(i, i + batchSize);
        const batchPromises = batch.map(productId => fetchSingleProductDetails(meliFetch, productId));

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
const fetchSingleProductDetails = async (meliFetch, productId) => {
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

    // Adiciona a busca de visitas dos últimos 3 dias aqui
    const visitsLast3Days = await fetchProductVisitsLastDays(meliFetch, productId, 3);

    return createProductData(productDetail, visitsData, meliFetch, productId, visitsLast3Days);
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
 * Busca o total de visitas de um produto nos últimos N dias.
 */
const fetchProductVisitsLastDays = async (meliFetch, productId, lastDays) => {
    try {
        const response = await meliFetch(`items/${productId}/visits/time_window?last=${lastDays}&unit=day`);
        if (response && response.results) {
            const visits = {
                today: 0,
                yesterday: 0,
                day_before_yesterday: 0,
            };

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);

            const dayBeforeYesterday = new Date(today);
            dayBeforeYesterday.setDate(today.getDate() - 2);

            response.results.forEach(dayData => {
                const resultDate = new Date(dayData.date);
                resultDate.setHours(0, 0, 0, 0);

                if (resultDate.getTime() === today.getTime()) {
                    visits.today = dayData.total;
                } else if (resultDate.getTime() === yesterday.getTime()) {
                    visits.yesterday = dayData.total;
                } else if (resultDate.getTime() === dayBeforeYesterday.getTime()) {
                    visits.day_before_yesterday = dayData.total;
                }
            });
            return visits;
        }
        return { today: 0, yesterday: 0, day_before_yesterday: 0 };
    } catch (error) {
        console.error(`[fetchProductVisitsLastDays] Erro ao buscar visitas para ${productId} nos últimos ${lastDays} dias:`, error);
        return { today: 0, yesterday: 0, day_before_yesterday: 0 };
    }
};


