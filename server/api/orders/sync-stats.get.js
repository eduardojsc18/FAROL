import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event);

    if (!user) {
        throw createError({
            status: 401,
            statusMessage: 'Usuário não autenticado',
        })
    }

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

        // Estatísticas gerais de pedidos
        const { data: orderStats } = await supabase
            .from('orders')
            .select('needs_sync, api_last_checked, sync_attempts')
            .eq('connection_id', connection.id);

        // Estatísticas de produtos
        const { data: productStats } = await supabase
            .from('products')
            .select('needs_sync, api_last_checked, sync_attempts')
            .eq('connection_id', connection.id);

        const stats = {
            orders: {
                total: orderStats?.length || 0,
                needs_sync: orderStats?.filter(o => o.needs_sync).length || 0,
                never_synced: orderStats?.filter(o => !o.api_last_checked).length || 0,
                sync_errors: orderStats?.filter(o => o.sync_attempts > 0).length || 0,
                last_sync: orderStats?.filter(o => o.api_last_checked)
                    .sort((a, b) => new Date(b.api_last_checked) - new Date(a.api_last_checked))[0]?.api_last_checked || null
            },
            products: {
                total: productStats?.length || 0,
                needs_sync: productStats?.filter(p => p.needs_sync).length || 0,
                never_synced: productStats?.filter(p => !p.api_last_checked).length || 0,
                sync_errors: productStats?.filter(p => p.sync_attempts > 0).length || 0,
                last_sync: productStats?.filter(p => p.api_last_checked)
                    .sort((a, b) => new Date(b.api_last_checked) - new Date(a.api_last_checked))[0]?.api_last_checked || null
            }
        };

        // Calcular status de saúde da sincronização
        const totalItems = stats.orders.total + stats.products.total;
        const needsSyncItems = stats.orders.needs_sync + stats.products.needs_sync;
        const errorItems = stats.orders.sync_errors + stats.products.sync_errors;

        let healthStatus = 'healthy';
        if (errorItems > totalItems * 0.1) {
            healthStatus = 'error';
        } else if (needsSyncItems > totalItems * 0.2) {
            healthStatus = 'warning';
        }

        stats.health = {
            status: healthStatus,
            sync_percentage: totalItems > 0 ? Math.round(((totalItems - needsSyncItems) / totalItems) * 100) : 100,
            error_percentage: totalItems > 0 ? Math.round((errorItems / totalItems) * 100) : 0
        };

        return {
            data: stats
        };

    } catch (error) {
        console.error('Erro ao buscar estatísticas de sincronização:', error);
        
        throw createError({
            status: 500,
            statusMessage: 'Erro interno do servidor',
        });
    }
});
