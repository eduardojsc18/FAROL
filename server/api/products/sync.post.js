import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import {useProductSync} from "~/server/utils/useProductSync.js";

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event);

    if (!user) {
        throw createError({
            status: 401,
            statusMessage: 'Usuário não autenticado',
        })
    }

    const { meliFetch, getSellerId } = await useServerMeli(event);
    const { getProductsFromDatabase, syncProduct } = await useProductSync(event);
    
    const body = await readBody(event);
    const { product_ids, force_sync = false } = body;

    try {
        const supabase = await serverSupabaseClient(event);
        
        // Buscar connection_id do usuário
        const { data: connection } = await supabase
            .from('connections')
            .select('id')
            .eq('profile_id', user.id)
            .single();

        if (!connection) {
            throw createError({
                status: 404,
                statusMessage: 'Conexão não encontrada',
            });
        }

        let productsToSync = [];

        if (product_ids && product_ids.length > 0) {
            // Sincronizar produtos específicos
            const { data: products } = await supabase
                .from('products')
                .select('*')
                .eq('connection_id', connection.id)
                .in('meli_id', product_ids);

            productsToSync = products || [];
        } else {
            // Sincronizar todos os produtos que precisam de sincronização
            const { data: products } = await supabase
                .from('products')
                .select('*')
                .eq('connection_id', connection.id)
                .eq('needs_sync', true);

            productsToSync = products || [];
        }

        const results = {
            success: [],
            errors: [],
            total: productsToSync.length
        };

        // Sincronizar produtos em lotes para evitar rate limit
        const batchSize = 3;
        for (let i = 0; i < productsToSync.length; i += batchSize) {
            const batch = productsToSync.slice(i, i + batchSize);
            
            const batchPromises = batch.map(async (product) => {
                try {
                    await syncProduct(product, null, meliFetch);
                    results.success.push({
                        meli_id: product.meli_id,
                        title: product.title,
                        message: 'Sincronizado com sucesso'
                    });
                } catch (error) {
                    results.errors.push({
                        meli_id: product.meli_id,
                        title: product.title,
                        error: error.message
                    });
                }
            });

            await Promise.allSettled(batchPromises);

            // Aguardar um pouco entre lotes para evitar rate limit
            if (i + batchSize < productsToSync.length) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }

        return {
            data: results
        };

    } catch (error) {
        console.error('Erro na sincronização de produtos:', error);
        
        throw createError({
            status: 500,
            statusMessage: 'Erro interno do servidor',
        });
    }
});


