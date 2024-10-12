// export default defineNuxtPlugin(async (nuxtApp) => {
//
//     const token = await $fetch('/api/meli/access-token', {
//         method: 'POST'
//     })
//
//     const config = useRuntimeConfig()
//
//     const api = $fetch.create({
//         baseURL: config.public.apiBase,
//         headers: {
//             'accept': 'application/json',
//             'content-type': 'application/x-www-form-urlencoded',
//         },
//         onRequest({ request, options, error }) {
//             if (!options.disableAuthentication && token.value) {
//                 const headers = options.headers ||= {}
//                 if (Array.isArray(headers)) {
//                     headers.push(['Authorization', `Bearer ${token.value}`])
//                 } else if (headers instanceof Headers) {
//                     headers.set('Authorization', `Bearer ${token.value}`)
//                 } else {
//                     headers.Authorization = `Bearer ${token.value}`
//                 }
//             }
//         },
//         async onResponseError({ response }) {
//             if (response.status === 401) {
//                 await nuxtApp.runWithContext(() => navigateTo('/auth'))
//             }
//         }
//     })
//
//     return {
//         provide: {
//             api
//         }
//     }
// })
