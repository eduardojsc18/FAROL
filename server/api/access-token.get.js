export default defineEventHandler(async (event) => {

    const storage = useStorage('data')
    let tokens = await storage.getItem('tokens')

    // Verifica se o token já expirou, caso não, envia o access_token salvo no banco
    if ((new Date() - new Date(tokens?.updated_at)) / 1000 < tokens?.expires_in) {
        return tokens.access_token
    }

    const config = useRuntimeConfig(event)
    const baseURL = config.public.apiBase

    let versionTokens = {
        old_token: tokens?.new_token ?? config.apiToken,
        new_token: '',
        expires_in: tokens?.expires_in ?? '',
    }

    const token = await $fetch(`/oauth/token`, {
        method: 'POST',
        baseURL,
        headers: {
            'accept': 'application/json',
            'content-type': 'application/x-www-form-urlencoded',
        },
        body: {
            'grant_type': 'refresh_token',
            'client_id': config.apiClientId,
            'client_secret': config.apiClientSecret,
            'refresh_token': versionTokens.old_token,
        }
    })

    versionTokens.new_token = token.refresh_token
    versionTokens.expires_in = token.expires_in
    versionTokens.access_token = token.access_token
    versionTokens.updated_at = new Date()

    await storage.setItem('tokens', versionTokens)

    return token.access_token

})
