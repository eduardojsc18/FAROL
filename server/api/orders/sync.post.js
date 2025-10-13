import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import {useOrderSync} from "~/server/utils/useOrderSync.js";

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event);

    if (!user) {
        throw createError({
            status: 401,
            statusMessage: 'Usuário não autenticado',
        })
    }

    const { meliFetch, getSellerId } = await useServerMeli(event);
    const { getOrdersFromDatabase, syncOrder } = await useOrderSync(event);
    
    const body = await readBody(event);
    const { order_numbers, force_sync = false } = body;

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

        let ordersToSync = [];

        if (order_numbers && order_numbers.length > 0) {
            // Sincronizar pedidos específicos
            const { data: orders } = await supabase
                .from('orders')
                .select('*')
                .eq('connection_id', connection.id)
                .in('order_number', order_numbers);

            ordersToSync = orders || [];
        } else {
            // Sincronizar todos os pedidos que precisam de sincronização
            const { data: orders } = await supabase
                .from('orders')
                .select('*')
                .eq('connection_id', connection.id)
                .eq('needs_sync', true);

            ordersToSync = orders || [];
        }

        const results = {
            success: [],
            errors: [],
            total: ordersToSync.length
        };

        // Sincronizar pedidos em lotes para evitar rate limit
        const batchSize = 5;
        for (let i = 0; i < ordersToSync.length; i += batchSize) {
            const batch = ordersToSync.slice(i, i + batchSize);
            
            const batchPromises = batch.map(async (order) => {
                try {
                    await syncOrder(order, null, meliFetch);
                    results.success.push({
                        order_number: order.order_number,
                        message: 'Sincronizado com sucesso'
                    });
                } catch (error) {
                    results.errors.push({
                        order_number: order.order_number,
                        error: error.message
                    });
                }
            });

            await Promise.allSettled(batchPromises);

            // Aguardar um pouco entre lotes para evitar rate limit
            if (i + batchSize < ordersToSync.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        return {
            data: results
        };

    } catch (error) {
        console.error('Erro na sincronização de pedidos:', error);
        
        throw createError({
            status: 500,
            statusMessage: 'Erro interno do servidor',
        });
    }
});
