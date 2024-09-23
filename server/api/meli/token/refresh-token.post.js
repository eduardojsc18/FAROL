export default defineEventHandler(async (event) => {

    const { $api } = useNuxtApp()
    const config = useRuntimeConfig(event)

    const storage = useStorage('data')
    const meliConfig = await storage.getItem('meli_config')

    const response = await $api(`/oauth/token`, {
        method: 'POST',
        disableAuthentication: true,
        body: {
            'grant_type': 'refresh_token',
            'client_id': config.apiClientId,
            'client_secret': config.apiClientSecret,
            'refresh_token': meliConfig.refresh_token,
        }
    })

    const meliData = {
        ...response,
        created_at: new Date()
    }

    await storage.setItem('meli_config', meliData)

    return meliData.access_token

})
