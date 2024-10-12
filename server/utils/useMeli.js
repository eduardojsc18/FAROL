const config = useRuntimeConfig()
const storage = useStorage('data')
const meliConfig = await storage.getItem('meli_config') ?? {}
export const useMeli = () => {
    const meliAccessToken = async () => {
        // Se o token estiver expirado
        if (meliConfig.access_token && (new Date() - new Date(meliConfig.created_at)) / 1000 < meliConfig.expires_in) {
            return meliRefreshToken()
        }
        const response = await meliFetch(`/oauth/token`, {
            method: 'POST',
            body: {
                'grant_type': 'authorization_code',
                'client_id': config.apiClientId,
                'client_secret': config.apiClientSecret,
                'code': config.apiCode,
                'redirect_uri': config.apiRedirectUri,
            }
        }, false)
        return meliSaveData(response)
    }
    const meliRefreshToken = async () => {
        const response = await meliFetch(`/oauth/token`, {
            method: 'POST',
            body: {
                'grant_type': 'refresh_token',
                'client_id': config.apiClientId,
                'client_secret': config.apiClientSecret,
                'refresh_token': meliConfig.access_token,
            }
        }, false);
        return await meliSaveData(response);
    }
    const meliSaveData = async (response) => {
        const meliData = {
            ...response,
            created_at: new Date()
        };
        await storage.setItem('meli_config', meliData);
        return meliData.access_token;
    }
    const meliFetch = async (url, options, authorization) => {
        const token = authorization ? await meliAccessToken() : ''
        return await $fetch(url, {
            baseURL: config.public.apiBase,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            ...options,
            onRequest(context) {
                if (!context.options.headers['Authorization'] && token && authorization) {
                    const headers = context.options.headers ||= {};
                    if (Array.isArray(headers)) {
                        headers.push(['Authorization', `Bearer ${token}`]);
                    } else if (headers instanceof Headers) {
                        headers.set('Authorization', `Bearer ${token}`);
                    } else {
                        headers['Authorization'] = `Bearer ${token}`;
                    }
                }
            },
        })
    }

    return {
        meliFetch,
    }
}
