// https://nuxt.com/docs/api/configuration/nuxt-config
import {defineNuxtConfig} from 'nuxt/config'

export default defineNuxtConfig({

    app: {
        head: {
            htmlAttrs: {lang: 'pt-br'},
            meta: [
                {charset: 'utf-8'},
                {name: 'viewport', content: 'width=device-width, initial-scale=1'},
                {name: 'description', content: 'Sistema de gerenciamento'},
                {name: 'format-detection', content: 'telephone=no'},
                {name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#262626'},
                {name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#262626'},
                {name: 'apple-mobile-web-app-capable', content: 'yes'},
                {name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent'},
            ],
            link: [
                {href: '/favicon/apple-touch-icon.png', rel: 'apple-touch-icon', sizes: '180x180'},
                {href: '/favicon/favicon-32x32.png', rel: 'icon', type: 'image/png', sizes: '32x32'},
                {href: '/favicon/favicon-16x16.png', rel: 'icon', type: 'image/png', sizes: '16x16'},
                {href: '/favicon/site.webmanifest', rel: 'manifest'},
            ],
        },
        pageTransition: {name: 'page', mode: 'out-in'},
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
        'nuxt-swiper',
        'dayjs-nuxt',
        // '@nuxtjs/google-fonts',
    ],

    dayjs: {
        locales: ['pt-br'],
        plugins: ['relativeTime', 'utc', 'timezone', 'advancedFormat'],
        defaultLocale: 'pt-br',
    },

    build: {
        transpile: ['pinia-plugin-persistedstate'],
    },

    nitro: {
        storage: {
            data: { driver: 'vercelKV' },
        }
    },

    ssr: false,

    runtimeConfig: {
        apiClientId: process.env.NUXT_API_CLIENT_ID,
        apiClientSecret: process.env.NUXT_API_CLIENT_SECRET,
        apiRedirectUri: process.env.NUXT_API_REDIRECT_URI,
        apiCode: process.env.NUXT_API_CODE,
        login: process.env.NUXT_LOGIN_ACCOUNT,
        password: process.env.NUXT_PASSWORD_ACCOUNT,
        public: {
            appName: process.env.NUXT_PUBLIC_APP_NAME || 'CONSULTA DE PRODUTOS',
            apiBase: process.env.NUXT_PUBLIC_API_BASE,
        }
    },

    compatibilityDate: '2024-07-22',

})
