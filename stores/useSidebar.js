import {defineStore} from 'pinia'

export const useSidebar = defineStore('sidebar', {
    state: () => ({
        show: false,
        minify: false,
    }),
    actions: {
        showToggle() {
            this.show = !this.show
        },
        showClose() {
            this.show = false
        },
        showOpen() {
            this.show = true
        },
        minifyToggle() {
            this.minify = !this.minify
        },
        minifyClose() {
            this.minify = false
        },
        minifyOpen() {
            this.minify = true
        },
    },
    persist: true,
})
