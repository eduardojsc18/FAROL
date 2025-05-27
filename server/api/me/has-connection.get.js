import {serverSupabaseClient, serverSupabaseUser} from '#supabase/server'

export default defineEventHandler(async (event) => {

    const user = await serverSupabaseUser(event);
    if (!user) {
        throw createError({
            status: 401,
            statusMessage: 'Usuário não autenticado',
        });
    }


    const client = await serverSupabaseClient(event)

    const { data } = await client.from('connections').select('*')

    return {has_connection: data.length > 0}

})
