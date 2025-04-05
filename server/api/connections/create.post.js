import {serverSupabaseClient, serverSupabaseUser} from '#supabase/server'

export default defineEventHandler(async (event) => {

    const user = await serverSupabaseUser(event)
    const client = await serverSupabaseClient(event)
    const payload = await readBody(event)

    if (!payload.title) {
        throw createError({
            status: 400,
            message: 'Titulo é obrigatório',
        })
    }

    return await client.from('connections')
        .upsert({
            title: payload.title,
            description: payload.description,
            profile_id: user.id,
            type: 'meli'
        })
        .select('id, title, description, type')
        .single()

})
