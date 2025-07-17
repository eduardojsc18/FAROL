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

    // Validação dos parâmetros de entrada
    // if (!query.date_range || !Array.isArray(query.date_range) || query.date_range.length !== 2) {
    //     throw createError({
    //         status: 400,
    //         statusMessage: 'Parâmetro date_range é obrigatório e deve conter 2 datas',
    //     })
    // }

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

            const productsResponse = await meliFetch('/users/1492625301/items/search');

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

    const batchSize = 10;
    const productsDetails = [];

    for (let i = 0; i < allProducts.length; i += batchSize) {

        const batch = allProducts.slice(i, i + batchSize);

        const batchPromises = batch.map(product =>
            fetchSingleProductDetails(meliFetch, product)
        );

        try {

            const batchResults = await Promise.allSettled(batchPromises) ?? [];

            batchResults.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    productsDetails.push(result.value);
                } else {
                    console.error(`Erro ao processar pedido ${batch[index].id}:`, result.reason);
                    productsDetails.push(createBasicData(batch[index]));
                }
            });

            if (i + batchSize < allProducts.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }

        } catch (error) {
            console.error(`Erro no lote ${i}-${i + batchSize}:`, error);
        }
    }

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

        }
    };
}
const fetchSingleProductDetails = async (meliFetch, productId) => {

    const requests = [];

    if (productId) {
        requests.push(
            meliFetch(`items/${productId}`)
                .catch(err => ({ error: 'product_details_fetch_failed', details: err }))
        );
    } else {
        requests.push(
            Promise.resolve({ error: 'no_product_id' })
        );
    }

    const [productDetail] = await Promise.all(requests);

    return createProductData(productDetail)

}

const { productCost, shippingType } = useServerDefaultValues()
const createProductData = (product) => {

    const tax_nfe = 0.04
    const data = {

        id_meli: product.id,
        title: product.title,
        thumbnail: product.thumbnail,
        permalink: product.permalink,

        shipping_type: shippingType[product.shipping.logistic_type] ?? 'Customizado',
        shipping_free: product.shipping.free_shipping,
        status: product.available_quantity > 0 ? product.status : 'no_stock',

        health: product.health,

        created_at: product.date_created,
        updated_at: product.last_updated,

        visits: product.visits,
        stock_available: product.available_quantity,
        stock_init: product.initial_quantity,

        product_data: product,

    }

    data.total_sold = product.sold_quantity
    data.sale_price = product.price

    data.cost_unit = productCost[product.id] ?? 0
    data.tax_nfe_unit = productCost[product.id] * 0.04 ?? 0
    data.profit_unit = data.sale_price - data.cost_unit - data.tax_nfe_unit

    data.received_total_gross = data.sale_price * data.total_sold
    data.received_total_cost = data.cost_unit * data.total_sold
    data.received_total_profit = data.profit_unit * data.total_sold

    data.receivable_total_gross = data.sale_price * data.stock_available
    data.receivable_total_cost = data.cost_unit * data.stock_available
    data.receivable_total_profit = data.profit_unit * data.stock_available
    data.receivable_total_profit_percent = (data.receivable_total_profit / data.receivable_total_cost * 100).toFixed(2)

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

            attributes.profit_unit = variation.price - data.cost_unit - data.tax_nfe_unit;

            attributes.receivable_total_gross = attributes.price * attributes.available_quantity
            attributes.receivable_total_cost = data.cost_unit * attributes.available_quantity
            attributes.receivable_total_profit = attributes.profit_unit * attributes.stock_available
            attributes.receivable_total_profit_percent = (attributes.receivable_total_profit / attributes.receivable_total_cost * 100).toFixed(2)

            return attributes;
        })
    }

    return data

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
        total_products_paused: 0
    };

    productDetails.forEach(product => {

        // const key = `${order.item_id}-${order.item_sku}`
        //
        // if (!report_per_product[key]) {
        //     report_per_product[key] = {
        //         product_data: {
        //             item_id: order.item_id,
        //             item_title: order.item_title,
        //             item_sku: order.item_sku,
        //             item_thumbnail: order.item_thumbnail,
        //             item_variations: order.item_variations,
        //             item_variation_attributes: order.item_variation_attributes,
        //         },
        //         total_orders: 0,
        //         total_products: 0,
        //         total_unit_price: 0,
        //         total_tax_marketplace: 0,
        //         total_tax_marketplace_shipping_before: 0,
        //         total_tax_marketplace_shipping_after: 0,
        //         total_tax_nfe: 0,
        //         total_product_cost: 0,
        //         total_product_cost_percent: 0,
        //         total_gross_revenue: 0,
        //         total_net_revenue: 0,
        //         total_net_revenue_percent: 0,
        //         total_canceled_orders: 0,
        //         total_canceled_products: 0,
        //         total_canceled_gross_revenue: 0,
        //     };
        // }

        if (product.status === 'active') {
            report.total_products_active++
        } else {
            report.total_products_paused++
        }

        report.total_stock_available += product.stock_available || 0
        report.total_cost += product.receivable_total_cost
        report.total_gross += product.receivable_total_gross
        report.total_profit += product.receivable_total_profit
        report.total_profit_percent += product.receivable_total_profit_percent

    });

    return {report};

}

const getThumbnailUrl = (product, variation) => {

    return product.pictures.find(picture => picture.id === variation).url;

}
