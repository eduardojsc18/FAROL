import {defineStore} from 'pinia'
import { useHelpers } from "~/composables/useHelpers.js";

export const useMe = defineStore('me', {
    state: () => ({
        me: {},
    }),
    actions: {
        async get() {
            const {data: response} = await useAsyncData('me',
                () => $fetch('/api/meli/user/me'),
            );
            this.me = response.value
        }
    },
})
