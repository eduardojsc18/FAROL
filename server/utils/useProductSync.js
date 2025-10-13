import { serverSupabaseClient } from "#supabase/server";
import { createHash } from 'crypto';

/**
 * Utilitário para sincronização de produtos com verificação de alterações na API
 */
export async function useProductSync(event) {
    const supabase = await serverSupabaseClient(event);

    /**
     * Busca produtos do banco de dados
     */
    async function getProductsFromDatabase(query) {
        const supabaseClient = await serverSupabaseClient(event);
        const { data: connection } = await supabaseClient
            .from('connections')
            .select('id')
            .eq('profile_id', query.user_id)
            .single();

        if (!connection) {
            throw new Error('Conexão não encontrada');
        }

        // Buscar produtos do banco
        const { data: products, error } = await supabaseClient
            .from('products')
            .select('*')
            .eq('connection_id', connection.id)
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Erro ao buscar produtos: ${error.message}`);
        }

        return products || [];
    }

    /**
     * Verifica se um produto precisa ser sincronizado
     */
    async function needsSync(product, apiData) {
        // Se nunca foi sincronizado
        if (!product.api_last_checked) {
            return true;
        }

        // Se está marcado para sincronização forçada
        if (product.needs_sync) {
            return true;
        }

        // Se passou muito tempo desde a última verificação (ex: 30 minutos para produtos)
        const lastChecked = new Date(product.api_last_checked);
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        if (lastChecked < thirtyMinutesAgo) {
            return true;
        }

        // Se os dados da API mudaram (comparar hash)
        const currentHash = generateApiHash(apiData);
        if (product.api_hash !== currentHash) {
            return true;
        }

        // Verificar se a data de modificação mudou
        const apiLastUpdated = new Date(apiData.last_updated);
        const dbLastUpdated = new Date(product.updated_at);
        if (apiLastUpdated.getTime() !== dbLastUpdated.getTime()) {
            return true;
        }

        return false;
    }

    /**
     * Sincroniza um produto específico com a API
     */
    async function syncProduct(product, apiData, meliFetch) {
        try {
            // Buscar dados atualizados da API
            const updatedProductData = await fetchProductFromAPI(product.meli_id, meliFetch);

            // Verificar se houve alterações
            const needsUpdate = await needsSync(product, updatedProductData);

            if (needsUpdate) {
                // Atualizar produto no banco
                await updateProductInDatabase(product.id, updatedProductData);

                // Marcar como sincronizado
                await markProductAsSynced(product.id, updatedProductData);
            }

            return updatedProductData;
        } catch (error) {
            // Incrementar tentativas de sincronização
            await incrementSyncAttempts(product.id, error.message);
            throw error;
        }
    }

    /**
     * Busca dados de um produto específico da API
     */
    async function fetchProductFromAPI(productId, meliFetch) {
        try {
            // Buscar dados básicos do produto
            const product = await meliFetch(`items/${productId}?include_attributes=all`);

            // Buscar dados de visitas
            const visitsData = await meliFetch(`visits/items?ids=${productId}`)
                .catch(err => ({ error: 'visits_fetch_failed', details: err }));

            // Buscar histórico completo de visitas
            const visitsHistory = await fetchProductVisitsHistory(meliFetch, productId, event);

            // Buscar taxas de venda
            const sellingFees = await fetchSellingFees(meliFetch, product)
                .catch(err => ({ error: 'selling_fees_fetch_failed', details: err }));

            // Buscar custos de envio
            const shippingCosts = await fetchShippingCosts(meliFetch, product)
                .catch(err => ({ error: 'shipping_costs_fetch_failed', details: err }));

            return {
                product,
                visitsData,
                visitsHistory,
                sellingFees,
                shippingCosts,
                fetched_at: new Date().toISOString()
            };
        } catch (error) {
            throw new Error(`Erro ao buscar produto da API: ${error.message}`);
        }
    }

    /**
     * Atualiza um produto no banco de dados
     */
    async function updateProductInDatabase(productId, apiData) {
        const supabaseClient = await serverSupabaseClient(event);
        const { product, visitsData, visitsHistory, sellingFees, shippingCosts } = apiData;

        const productData = {
            meli_id: product.id,
            title: product.title,
            thumbnail: product.thumbnail,
            permalink: product.permalink,
            status: product.status,
            health: product.health,
            created_at: product.date_created,
            updated_at: product.last_updated,

            // Dados de estoque e vendas
            stock_init: product.initial_quantity,
            stock_available: product.available_quantity,
            qtd_sold: product.sold_quantity,
            visits: visitsHistory,
            sale_price: product.price,

            // Dados de envio
            shipping_type: product.shipping?.logistic_type || 'unknown',
            shipping_free: product.shipping?.free_shipping || false,
            shipping_costs: shippingCosts,
            shipping_cost_estimated: shippingCosts?.cost || 0,

            // Dados de taxas
            selling_fees: sellingFees,
            marketplace_fee_percentage: sellingFees?.percentage || 0,
            marketplace_fee_fixed: sellingFees?.fixed_fee || 0,
            marketplace_fee_total: sellingFees?.total_fee || 0,

            // Variações
            variations: product.variations,

            // Dados de sincronização
            api_last_checked: new Date().toISOString(),
            needs_sync: false,
            sync_attempts: 0,
            last_sync_error: null,

            // Dados completos para auditoria
            fetch_data: apiData
        };

        const { error } = await supabaseClient
            .from('products')
            .update(productData)
            .eq('id', productId);

        if (error) {
            throw new Error(`Erro ao atualizar produto: ${error.message}`);
        }
    }

    /**
     * Marca um produto como sincronizado
     */
    async function markProductAsSynced(productId, apiData) {
        const supabaseClient = await serverSupabaseClient(event);
        const hash = generateApiHash(apiData);

        const { error } = await supabaseClient
            .from('products')
            .update({
                api_last_checked: new Date().toISOString(),
                api_hash: hash,
                needs_sync: false,
                sync_attempts: 0,
                last_sync_error: null
            })
            .eq('id', productId);

        if (error) {
            throw new Error(`Erro ao marcar produto como sincronizado: ${error.message}`);
        }
    }

    /**
     * Incrementa tentativas de sincronização
     */
    async function incrementSyncAttempts(productId, errorMessage) {
        const supabaseClient = await serverSupabaseClient(event);
        const { error } = await supabaseClient
            .from('products')
            .update({
                sync_attempts: supabaseClient.raw('sync_attempts + 1'),
                last_sync_error: errorMessage,
                needs_sync: true
            })
            .eq('id', productId);

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
     * Busca o histórico completo de visitas de um produto.
     * Formato do retorno: { "2025-01-13": 45, "2025-01-12": 32, ... }
     */
    async function fetchProductVisitsHistory(meliFetch, productId, event) {
        try {
            const supabaseClient = await serverSupabaseClient(event);

            // Buscar o registro atual do produto para pegar o histórico existente
            const { data: existingProduct } = await supabaseClient
                .from('products')
                .select('visits, created_at')
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
            console.error(`Erro ao buscar histórico de visitas para ${productId}:`, error);
            return {};
        }
    }

    /**
     * Busca taxas de venda
     */
    async function fetchSellingFees(meliFetch, product) {
        try {
            const siteId = product.site_id || product.id.substring(0, 3);
            const listingTypeId = product.listing_type_id || 'gold_special';
            let categoryId = product.category_id;

            if (!categoryId) {
                return { percentage: 0, fixed_fee: 0, total_fee: 0, error: 'no_category_id' };
            }

            await new Promise(resolve => setTimeout(resolve, 100));
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
            console.error(`Erro ao buscar taxas para ${product.id}:`, error);
            return { percentage: 0, fixed_fee: 0, total_fee: 0, error: 'fetch_failed' };
        }
    }

    /**
     * Busca custos de envio
     */
    async function fetchShippingCosts(meliFetch, product) {
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
            console.error(`Erro ao buscar custos de envio para ${product.id}:`, error);
            return { cost: 0, currency: 'BRL', error: 'fetch_failed' };
        }
    }

    return {
        getProductsFromDatabase,
        syncProduct,
        needsSync,
        fetchProductFromAPI
    };
}


