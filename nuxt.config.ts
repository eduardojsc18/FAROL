// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
export default defineNuxtConfig({
    app: {
        head: {
            htmlAttrs: {lang: 'pt-br'},
            meta: [
                {charset: 'utf-8'},
                {name: 'viewport', content: 'width=device-width, initial-scale=1'},
                {name: 'description', content: 'Sistema de gerenciamento'},
                {name: 'format-detection', content: 'telephone=no'},
                {name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#FFFFFF'},
                {name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#0f172a'},
                {name: 'apple-mobile-web-app-capable', content: 'yes'},
                {name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent'},
            ],
            link: [
                {href: '/favicon-animated.gif', rel: 'icon', type: 'image/gif'},
            ],
        }
    },
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
        apiClientId: process.env.NUXT_API_CLIENT_ID,
        apiClientSecret: process.env.NUXT_API_CLIENT_SECRET,
        apiRedirectUri: process.env.NUXT_API_REDIRECT_URI,
        apiToken: process.env.NUXT_API_TOKEN,
        public: {
            appName: process.env.NUXT_PUBLIC_APP_NAME || 'CONSULTA DE PRODUTOS',
            apiBase: process.env.NUXT_PUBLIC_API_BASE,
        }
    },
})
