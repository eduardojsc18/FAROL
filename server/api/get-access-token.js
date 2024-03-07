export default defineEventHandler(async (event) => {

    const config = useRuntimeConfig(event)
    const baseURL = config.public.apiBase

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
            'refresh_token': config.apiToken,
        }
    })

    return token.access_token

})
