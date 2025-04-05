export default defineNuxtPlugin((nuxtApp) => {
    const session = useSupabaseSession()
    const cookies = process.server ? useRequestHeaders(['cookie']) : { Cookie: document.cookie };

    const fetchSupabase = $fetch.create({
        onRequest({ request, options, error }) {
            if (session.value) {
                options.headers = {
                    ...options.headers,
                    ...cookies
                };
            }
        },
        async onResponseError({ response }) {
            if (response.status === 401) {
                await nuxtApp.runWithContext(() => navigateTo('/auth/login'))
            }
        }
    })

    return {
        provide: {
            fetchSupabase
        }
    }
})
