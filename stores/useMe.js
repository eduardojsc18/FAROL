import {defineStore} from 'pinia'
import helpers from "~/composables/helpers.js";

export const useMe = defineStore('me', {
    state: () => ({
        me: {},
    }),
    actions: {
        async get() {
            const {data} = await useAsyncData('ME',
                () => helpers().customFetch(`/users/me`),
                {immediate: true}
            );
            this.me = data.value
        }
    },
})
