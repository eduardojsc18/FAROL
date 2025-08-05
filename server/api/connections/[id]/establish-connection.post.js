import {serverSupabaseClient} from "#supabase/server";

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const config = useRuntimeConfig(event)

    const { id } = event.context.params;
    const payload = await readBody(event)

    let responseData = {}

    const getAccountInfo = async (connection) => {
        try {
            return await $fetch('https://api.mercadolibre.com/users/me', {
                headers: {
                    Authorization: `Bearer ${connection.access_token}`,
                    Accept: 'application/json',
                },
            })
        } catch (error) {
            console.error('Erro ao buscar informações da conta:', error)
            throw error
        }
    }

    const updateConnection = async (connection) => {
        try {

            const accountInfo = await getAccountInfo(connection)

            const { data, error } = await client
                .from('connections')
                .update({
                    status: 'connected',
                    oauth_id: connection.user_id,
                    access_token: connection.access_token,
                    seller_id: accountInfo.id,
                    refresh_token: connection.refresh_token,
                    expires_in: connection.expires_in,
                    expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000),
                    account_info: accountInfo,
                })
                .eq('id', id)
                .select('*')
                .single()

            if (error) {
                throw error
            }

            return data
        } catch (error) {
            console.error('Erro ao atualizar conexão:', error)
            throw error
        }
    }

    try {

        const formData = {
            grant_type: 'authorization_code',
            client_id: config.meliClientId,
            client_secret: config.meliSecretPassword,
            redirect_uri: config.public.meliRedirectUri,
            code: payload.code
        }

        const response = await $fetch('https://api.mercadolibre.com/oauth/token', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData
        })

        if (response.access_token) {
            responseData = await updateConnection(response)
        } else {
            throw new Error('Token de acesso não recebido')
        }

    } catch (error) {
        console.error('Erro na troca do code:', error)
        throw createError({
            statusCode: 400,
            message: 'Falha na autenticação com o Mercado Livre',
            data: error
        })
    }

    return responseData.account_info
})
