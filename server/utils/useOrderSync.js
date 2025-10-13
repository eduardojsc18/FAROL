import { serverSupabaseClient } from "#supabase/server";
import { createHash } from 'crypto';

/**
 * Utilitário para sincronização de pedidos com verificação de alterações na API
 */
export async function useOrderSync(event) {
    const supabase = await serverSupabaseClient(event);

    /**
     * Busca pedidos do banco de dados com verificação de sincronização
     */
    async function getOrdersFromDatabase(query) {
        const supabaseClient = await serverSupabaseClient(event);
        const { data: connection } = await supabaseClient
            .from('connections')
            .select('id')
            .eq('profile_id', query.user_id)
            .single();

        if (!connection) {
            throw new Error('Conexão não encontrada');
        }

        // Buscar pedidos do banco
        const { data: orders, error } = await supabaseClient
            .from('orders')
            .select(`
                *,
                products (
                    id,
                    meli_id,
                    title,
                    thumbnail,
                    cost_unit,
                    variations
                )
            `)
            .eq('connection_id', connection.id)
            .gte('order_created_at', query.date_range[0])
            .lte('order_created_at', query.date_range[1])
            .order('order_created_at', { ascending: false });

        if (error) {
            throw new Error(`Erro ao buscar pedidos: ${error.message}`);
        }

        return orders || [];
    }

    /**
     * Verifica se um pedido precisa ser sincronizado
     */
    async function needsSync(order, apiData) {
        // Se nunca foi sincronizado
        if (!order.api_last_checked) {
            return true;
        }

        // Se está marcado para sincronização forçada
        if (order.needs_sync) {
            return true;
        }

        // Se passou muito tempo desde a última verificação (ex: 1 hora)
        const lastChecked = new Date(order.api_last_checked);
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        if (lastChecked < oneHourAgo) {
            return true;
        }

        // Se os dados da API mudaram (comparar hash)
        const currentHash = generateApiHash(apiData);
        if (order.api_hash !== currentHash) {
            return true;
        }

        return false;
    }

    /**
     * Sincroniza um pedido específico com a API
     */
    async function syncOrder(order, apiData, meliFetch) {
        try {
            // Buscar dados atualizados da API
            const updatedOrderData = await fetchOrderFromAPI(order.order_number, meliFetch);
            
            // Verificar se houve alterações
            const needsUpdate = await needsSync(order, updatedOrderData);
            
            if (needsUpdate) {
                // Atualizar pedido no banco
                await updateOrderInDatabase(order.id, updatedOrderData);
                
                // Marcar como sincronizado
                await markOrderAsSynced(order.id, updatedOrderData);
            }

            return updatedOrderData;
        } catch (error) {
            // Incrementar tentativas de sincronização
            await incrementSyncAttempts(order.id, error.message);
            throw error;
        }
    }

    /**
     * Busca dados de um pedido específico da API
     */
    async function fetchOrderFromAPI(orderNumber, meliFetch) {
        try {
            // Buscar dados básicos do pedido
            const order = await meliFetch(`orders/${orderNumber}`);
            
            // Buscar detalhes adicionais se necessário
            const requests = [];
            
            if (order.order_items?.[0]?.item?.id) {
                requests.push(
                    meliFetch(`items/${order.order_items[0].item.id}`)
                        .catch(err => ({ error: 'product_fetch_failed', details: err }))
                );
            }

            if (order.shipping?.id) {
                requests.push(
                    meliFetch(`shipments/${order.shipping.id}`)
                        .catch(err => ({ error: 'shipping_fetch_failed', details: err }))
                );
            }

            const [product, shipping] = await Promise.all(requests);

            return {
                order,
                product,
                shipping,
                fetched_at: new Date().toISOString()
            };
        } catch (error) {
            throw new Error(`Erro ao buscar pedido da API: ${error.message}`);
        }
    }

    /**
     * Atualiza um pedido no banco de dados
     */
    async function updateOrderInDatabase(orderId, apiData) {
        const supabaseClient = await serverSupabaseClient(event);
        const { order, product, shipping } = apiData;
        const orderItem = order.order_items?.[0] || {};

        // Buscar ou criar produto relacionado
        let productId = null;
        if (product && !product.error && orderItem.item?.id) {
            productId = await findOrCreateProduct(orderItem.item.id, product, order.connection_id);
        }

        const orderData = {
            order_number: order.id,
            status: order.status,
            order_created_at: order.date_created,
            order_updated_at: order.last_updated,
            date_closed: order.date_closed,
            
            product_id: productId,
            product_meli_id: orderItem.item?.id,
            product_title: product?.error ? 'Produto não encontrado' : product?.title,
            product_sku: orderItem.item?.seller_sku,
            product_thumbnail: getThumbnailUrl(product, orderItem.item?.variation_id),
            product_variation_attributes: orderItem.item?.variation_attributes,
            
            qtd: orderItem.quantity || 0,
            unit_price: orderItem.unit_price || 0,
            order_total: order.total_amount || 0,
            
            // Calcular taxas (usar lógica existente)
            tax_marketplace: orderItem.sale_fee * (orderItem.quantity || 0) || 0,
            tax_marketplace_shipping_before: 0, // Calcular conforme necessário
            tax_marketplace_shipping_after: 0, // Calcular conforme necessário
            advertising_cost: 0,
            
            tax_nfe: calculateNfeTax(order, orderItem),
            tax_nfe_percent: 0.04,
            
            product_cost_unit: 0, // Buscar do produto
            product_cost_total: 0, // Calcular
            
            net_revenue: 0, // Calcular
            net_revenue_percent: 0, // Calcular
            
            shipping_id: order.shipping?.id,
            shipping_type: shipping?.logistic_type || "DESCONHECIDO",
            shipping_status: shipping?.status,
            shipping_base_cost: shipping?.base_cost || 0,
            
            buyer_id: order.buyer?.id,
            buyer_nickname: order.buyer?.nickname,
            
            order_type: order.order_type,
            tags: order.tags || [],
            has_advertising: order.tags?.includes("advertising") || false,
            advertising_data: null,
            
            fetch_errors: {
                product: product?.error || null,
                shipping: shipping?.error || null
            },
            fetch_data: apiData
        };

        const { error } = await supabaseClient
            .from('orders')
            .update(orderData)
            .eq('id', orderId);

        if (error) {
            throw new Error(`Erro ao atualizar pedido: ${error.message}`);
        }
    }

    /**
     * Busca ou cria um produto no banco
     */
    async function findOrCreateProduct(meliId, productData, connectionId) {
        const supabaseClient = await serverSupabaseClient(event);
        // Buscar produto existente
        const { data: existingProduct } = await supabaseClient
            .from('products')
            .select('id')
            .eq('meli_id', meliId)
            .single();

        if (existingProduct) {
            return existingProduct.id;
        }

        // Criar novo produto
        const productRecord = {
            meli_id: meliId,
            title: productData.title,
            thumbnail: productData.thumbnail,
            permalink: productData.permalink,
            status: productData.status,
            health: productData.health,
            variations: productData.variations,
            fetch_data: productData
        };

        const { data: newProduct, error } = await supabaseClient
            .from('products')
            .insert(productRecord)
            .select('id')
            .single();

        if (error) {
            throw new Error(`Erro ao criar produto: ${error.message}`);
        }

        return newProduct.id;
    }

    /**
     * Marca um pedido como sincronizado
     */
    async function markOrderAsSynced(orderId, apiData) {
        const supabaseClient = await serverSupabaseClient(event);
        const hash = generateApiHash(apiData);
        
        const { error } = await supabaseClient
            .from('orders')
            .update({
                api_last_checked: new Date().toISOString(),
                api_hash: hash,
                needs_sync: false,
                sync_attempts: 0,
                last_sync_error: null
            })
            .eq('id', orderId);

        if (error) {
            throw new Error(`Erro ao marcar pedido como sincronizado: ${error.message}`);
        }
    }

    /**
     * Incrementa tentativas de sincronização
     */
    async function incrementSyncAttempts(orderId, errorMessage) {
        const supabaseClient = await serverSupabaseClient(event);
        const { error } = await supabaseClient
            .from('orders')
            .update({
                sync_attempts: supabaseClient.raw('sync_attempts + 1'),
                last_sync_error: errorMessage,
                needs_sync: true
            })
            .eq('id', orderId);

        if (error) {
            console.error(`Erro ao incrementar tentativas de sincronização: ${error.message}`);
        }
    }

    /**
     * Gera hash dos dados da API para comparação
     */
    function generateApiHash(data) {
        return createHash('sha256').update(JSON.stringify(data)).digest('hex');
    }

    /**
     * Calcula taxa de NFe
     */
    function calculateNfeTax(order, orderItem) {
        const orderTotal = order.total_amount || 0;
        const nfeRate = 0.04;
        return Math.round(orderTotal * nfeRate * 100) / 100;
    }

    /**
     * Obtém URL da thumbnail do produto
     */
    function getThumbnailUrl(product, orderVariation) {
        if (!product || product.error) {
            return null;
        }

        if (!product.variations || product.variations.length <= 1) {
            return product.thumbnail;
        }

        const variation = product.variations.find(v => v.id === orderVariation);
        if (variation && variation.picture_ids?.[0]) {
            const picture = product.pictures?.find(p => p.id === variation.picture_ids[0]);
            return picture?.url || product.thumbnail;
        }

        return product.thumbnail;
    }

    return {
        getOrdersFromDatabase,
        syncOrder,
        needsSync,
        fetchOrderFromAPI
    };
}
