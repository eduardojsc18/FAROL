import {navigateTo} from "#app";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const session = useSupabaseSession()

    if (!session.value && to.path.startsWith('/admin')) {
        return navigateTo('/auth/login')
    }
})
