import {useMe} from "~/stores/useMe.js";
export default defineNuxtRouteMiddleware(async (to, from) => {
    const me = useMe()
    const get = await me.get()
    if (!!get) {
        return true
    }
})
