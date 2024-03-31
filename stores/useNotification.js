import {defineStore} from 'pinia'

export const useNotification = defineStore('notification', {
    state: () => ({
        show: false,
    }),
    actions: {
        toggle() {
            this.show = !this.show
        },
        close() {
            this.show = false
        },
        open() {
            this.show = true
        },
    },
})
