import {useMe} from "~/stores/useMe.js";
export default defineNuxtRouteMiddleware((to, from) => {
    useMe().get()
})
