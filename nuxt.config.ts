// https://nuxt.com/docs/api/configuration/nuxt-config
import {defineNuxtConfig} from 'nuxt/config'

export default defineNuxtConfig({

    compatibilityDate: '2024-07-22',

    app: {
        head: {
            htmlAttrs: {lang: 'pt-br', class: 'scroll-smooth'},
            meta: [
                {charset: 'utf-8'},
                {name: 'viewport', content: 'width=device-width, initial-scale=1'},
                {name: 'description', content: 'Sistema de gerenciamento'},
                {name: 'format-detection', content: 'telephone=no'},
                {name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#262626'},
                {name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#262626'},
                {name: 'mobile-web-app-capable', content: 'yes'},
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

    modules: [
      '@nuxtjs/tailwindcss',
      '@vueuse/nuxt',
      'nuxt-lodash',
      'nuxt-swiper',
      '@nuxtjs/google-fonts',
      'dayjs-nuxt',
      'nuxt-lucide-icons',
      '@nuxtjs/color-mode',
      '@pinia/nuxt',
      'vuetify-nuxt-module',
      '@nuxtjs/supabase',
    ],

    supabase: {
        redirectOptions: {
            login: '/auth/login',
            callback: '/auth/confirmation',
            exclude: [
                '/',
                '/^\/index/', // usando regex para pegar variações
            ],
        },
    },

    colorMode: {
        classSuffix: '',
        preference: 'system',
        fallback: 'dark',
    },

    googleFonts: {
        // base64: true,
        // fontsDir: 'assets/fonts',
        // overwriting: true,
        families: {
            Inter: [300, 400, 500, 600, 700, 800, 900],
            Raleway: [300, 400, 500, 600, 700, 800, 900],
        },
    },

    tailwindcss: {
        cssPath: ['~/assets/css/main.css', {injectPosition: "first"}],
        config: {
            important: true,
        }
    },

    vuetify: {
        moduleOptions: {
            /* module specific options */
        },
        vuetifyOptions: {
            defaults: {
                VBtn: {
                    color: 'orange-darken-2',
                    rounded: true,
                    fontWeight: 'medium',
                    letterSpacing: '0',
                    textTransform: 'none',
                    height: '40px',
                    elevation: 0,
                    class: ['transition-all', 'duration-150'],
                    VIcon: {
                        size: 'small',
                    },
                },
                VTextField: {
                    color: 'orange-darken-2',
                    variant: 'outlined',
                    density: 'comfortable',
                    class: ['rounded-md', 'bg-background'],
                    VIcon: {
                        size: 'small',
                    },
                },
                VTextarea: {
                    color: 'orange-darken-2',
                    variant: 'outlined',
                    density: 'comfortable',
                    class: ['rounded-md', 'bg-background'],
                },
                VSelect: {
                    color: 'orange-darken-2',
                    variant: 'outlined',
                    density: 'comfortable',
                    class: ['rounded-md', 'bg-background'],
                    VIcon: {
                        size: 'small',
                    },
                },
                VCheckbox: {
                    color: 'orange-darken-2',
                    density: 'comfortable',
                },
                VRadio: {
                    color: 'orange-darken-2',
                    density: 'comfortable',
                },
                VSwitch: {
                    color: 'orange-darken-2',
                    inset: true,
                },
                VChip: {
                    rounded: true,
                    variant: 'flat',
                },
                VCard: {
                    elevation: 1,
                    rounded: 'lg',
                    class: ['border', 'border-solid', 'border-border'],
                },
                VAlert: {
                    rounded: 'lg',
                    variant: 'tonal',
                },
                VDialog: {
                    rounded: 'lg',
                },
                VNavigationDrawer: {
                    elevation: 1,
                },
                VAppBar: {
                    elevation: 0,
                    class: ['border-b', 'border-solid', 'border-border'],
                },
            }
        }
    },

    dayjs: {
        locales: ['pt-br'],
        plugins: ['relativeTime', 'utc', 'timezone', 'advancedFormat'],
        defaultLocale: 'pt-br',
    },

    build: {
        transpile: ['pinia-plugin-persistedstate'],
    },

    routeRules: {
        '/admin/**': { redirect: { to: '/dashboard'}, ssr: false },
    },

    lodash: {
        prefix: 'lodash',
        upperAfterPrefix: false
    },

    runtimeConfig: {
        public: {
            appName: process.env.NUXT_PUBLIC_APP_NAME || 'FAROL',
            apiBase: process.env.NUXT_PUBLIC_API_BASE,
        }
    },

})