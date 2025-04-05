import {serverSupabaseClient, serverSupabaseUser} from "#supabase/server";

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const { id } = event.context.params;


    return await client
        .from('connections')
        .delete()
        .eq('id', id);

})
