import {serverSupabaseUser} from "#supabase/server";
import {useServerDefaultValues} from "~/server/utils/useServerDefaultValues.js";

export default defineEventHandler(async (event) => {

    const user = await serverSupabaseUser(event)

    if (!user) {
        throw createError({
            status: 401,
            statusMessage: 'Usuário não autenticado',
        })
    }

    const { meliFetch } = await useServerMeli(event);
    let query = getQuery(event)

    const allProducts = await fetchAllProducts(meliFetch, query)

    if (!allProducts.length) {
        return { data: { orders: [], report: {}, report_per_product: [] } }
    }

    const productsDetails = await fetchProductsDetails(meliFetch, allProducts)

    const { report} = generateProductsReport(productsDetails)

    return {
        data: {
            products: productsDetails,
            report,
        }
    }

})

const fetchAllProducts = async (meliFetch, query) => {

    let offset = 0;
    const limit = 50
    let allProducts = [];
    let hasMore = true;

    while (hasMore) {
        try {

            const productsResponse = await meliFetch('/users/1492625301/items/search', {
                params: {
                    sort: 'date_desc', // ordena da data mais recente para a mais antiga
                    offset,
                    limit
                }
            });

            const products = productsResponse.results || [];

            if (!products.length) {
                hasMore = false;
                break;
            }

            allProducts.push(...products);
            offset += limit;

            if (products.length < limit || offset >= (productsResponse.paging?.total || 0)) {
                hasMore = false;
            }

        }
        catch (error) {
            console.error(`Erro na paginação offset ${offset}:`, error);
            throw error;
        }
    }

    return allProducts;

}

const fetchProductsDetails = async (meliFetch, allProducts) => {

    const batchSize = 5; // Reduzido para evitar rate limits
    const productsDetails = [];

    for (let i = 0; i < allProducts.length; i += batchSize) {

        const batch = allProducts.slice(i, i + batchSize);

        const batchPromises = batch.map(product =>
            fetchSingleProductDetails(meliFetch, product)
        );

        try {

            const batchResults = await Promise.allSettled(batchPromises) || [];

            batchResults.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    productsDetails.push(result.value);
                } else {
                    console.error(`Erro ao processar produto ${batch[index]}:`, result.reason);
                    productsDetails.push(createBasicData(batch[index]));
                }
            });

            // Aumentado delay para evitar rate limits
            if (i + batchSize < allProducts.length) {
                await new Promise(resolve => setTimeout(resolve, 300));
            }

        } catch (error) {
            console.error(`Erro no lote ${i}-${i + batchSize}:`, error);
        }
    }

    productsDetails.sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (a.status !== 'active' && b.status === 'active') return 1;

        const dateA = new Date(a.date_created);
        const dateB = new Date(b.date_created);
        return dateB - dateA;
    });

    return productsDetails;

}

const createBasicData = (product) => {
    return {
        ...product,
        fetched_at: new Date().toISOString(),
        fetch_errors: {
            product: 'failed_to_fetch',
            shipping: 'failed_to_fetch',
            advertising: 'failed_to_fetch',
            shipping_cost: 'failed_to_fetch',
            visits: 'failed_to_fetch',
            selling_fees: 'failed_to_fetch',
        }
    };
}

const fetchSingleProductDetails = async (meliFetch, productId) => {

    const requests = [];

    if (productId) {
        // Buscar detalhes completos do produto
        requests.push(
            meliFetch(`items/${productId}?include_attributes=all`)
                .catch(err => ({ error: 'product_details_fetch_failed', details: err }))
        );

        // Buscar visitas do produto
        requests.push(
            meliFetch(`visits/items?ids=${productId}`)
                .catch(err => ({ error: 'visits_fetch_failed', details: err }))
        );
    } else {
        requests.push(
            Promise.resolve({ error: 'no_product_id' })
        );
        requests.push(
            Promise.resolve({ error: 'no_product_id' })
        );
    }

    const [productDetail, visitsData] = await Promise.all(requests);

    return createProductData(productDetail, visitsData, meliFetch, productId)

}

const { productCost, shippingType } = useServerDefaultValues()

const createProductData = async (product, visitsData, meliFetch, productId) => {

    const tax_nfe = 0.04
    const data = {

        id_meli: product.id,
        title: product.title,
        thumbnail: product.thumbnail,
        permalink: product.permalink,

        shipping_type: shippingType[product.shipping?.logistic_type] || 'Customizado',
        shipping_free: product.shipping?.free_shipping || false,
        status: product.available_quantity > 0 ? product.status : 'no_stock',

        health: product.health,

        created_at: product.date_created,
        updated_at: product.last_updated,

        visits: product.visits,
        stock_available: product.available_quantity,
        stock_init: product.initial_quantity,

        product_data: product,

    }

    // Adicionar dados de visitas se disponíveis
    if (visitsData && !visitsData.error && visitsData[productId]) {
        data.total_visits = visitsData[productId];
    } else {
        data.total_visits = 0;
        data.visits_error = visitsData?.error || 'no_visits_data';
    }

    data.total_sold = product.sold_quantity
    data.sale_price = product.price

    data.cost_unit = productCost[product.id] || 0
    data.tax_nfe_unit = productCost[product.id] * tax_nfe || 0

    // Buscar taxas de venda se possível
    try {
        const sellingFeesData = await fetchSellingFees(meliFetch, product);
        data.selling_fees = sellingFeesData;
        data.marketplace_fee_percentage = sellingFeesData?.percentage || 0;
        data.marketplace_fee_fixed = sellingFeesData?.fixed_fee || 0;
        data.marketplace_fee_total = sellingFeesData?.total_fee || 0;
    } catch (error) {
        data.selling_fees = { percentage: 0, fixed_fee: 0, total_fee: 0, error: 'failed_to_fetch' };
        data.selling_fees_error = 'failed_to_fetch';
        data.marketplace_fee_percentage = 0;
        data.marketplace_fee_fixed = 0;
        data.marketplace_fee_total = 0;
    }

    // Buscar custos de envio se possível
    try {
        const shippingCostData = await fetchShippingCosts(meliFetch, product);
        data.shipping_costs = shippingCostData;
        data.estimated_shipping_cost = data.shipping_free ? shippingCostData?.cost : 0
    } catch (error) {
        data.shipping_costs = { cost: 0, currency: 'BRL', error: 'failed_to_fetch' };
        data.shipping_costs_error = 'failed_to_fetch';
        data.estimated_shipping_cost = 0;
    }

    data.tax_meli_unit = (data.shipping_free ? data.estimated_shipping_cost : 0) + data.marketplace_fee_total
    data.profit_unit = data.sale_price - data.cost_unit - data.tax_nfe_unit - data.tax_meli_unit
    data.profit_unit_percent = data.cost_unit > 0 ? (data.profit_unit / data.cost_unit * 100).toFixed(2) : 0

    data.received_total_gross = data.sale_price * data.total_sold
    data.received_total_cost = data.cost_unit * data.total_sold
    data.received_total_profit = data.profit_unit * data.total_sold

    data.receivable_total_gross = data.sale_price * data.stock_available
    data.receivable_total_cost = data.cost_unit * data.stock_available
    data.receivable_total_profit = data.profit_unit * data.stock_available
    data.receivable_total_profit_percent = data.receivable_total_cost > 0 ? (data.receivable_total_profit / data.receivable_total_cost * 100).toFixed(2) : 0

    if( product.variations?.length > 1 ) {
        data.variations = product.variations.map((variation) => {

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

            attributes.receivable_total_gross = attributes.price * attributes.available_quantity
            attributes.receivable_total_cost = data.cost_unit * attributes.available_quantity
            attributes.receivable_total_profit = attributes.profit_unit * attributes.available_quantity
            attributes.receivable_total_profit_percent = attributes.receivable_total_cost > 0 ? (attributes.receivable_total_profit / attributes.receivable_total_cost * 100).toFixed(2) : 0

            return attributes;
        })
    }

    return data

}

// Função melhorada para buscar taxas de venda
const fetchSellingFees = async (meliFetch, product) => {
    try {

        const siteId = product.id.substring(0, 3);

        const listingTypeId = product.listing_type_id || 'gold_special';

        // Melhor busca por category_id
        let categoryId = product.category_id;

        // Se não tiver category_id, tentar buscar via domain_id ou outras propriedades
        if (!categoryId) {
            categoryId = product.domain_id;
        }

        // Se ainda não tiver, tentar buscar via attributes
        if (!categoryId && product.attributes) {
            const categoryAttr = product.attributes.find(attr => attr.id === 'CATEGORY');
            if (categoryAttr) {
                categoryId = categoryAttr.value_id;
            }
        }

        if (!categoryId) {
            return { percentage: 0, fixed_fee: 0, total_fee: 0, error: 'no_category_id' };
        }

        // Delay para evitar rate limits
        await new Promise(resolve => setTimeout(resolve, 100));

        const apiUrl = `sites/${siteId}/listing_prices?price=${product.price}&listing_type_id=${listingTypeId}&category_id=${categoryId}`;

        const feesResponse = await meliFetch(apiUrl);

        if (feesResponse && (feesResponse.sale_fee_details || feesResponse.sale_fee || feesResponse.percentage !== undefined)) {
            const feeData = feesResponse;

            // Verificar diferentes estruturas de resposta
            let percentage = feeData.sale_fee_details?.percentage || 0;
            let fixed_fee = feeData.sale_fee_details?.fixed_fee || 0;
            let total_fee = feeData.sale_fee_details?.gross_amount || 0; // Usar gross_amount para total_fee

            if (feeData.sale_fee_details?.percentage_fee) {
                percentage = feeData.sale_fee_details.percentage_fee;
            }

            return {
                percentage,
                fixed_fee,
                total_fee,
                raw_data: feeData
            };
        }

        return { percentage: 0, fixed_fee: 0, total_fee: 0, error: 'no_fees_found' };
    } catch (error) {
        console.error(`[fetchSellingFees] Erro ao buscar taxas de venda para ${product.id}:`, error);
        throw error;
    }
}

// Função melhorada para buscar custos de envio
const fetchShippingCosts = async (meliFetch, product) => {
    try {

        const userId = '1492625301';

        // Validar se o produto tem informações de envio
        if (!product.shipping) {
            return { cost: 0, currency: 'BRL', error: 'no_shipping_info' };
        }

        const params = new URLSearchParams({
            item_price: product.price,
            listing_type_id: product.listing_type_id || 'gold_special',
            mode: product.shipping?.mode || 'me2',
            condition: product.condition || 'new',
            logistic_type: product.shipping?.logistic_type || 'fulfillment',
            verbose: 'true'
        });

        // Adicionar category_id se disponível
        if (product.category_id) {
            params.append('category_id', product.category_id);
        }

        // Adicionar dimensões se disponíveis
        if (product.shipping?.dimensions) {
            params.append('dimensions', product.shipping.dimensions);
        } else {
            // Usar dimensões padrão se não estiverem disponíveis
            params.append('dimensions', '10x10x10,100'); // 10cm x 10cm x 10cm, 100g
        }

        // Delay para evitar rate limits
        await new Promise(resolve => setTimeout(resolve, 150));

        const apiUrl = `users/${userId}/shipping_options/free?${params.toString()}`;

        const shippingResponse = await meliFetch(apiUrl);

        if (shippingResponse && shippingResponse.coverage?.all_country?.list_cost !== undefined) {
            return {
                cost: shippingResponse.coverage.all_country.list_cost,
                currency: shippingResponse.coverage.all_country.currency_id || 'BRL',
                raw_data: shippingResponse
            };
        }

        return { cost: 0, currency: 'BRL', error: 'no_cost_found' };
    } catch (error) {
        throw error;
    }
}

function generateProductsReport(productDetails) {

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

        if (product.status === 'active') {
            report.total_products_active++
        } else {
            report.total_products_paused++
        }

        report.total_stock_available += product.stock_available || 0
        report.total_cost += product.receivable_total_cost || 0
        report.total_gross += product.receivable_total_gross || 0
        report.total_profit += product.receivable_total_profit || 0
        report.total_profit_percent += parseFloat(product.receivable_total_profit_percent) || 0
        report.total_visits += product.total_visits || 0
        report.total_marketplace_fees += (product.marketplace_fee_total * product.stock_available) || 0
        report.total_shipping_costs += (product.estimated_shipping_cost * product.stock_available) || 0

    });

    return {report};

}

const getThumbnailUrl = (product, variation) => {

    return product.pictures?.find(picture => picture.id === variation)?.url || '';

}
