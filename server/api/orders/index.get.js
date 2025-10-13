import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import {useServerDefaultValues} from "~/server/utils/useServerDefaultValues.js";
import {useServerFetchAllPagination} from "~/server/utils/useServerFetchAllPagination.ts";
import {useOrderSync} from "~/server/utils/useOrderSync.js";
import { randomUUID } from 'crypto';

export default defineEventHandler(async (event) => {

    const user = await serverSupabaseUser(event)

    if (!user) {
        throw createError({
            status: 401,
            statusMessage: 'Usuário não autenticado',
        })
    }

    const { meliFetch, getSellerId } = await useServerMeli(event);
    const { getOrdersFromDatabase, syncOrder } = await useOrderSync(event);
    let query = getQuery(event)

    // Validação dos parâmetros de entrada
    if (!query.date_range || !Array.isArray(query.date_range) || query.date_range.length !== 2) {
        throw createError({
            status: 400,
            statusMessage: 'Parâmetro date_range é obrigatório e deve conter 2 datas',
        })
    }

    try {
        // Adicionar user_id ao query para buscar pedidos do banco
        query.user_id = user.id;

        // Buscar pedidos do banco de dados
        let dbOrders = [];
        try {
            dbOrders = await getOrdersFromDatabase(query);
        } catch (error) {
            if (error.message === 'Conexão não encontrada') {
                throw createError({
                    status: 400,
                    statusMessage: 'Nenhuma conexão com o Mercado Livre encontrada. Por favor, configure uma conexão primeiro.',
                });
            }
            throw error;
        }

        // Verificar se precisamos buscar da API
        const needsApiFetch = shouldFetchFromAPI(dbOrders, query.date_range);

        if (needsApiFetch) {
            console.log('Buscando pedidos da API para garantir dados completos...');

            const apiQuery = {
                ...query,
                seller: await getSellerId(),
                sort: 'date_desc',
                'order.date_created.from': query.date_range[0],
                'order.date_created.to': query.date_range[1],
            };

            const allOrders = await useServerFetchAllPagination(meliFetch, 'orders/search', apiQuery);

            if (!allOrders.length) {
                return { data: { orders: [], report: {} } };
            }

            // Processar pedidos da API (primeira vez - busca dados completos)
            const apiOrdersDetails = await fetchOrdersDetails(meliFetch, allOrders, true, event);

            // Salvar/atualizar pedidos no banco
            await saveOrdersToDatabase(apiOrdersDetails, user.id, event);

            const {report, report_per_product} = generateOrdersReport(apiOrdersDetails);

            return {
                data: {
                    orders: apiOrdersDetails,
                    report,
                    report_per_product,
                }
            };
        } else {
            console.log('Usando dados do banco (dados já estão atualizados)...');

            // Buscar dados básicos da API apenas para verificar se há novos pedidos
            const apiQuery = {
                ...query,
                seller: await getSellerId(),
                sort: 'date_desc',
                'order.date_created.from': query.date_range[0],
                'order.date_created.to': query.date_range[1],
            };

            const allOrders = await useServerFetchAllPagination(meliFetch, 'orders/search', apiQuery);

            // Se há novos pedidos, processar apenas os novos
            if (allOrders.length > dbOrders.length) {
                console.log(`Encontrados ${allOrders.length - dbOrders.length} novos pedidos, processando...`);
                const newOrders = allOrders.slice(0, allOrders.length - dbOrders.length);
                const newOrdersDetails = await fetchOrdersDetails(meliFetch, newOrders, false, event);
                await saveOrdersToDatabase(newOrdersDetails, user.id, event);
            }

            // Converter dados do banco para o formato esperado pelo frontend
            const dbOrdersDetails = convertDbOrdersToApiFormat(dbOrders);

            const {report, report_per_product} = generateOrdersReport(dbOrdersDetails);

            return {
                data: {
                    orders: dbOrdersDetails,
                    report,
                    report_per_product,
                }
            };
        }


    }
    catch (error) {

        console.error('Erro ao busca detalhes dos produtos:', error);

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

})

// Função para buscar detalhes dos pedidos em lotes
async function fetchOrdersDetails(meliFetch, allOrders, fetchCompleteData = false, event = null) {

    const batchSize = 10;
    const ordersDetails = [];

    for (let i = 0; i < allOrders.length; i += batchSize) {

        const batch = allOrders.slice(i, i + batchSize);

        const batchPromises = batch.map(order =>
            fetchSingleOrderDetails(meliFetch, order, fetchCompleteData, event)
        );

        try {

            const batchResults = await Promise.allSettled(batchPromises);

            batchResults.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    ordersDetails.push(result.value);
                } else {
                    console.error(`Erro ao processar pedido ${batch[index].id}:`, result.reason);
                    ordersDetails.push(createBasicOrderData(batch[index]));
                }
            });

            if (i + batchSize < allOrders.length) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }

        } catch (error) {
            console.error(`Erro no lote ${i}-${i + batchSize}:`, error);
        }
    }

    return ordersDetails;
}

// Função para buscar custo do produto do banco de dados
async function getProductCostFromDatabase(meliId, event) {
    try {
        const supabase = await serverSupabaseClient(event);
        const user = await serverSupabaseUser(event);

        if (!user) return 0;

        // Buscar connection_id do usuário
        const { data: connection } = await supabase
            .from('connections')
            .select('id')
            .eq('profile_id', user.id)
            .single();

        if (!connection) return 0;

        // Buscar custo do produto
        const { data: product } = await supabase
            .from('products')
            .select('cost_unit')
            .eq('meli_id', meliId)
            .eq('connection_id', connection.id)
            .single();

        return product?.cost_unit || 0;
    } catch (error) {
        console.error(`Erro ao buscar custo do produto ${meliId}:`, error);
        return 0;
    }
}

// Função para buscar detalhes de um pedido específico
async function fetchSingleOrderDetails(meliFetch, order, fetchCompleteData = false, event = null) {

    const requests = [];

    // Se não for busca completa, usar dados do banco para produtos
    if (!fetchCompleteData) {
        // Buscar produto do banco
        const productFromDb = await getProductFromDatabase(order.order_items?.[0]?.item?.id, event);
        requests.push(Promise.resolve(productFromDb));
    } else {
        // Request básicos sempre necessários (primeira busca)
        if (order.order_items?.[0]?.item?.id) {
            requests.push(
                meliFetch(`items/${order.order_items[0].item.id}`)
                    .catch(err => ({ error: 'product_fetch_failed', details: err }))
            );
        } else {
            requests.push(Promise.resolve({ error: 'no_product_id' }));
        }
    }

    // Buscar dados de frete apenas se for busca completa
    if (fetchCompleteData) {
        if (order.shipping?.id) {
            requests.push(
                meliFetch(`shipments/${order.shipping.id}`)
                    .catch(err => ({ error: 'shipping_fetch_failed', details: err }))
            );
        } else {
            requests.push(
                Promise.resolve({ error: 'no_shipping_id' })
            );
        }

        if (order.shipping?.id) {
            requests.push(
                meliFetch(`shipments/${order.shipping.id}/costs`)
                    .catch(err => ({ error: 'shipping_costs_fetch_failed', details: err }))
            );
        } else {
            requests.push(
                Promise.resolve({ error: 'no_shipping_id' })
            );
        }
    } else {
        // Na segunda busca, usar dados básicos de frete do pedido original
        requests.push(Promise.resolve({
            logistic_type: order.shipping?.logistic_type || 'unknown',
            status: order.shipping?.status || 'unknown',
            base_cost: 0
        }));
        requests.push(Promise.resolve({
            gross_amount: 0,
            senders: [{ cost: 0 }]
        }));
    }

    if (order.tags?.includes("advertising")) {
        requests.push(
            meliFetch(`orders/${order.id}/promotion_packs`)
                .catch(err => ({ error: 'advertising_fetch_failed', details: err }))
        );
    } else {
        requests.push(Promise.resolve(null));
    }

    const [product, shipping, shipping_costs, advertising] = await Promise.all(requests);

    // Buscar custo do produto do banco
    const productCost = await getProductCostFromDatabase(order.order_items?.[0]?.item?.id, event);

    return createOrderData(order, product, shipping, shipping_costs, advertising, productCost);
}

// Função para criar dados estruturados do pedido
function createOrderData(order, product, shipping, shipping_costs, advertising, productCostUnit = 0) {

    const { shippingType } = useServerDefaultValues()

    const orderItem = order.order_items?.[0] || {};
    const shippingData = shipping?.error ? {} : shipping;

    const quantity = orderItem.quantity || 0
    const unit_price = orderItem.unit_price || 0
    const order_total = order.total_amount || 0
    const tax_marketplace = orderItem.sale_fee * quantity || 0

    const tax_marketplace_shipping_before =  shipping_costs.gross_amount > 0 ? shipping_costs.gross_amount : 0
    const tax_marketplace_shipping_after = shipping_costs.senders[0]?.cost > 0 ? shipping_costs.senders[0].cost : 0

    const tax_nfe = calculateNfeTax(order, orderItem)
    const tax_nfe_percent = 0.04
    const advertising_cost = 0
    const product_cost_unit = productCostUnit
    const product_cost_total = quantity * product_cost_unit
    const net_revenue = order_total - tax_marketplace - tax_marketplace_shipping_after - advertising_cost - tax_nfe - product_cost_total;
    const net_revenue_percent = (net_revenue / product_cost_total * 100).toFixed(2)

    return {

        // Dados básicos do pedido
        order_number: order.id,
        order_status: order.status,
        date_created: order.date_created,
        date_closed: order.date_closed,

        // Dados do produto
        item_id: orderItem.item?.id,
        item_title: product?.error ? 'Produto não encontrado' : product?.title,
        item_sku: orderItem.item?.seller_sku,
        item_thumbnail: getThumbnailUrl(product, orderItem.item.variation_id),
        item_variations: orderItem.item.variations_attributes,
        item_meli_id: orderItem.item.id,
        item_variation_attributes: orderItem.item.variation_attributes,

        // Quantidades e valores
        quantity,
        unit_price,
        order_total,

        // Taxas detalhadas
        tax_marketplace, // TAXA DO MERCADO LIVRE
        tax_marketplace_shipping_before, // TAXA DE TRANSPORTE 50% SEM DESCONTO DE REPUTACAO
        tax_marketplace_shipping_after, // TAXA DE TRANSPORTE 50% COM DESCONTO DE REPUTACAO
        advertising_cost, // CUSTO DA PUBLICIDADE

        // NFe simulada
        tax_nfe,
        tax_nfe_percent,

        // Custo do produto
        product_cost_unit,
        product_cost_total,

        // TOTAL LUCRO
        net_revenue,
        net_revenue_percent,

        // Dados de envio
        shipping_id: order.shipping?.id,
        shipping_type: shippingType[shippingData.logistic_type] || "DESCONHECIDO",
        shipping_status: shippingData.status,
        shipping_base_cost: shippingData.base_cost || 0,

        // Status e tags
        tags: order.tags || [],

        // Dados de publicidade (se aplicável)
        has_advertising: order.tags?.includes("advertising") || false,
        advertising_data: advertising && !advertising.error ? advertising : null,

        // Dados do comprador (básicos)
        buyer_id: order.buyer?.id,
        buyer_nickname: order.buyer?.nickname,

        // Metadados
        order_type: order.order_type,

        // Timestamps para auditoria
        fetched_at: new Date().toISOString(),

        // Flags de erro para debug
        fetch_errors: {
            product: product?.error || null,
            shipping: shipping?.error || null,
            advertising: advertising?.error || null
        },

        details_data: {
            order,
            product,
            shipping_costs,
            shipping,
            advertising
        }
    };
}

// Função para criar dados básicos quando há erro
function createBasicOrderData(order) {
    const orderItem = order.order_items?.[0] || {};

    return {
        order_number: order.id,
        date_created: order.date_created,
        quantity: orderItem.quantity || 0,
        order_total: order.total_amount || 0,
        order_status: order.status,
        tags: order.tags || [],
        currency_id: order.currency_id,

        // Dados básicos de taxas e bônus
        nfe_tax: 0,

        fetched_at: new Date().toISOString(),
        fetch_errors: {
            product: 'failed_to_fetch',
            shipping: 'failed_to_fetch',
            advertising: 'failed_to_fetch',
            shipping_cost: 'failed_to_fetch',

        }
    };
}

// Função para calcular taxa de NFe baseada em regras de negócio
function calculateNfeTax(order, orderItem) {

    // Implementar lógica específica para cálculo de NFe
    // Exemplo: pode ser baseado em percentual do valor do produto
    const orderTotal = order.total_amount || 0;
    const nfeRate = 0.04; // 3.65% exemplo - ajustar conforme sua regra

    return Math.round(orderTotal * nfeRate * 100) / 100; // Arredondar para 2 casas decimais

}

// Função para gerar relatório consolidado
function generateOrdersReport(ordersDetails) {

    const report = {
        total_orders: ordersDetails.length,
        period_summary: {
            first_order_date: null,
            last_order_date: null
        },
        total_products: 0,
        total_unit_price: 0,
        total_tax_marketplace: 0,
        total_tax_marketplace_shipping_before: 0,
        total_tax_marketplace_shipping_after: 0,
        total_tax_nfe: 0,
        total_product_cost: 0,
        total_product_cost_percent: 0,
        total_gross_revenue: 0,
        total_net_revenue: 0,
        total_net_revenue_percent: 0,
        total_canceled_orders: 0,
        total_canceled_products: 0,
        total_canceled_gross_revenue: 0,
    };

    const report_per_product = {}

    let firstDate = null;
    let lastDate = null;

    ordersDetails.forEach(order => {

        if (order.order_status === 'paid') {

            const key = `${order.item_id}-${order.item_sku}`

            if (!report_per_product[key]) {
                report_per_product[key] = {
                    product_data: {
                        item_id: order.item_id,
                        item_title: order.item_title,
                        item_sku: order.item_sku,
                        item_thumbnail: order.item_thumbnail,
                        item_variations: order.item_variations,
                        item_variation_attributes: order.item_variation_attributes,
                    },
                    total_orders: 0,
                    total_products: 0,
                    total_unit_price: 0,
                    total_tax_marketplace: 0,
                    total_tax_marketplace_shipping_before: 0,
                    total_tax_marketplace_shipping_after: 0,
                    total_tax_nfe: 0,
                    total_product_cost: 0,
                    total_product_cost_percent: 0,
                    total_gross_revenue: 0,
                    total_net_revenue: 0,
                    total_net_revenue_percent: 0,
                    total_canceled_orders: 0,
                    total_canceled_products: 0,
                    total_canceled_gross_revenue: 0,
                };
            }

            report.total_products += order.quantity || 0;
            report.total_unit_price += order.unit_price || 0;
            report.total_gross_revenue += order.order_total || 0;
            report.total_tax_marketplace += order.tax_marketplace || 0;
            report.total_tax_marketplace_shipping_before += order.tax_marketplace_shipping_before || 0;
            report.total_tax_marketplace_shipping_after += order.tax_marketplace_shipping_after || 0;
            report.total_advertising_cost += order.advertising_cost || 0;
            report.total_tax_nfe += order.tax_nfe || 0;
            report.total_product_cost += order.product_cost_total || 0;
            report.total_net_revenue += order.net_revenue || 0;

            report_per_product[key].total_orders += 1
            report_per_product[key].total_products += order.quantity || 0;
            report_per_product[key].total_unit_price += order.unit_price || 0;
            report_per_product[key].total_gross_revenue += order.order_total || 0;
            report_per_product[key].total_tax_marketplace += order.tax_marketplace || 0;
            report_per_product[key].total_tax_marketplace_shipping_before += order.tax_marketplace_shipping_before || 0;
            report_per_product[key].total_tax_marketplace_shipping_after += order.tax_marketplace_shipping_after || 0;
            report_per_product[key].total_advertising_cost += order.advertising_cost || 0;
            report_per_product[key].total_tax_nfe += order.tax_nfe || 0;
            report_per_product[key].total_product_cost += order.product_cost_total || 0;
            report_per_product[key].total_net_revenue += order.net_revenue || 0;


        } else {

            report.total_canceled_orders += 1;
            report.total_canceled_products += order.quantity || 0;
            report.total_canceled_gross_revenue += order.order_total || 0;

        }

        // Controlar datas do período
        const orderDate = new Date(order.date_created);
        if (!firstDate || orderDate < firstDate) {
            firstDate = orderDate;
        }
        if (!lastDate || orderDate > lastDate) {
            lastDate = orderDate;
        }

    });

    // Calcular receita líquida
    report.total_net_revenue_percent = (report.total_net_revenue / report.total_product_cost * 100).toFixed(2);

    // Definir período
    report.period_summary.first_order_date = firstDate?.toISOString();
    report.period_summary.last_order_date = lastDate?.toISOString();

    return {report, report_per_product};

}

// Função para pegar a imagem de capa do produto
function getThumbnailUrl(product, order_variation) {

    if(product?.variations?.length <= 1 || !product.variations) {
        return product.thumbnail;
    }

    const variation = product.variations.find(variation => variation.id === order_variation);
    return product.pictures.find(picture => picture.id === variation.picture_ids[0])?.url || product.thumbnail;

}

// Função para salvar pedidos no banco de dados
async function saveOrdersToDatabase(ordersDetails, userId, event) {
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
    const ordersToInsert = ordersDetails.map(order => ({
        id: randomUUID(),
        order_number: order.order_number,
        status: order.order_status,
        order_created_at: order.date_created,
        order_updated_at: order.date_created,
        date_closed: order.date_closed,

        connection_id: connection.id,
        product_meli_id: order.item_meli_id,
        product_title: order.item_title,
        product_sku: order.item_sku,
        product_thumbnail: order.item_thumbnail,
        product_variation_attributes: order.item_variation_attributes,

        qtd: order.quantity,
        unit_price: order.unit_price,
        order_total: order.order_total,

        tax_marketplace: order.tax_marketplace,
        tax_marketplace_shipping_before: order.tax_marketplace_shipping_before,
        tax_marketplace_shipping_after: order.tax_marketplace_shipping_after,
        advertising_cost: order.advertising_cost,

        tax_nfe: order.tax_nfe,
        tax_nfe_percent: order.tax_nfe_percent,

        product_cost_unit: order.product_cost_unit,
        product_cost_total: order.product_cost_total,

        net_revenue: order.net_revenue,
        net_revenue_percent: order.net_revenue_percent,

        shipping_id: order.shipping_id,
        shipping_type: order.shipping_type,
        shipping_status: order.shipping_status,
        shipping_base_cost: order.shipping_base_cost,

        buyer_id: order.buyer_id,
        buyer_nickname: order.buyer_nickname,

        order_type: order.order_type,
        tags: order.tags,
        has_advertising: order.has_advertising,
        advertising_data: order.advertising_data,

        fetch_errors: order.fetch_errors,
        fetch_data: order.details_data,

        api_last_checked: new Date().toISOString(),
        needs_sync: false,
        sync_attempts: 0
    }));

    // Inserir ou atualizar pedidos no banco (upsert)
    const { error } = await supabase
        .from('orders')
        .upsert(ordersToInsert, {
            onConflict: 'order_number,connection_id',
            ignoreDuplicates: false
        });

    if (error) {
        throw new Error(`Erro ao salvar pedidos: ${error.message}`);
    }
}

// Função para converter dados do banco para formato da API
function convertDbOrdersToApiFormat(dbOrders) {
    return dbOrders.map(order => ({
        // Dados básicos do pedido
        order_number: order.order_number,
        order_status: order.status,
        date_created: order.order_created_at,
        date_closed: order.date_closed,

        // Dados do produto
        item_id: order.product_meli_id,
        item_title: order.product_title,
        item_sku: order.product_sku,
        item_thumbnail: order.product_thumbnail,
        item_variations: order.product_variation_attributes,
        item_meli_id: order.product_meli_id,
        item_variation_attributes: order.product_variation_attributes,

        // Quantidades e valores
        quantity: order.qtd,
        unit_price: order.unit_price,
        order_total: order.order_total,

        // Taxas detalhadas
        tax_marketplace: order.tax_marketplace,
        tax_marketplace_shipping_before: order.tax_marketplace_shipping_before,
        tax_marketplace_shipping_after: order.tax_marketplace_shipping_after,
        advertising_cost: order.advertising_cost,

        // NFe simulada
        tax_nfe: order.tax_nfe,
        tax_nfe_percent: order.tax_nfe_percent,

        // Custo do produto
        product_cost_unit: order.product_cost_unit,
        product_cost_total: order.product_cost_total,

        // TOTAL LUCRO
        net_revenue: order.net_revenue,
        net_revenue_percent: order.net_revenue_percent,

        // Dados de envio
        shipping_id: order.shipping_id,
        shipping_type: order.shipping_type,
        shipping_status: order.shipping_status,
        shipping_base_cost: order.shipping_base_cost,

        // Status e tags
        tags: order.tags || [],

        // Dados de publicidade (se aplicável)
        has_advertising: order.has_advertising || false,
        advertising_data: order.advertising_data,

        // Dados do comprador (básicos)
        buyer_id: order.buyer_id,
        buyer_nickname: order.buyer_nickname,

        // Metadados
        order_type: order.order_type,

        // Timestamps para auditoria
        fetched_at: order.api_last_checked,

        // Flags de erro para debug
        fetch_errors: order.fetch_errors || {},

        details_data: order.fetch_data || {}
    }));
}

// Função para buscar produto do banco de dados
async function getProductFromDatabase(meliId, event) {
    if (!meliId) {
        return { error: 'no_product_id' };
    }

    try {
        const supabase = await serverSupabaseClient(event);
        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('meli_id', meliId)
            .single();

        if (error || !product) {
            return { error: 'product_not_found_in_db' };
        }

        // Converter dados do banco para formato da API
        return {
            id: product.meli_id,
            title: product.title,
            thumbnail: product.thumbnail,
            permalink: product.permalink,
            status: product.status,
            health: product.health,
            variations: product.variations,
            pictures: product.variations?.map(v => ({ id: v.id, url: v.picture_ids?.[0] })) || []
        };
    } catch (error) {
        return { error: 'database_fetch_failed', details: error.message };
    }
}

// Função para determinar se precisa buscar da API
function shouldFetchFromAPI(dbOrders, dateRange) {
    // Se não há pedidos no banco, buscar da API
    if (!dbOrders || dbOrders.length === 0) {
        return true;
    }

    // Se há pedidos, verificar se cobrem o range completo
    const startDate = new Date(dateRange[0]);
    const endDate = new Date(dateRange[1]);

    // Ordenar pedidos por data
    const sortedOrders = dbOrders.sort((a, b) => new Date(a.order_created_at) - new Date(b.order_created_at));

    const firstOrderDate = new Date(sortedOrders[0].order_created_at);
    const lastOrderDate = new Date(sortedOrders[sortedOrders.length - 1].order_created_at);

    // Verificar se o range do banco cobre o range solicitado
    const coversStartDate = firstOrderDate <= startDate;
    const coversEndDate = lastOrderDate >= endDate;

    // Se não cobre o range completo, buscar da API
    if (!coversStartDate || !coversEndDate) {
        console.log(`Range do banco: ${firstOrderDate.toISOString()} - ${lastOrderDate.toISOString()}`);
        console.log(`Range solicitado: ${startDate.toISOString()} - ${endDate.toISOString()}`);
        return true;
    }

    // Verificar se os dados estão atualizados (última verificação há mais de 1 hora)
    const lastChecked = dbOrders.find(order => order.api_last_checked);
    if (lastChecked) {
        const lastCheckDate = new Date(lastChecked.api_last_checked);
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        if (lastCheckDate < oneHourAgo) {
            console.log('Dados do banco estão desatualizados, buscando da API...');
            return true;
        }
    }

    // Se chegou até aqui, usar dados do banco
    return false;
}
