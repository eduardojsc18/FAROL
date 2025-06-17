import {serverSupabaseUser} from "#supabase/server";

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

    const {report, report_per_product} = generateOrdersReport(productsDetails)

    return {
        data: {
            products: productsDetails,
            report,
            report_per_product,
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

            const batchResults = await Promise.allSettled(batchPromises);

            batchResults.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    productsDetails.push(result.value);
                } else {
                    console.error(`Erro ao processar pedido ${batch[index].id}:`, result.reason);
                    productsDetails.push(createBasicOrderData(batch[index]));
                }
            });

            if (i + batchSize < allProducts.length) {
                await new Promise(resolve => setTimeout(resolve, 200));
            }

        } catch (error) {
            console.error(`Erro no lote ${i}-${i + batchSize}:`, error);
        }
    }

    return productsDetails;
}

const createBasicOrderData = (product) => {
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

    // Request básicos sempre necessários
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

const createProductData = (product) => {

    const shippingTypeMap = {
        "fulfillment": "FULL",
        "self_service": "FLEX",
        "cross_docking": "FLEX",
        "pickup": "COLETA",
        "me2": "MERCADO ENVIO",
        "custom": "PERSONALIZADO"
    };
    const productCost = {
        'MLB5402391910': 49, // LUMINARIA BRANCA
        'MLB5385112480': 40, // KIT TECLADO PRETO
        'MLB5370856210': 49, // LUMINARIA PRETA
        'MLB5349332438': 35, // PENDRIVE 128GB
        'MLB4001628013': 33.70, // KIT 8 NECESSAIRE
        'MLB3991098369': 58, // KIT 6 BANHEIRO BAMBU
        'MLB3991149161': 49, // LUMINARIA PRETA (ANTIGO)
        'MLB3991070331': 23.50, // KIT FACA AFIADOR
        'MLB3985510287': 40, // KIT TECLADO PRETO (ANTIGO)
        'MLB3952492195': 40, // KIT TECLADO PRETO (ANTIGO)
        'MLB3866006087': 40, // KIT TECLADO BRANCO
        'MLB5014464806': 40, // KIT TECLADO PRETO (ANTIGO)
        'MLB3793458613': 13.50, // KIT 4 DINOS
    }

    return {
        ...product,
    }

}

const generateOrdersReport = async (productDetails) => {

    return {
        report: {},
        report_per_product: []
    }
}
