import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event);

    if (!user) {
        throw createError({
            status: 401,
            statusMessage: 'Usuário não autenticado',
        });
    }

    const body = await readBody(event);
    const { product_id, cost_unit } = body;

    if (!product_id || cost_unit === undefined || cost_unit === null) {
        throw createError({
            status: 400,
            statusMessage: 'product_id e cost_unit são obrigatórios',
        });
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

        // Atualizar o custo do produto (product_id é o meli_id)
        const { data, error } = await supabase
            .from('products')
            .update({ cost_unit })
            .eq('meli_id', product_id)
            .eq('connection_id', connection.id)
            .select()
            .single();

        if (error) {
            throw new Error(`Erro ao atualizar custo: ${error.message}`);
        }

        return {
            success: true,
            data
        };

    } catch (error) {
        console.error('Erro ao atualizar custo do produto:', error);

        throw createError({
            status: 500,
            statusMessage: error.message || 'Erro interno do servidor',
        });
    }
});
