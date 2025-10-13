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

        // Estatísticas de produtos
        const { data: productStats } = await supabase
            .from('products')
            .select('needs_sync, api_last_checked, sync_attempts, status')
            .eq('connection_id', connection.id);

        const stats = {
            products: {
                total: productStats?.length || 0,
                needs_sync: productStats?.filter(p => p.needs_sync).length || 0,
                never_synced: productStats?.filter(p => !p.api_last_checked).length || 0,
                sync_errors: productStats?.filter(p => p.sync_attempts > 0).length || 0,
                last_sync: productStats?.filter(p => p.api_last_checked)
                    .sort((a, b) => new Date(b.api_last_checked) - new Date(a.api_last_checked))[0]?.api_last_checked || null,
                by_status: {
                    active: productStats?.filter(p => p.status === 'active').length || 0,
                    paused: productStats?.filter(p => p.status === 'paused').length || 0,
                    closed: productStats?.filter(p => p.status === 'closed').length || 0,
                    no_stock: productStats?.filter(p => p.status === 'no_stock').length || 0
                }
            }
        };

        // Calcular status de saúde da sincronização
        const totalProducts = stats.products.total;
        const needsSyncProducts = stats.products.needs_sync;
        const errorProducts = stats.products.sync_errors;

        let healthStatus = 'healthy';
        if (errorProducts > totalProducts * 0.1) {
            healthStatus = 'error';
        } else if (needsSyncProducts > totalProducts * 0.2) {
            healthStatus = 'warning';
        }

        stats.health = {
            status: healthStatus,
            sync_percentage: totalProducts > 0 ? Math.round(((totalProducts - needsSyncProducts) / totalProducts) * 100) : 100,
            error_percentage: totalProducts > 0 ? Math.round((errorProducts / totalProducts) * 100) : 0
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


