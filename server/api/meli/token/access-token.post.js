export default defineEventHandler(async (event) => {

    const { $api } = useNuxtApp()

    const storage = useStorage('data')
    let meliConfig = await storage.getItem('meli_config') ?? {}

    if (meliConfig.access_token) {
        const tokenExpired = (new Date() - new Date(meliConfig.created_at)) / 1000 < meliConfig.expires_in
        return tokenExpired ? meliConfig.access_token : await $fetch('/api/meli/token/refresh-token');
    }

    const config = useRuntimeConfig()

    const response = await $api(`/oauth/token`, {
        method: 'POST',
        disableAuthentication: true,
        body: {
            'grant_type': 'authorization_code',
            'client_id': config.apiClientId,
            'client_secret': config.apiClientSecret,
            'code': config.apiCode,
            'redirect_uri': config.apiRedirectUri,
        }
    })

    const meliData = {
        ...response,
        created_at: new Date()
    }

    await storage.setItem('meli_config', meliData)

    return meliData.access_token

})
