import { serverSupabaseClient } from "#supabase/server";

export default defineEventHandler(async (event) => {
    const client = await serverSupabaseClient(event)
    const config = useRuntimeConfig(event)

    const { id } = event.context.params;
    const payload = await readBody(event)

    let responseData = {}

    const updateConnection = async (connection) => {
        try {
            const accountInfo = await getAccountInfo(connection)

            const { data, error } = await client
                .from('connections')
                .update({
                    status: 'connected',
                    oauth_id: connection.user_id,
                    access_token: connection.access_token,
                    refresh_token: connection.refresh_token,
                    expires_in: connection.expires_in,
                    account_info: accountInfo,
                })
                .eq('id', payload.id)
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

    const getAccountInfo = async (connection) => {
        try {
            const response = await $fetch('https://api.mercadolibre.com/users/me', {
                headers: {
                    Authorization: `Bearer ${connection.access_token}`,
                    Accept: 'application/json',
                },
            })
            return response
        } catch (error) {
            console.error('Erro ao buscar informações da conta:', error)
            throw error
        }
    }

    try {
        // Preparando o corpo da requisição no formato correto para x-www-form-urlencoded
        const formData = new URLSearchParams({
            grant_type: 'authorization_code',
            client_id: config.meliClientId,
            client_secret: config.meliSecretPassword,
            redirect_uri: config.public.meliRedirectUri,
            code: payload.code
        }).toString()

        const response = await $fetch('https://api.mercadolibre.com/oauth/token', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData // Não usar JSON.stringify aqui
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

    return responseData
})
