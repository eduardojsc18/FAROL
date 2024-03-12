export default defineEventHandler(async (event) => {

    const config = useRuntimeConfig(event)
    const baseURL = config.public.apiBase

    const storage = useStorage('data')
    let tokens = await storage.getItem('tokens')
    let versionTokens = {
        old_token: tokens?.new_token ?? config.apiToken,
        new_token: '',
        expires_in: tokens?.expires_in ?? ''
    }

    // TODO: Fazer logica para pegar um novo token apenas após o vencimento da expiração

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

    await storage.setItem('tokens', versionTokens)

    return token.access_token

})
