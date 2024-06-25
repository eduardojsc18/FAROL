import {defineStore} from "pinia";
import {useHelpers} from "~/composables/useHelpers.js";

export const useAuth = defineStore('auth', {
    state: () => ({
        auth: {},
    }),
    actions: {
        async get(data) {
            const response = await $fetch('/api/auth', {
                method: "POST",
                body: data,
            });
        }
    },
})
