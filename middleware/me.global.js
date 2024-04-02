import {useMe} from "~/stores/useMe.js";
export default defineNuxtRouteMiddleware((to, from) => {
    if (to) {
        useMe().get()
    }
})
