// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},

    css: ['~/assets/css/main.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    modules: [
        '@pinia/nuxt',
        '@pinia-plugin-persistedstate/nuxt',
        '@vueuse/nuxt',
        'nuxt-lodash',
        '@nuxtjs/google-fonts',
    ],
    build: {
        transpile: ['pinia-plugin-persistedstate'],
    },
    runtimeConfig: {
        apiSecret: '',
        public: {
            appName: process.env.NUXT_APP_NAME || 'CONSULTA DE PRODUTOS',
            apiBase: process.env.NUXT_API_BASE || 'https://api.mercadolibre.com/',
        }
    },
})
