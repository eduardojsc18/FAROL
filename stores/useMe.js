import {defineStore} from 'pinia'
import helpers from "~/composables/helpers.js";

export const useMe = defineStore('me', {
    state: () => ({
        me: {},
    }),
    actions: {
        async get() {
            const {data: response} = await useAsyncData('ME',
                () => helpers().customFetch(`/users/me`),
            );
            this.me = response.value
        }
    },
})
