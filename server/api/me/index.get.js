import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server';

export default defineEventHandler(async (event) => {

    const user = await serverSupabaseUser(event);
    if (!user) {
        throw createError({
            status: 401,
            statusMessage: 'Usuário não autenticado',
        });
    }

    const client = await serverSupabaseClient(event);

    const {data: connections} = await client.from('connections')
        .select('id, title, description, profiles(name,avatar_url,id), type, status, status_message, expires_in, account_info, created_at, updated_at')
        .eq('profile_id', user.id);

    return {
        ...user,
        connections,
    };
});
