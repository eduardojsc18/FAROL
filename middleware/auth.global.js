import {navigateTo} from "#app";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const user = useCookie('auth');
    if (!user.value) {
        if (to.path !== '/auth') {
            return navigateTo('/auth');
        }
    } else {
        if (to.path.includes('auth')) {
            return navigateTo('/')
        }
    }
})
