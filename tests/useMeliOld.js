export const useMeliOld = async () => {

    const config = useRuntimeConfig()

    const api = $fetch.create({
        baseURL: config.public.meliUrl,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })

    const accessToken = async () => {
        const response = await api('/oauth/token', {
            method: 'POST',
            body: {
                'grant_type': 'authorization_code',
                'client_id': config.apiClientId,
                'client_secret': config.apiClientSecret,
                'code': config.apiCode,
                'redirect_uri': config.apiRedirectUri,
            },
        })
        await saveData(response)
        return response.access_token
    }
    const refreshToken = async () => {
        const response = await api('/oauth/token', {
            method: 'POST',
            body: {
                'grant_type': 'refresh_token',
                'client_id': config.apiClientId,
                'client_secret': config.apiClientSecret,
                'refresh_token': meliConfig.refresh_token,
            },
        })
        await saveData(response)
        return response.access_token
    }
    const saveData = async (response) => {
        return await storage.setItem('meli_config', {
            ...response,
            created_at: new Date()
        })
    }
    const meliFetch = async (url, options) => {

        const isTokenExpired = (new Date() - new Date(meliConfig.created_at)) / 1000 >= meliConfig.expires_in;
        const token = meliConfig.access_token ?
                        (isTokenExpired ? await refreshToken() : meliConfig.access_token) :
                            await accessToken()

        return await api(url, {
            headers: { 'Authorization': `${meliConfig.token_type} ${token}` },
            ...options,
        })

    }

    return {
        meliFetch
    }
}
