import {navigateTo} from "#app";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const session = await useSupabaseSession()

    if (!session.value && to.path.startsWith('/admin')) {
        return navigateTo('/auth/login')
    }
})
