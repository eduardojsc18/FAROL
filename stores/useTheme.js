import {defineStore} from 'pinia'

export const useThemeCustom = defineStore('theme', {
    state: () => ({
        style: 'dark',
    }),
    actions: {
        changeTheme() {
            if (this.style === 'dark') {
                document.documentElement.classList.remove('dark')
                this.style = 'light'
            } else {
                document.documentElement.classList.add('dark')
                this.style = 'dark'
            }
        }
    },
    persist: true,
})
