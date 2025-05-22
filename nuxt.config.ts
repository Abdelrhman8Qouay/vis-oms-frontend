// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',

    devtools: { enabled: false },
    pages: true,

    modules: [
        '@vueuse/nuxt',
        '@nuxtjs/tailwindcss',
        '@pinia/nuxt', // '@sidebase/nuxt-auth',
        '@nuxt/eslint', // [magic-regexp][https://regexp.dev/guide]
        'magic-regexp/nuxt',
        '@formkit/auto-animate',
        'nuxt-icon',
    ],

    /*
        [Nitro Guid websocket][https://nitro.build/guide/websocket]
        [How to use (With Nuxt)][https://socket.io/how-to/use-with-nuxt]
        Socket.io client and server module for Nuxt
        . Purpose: Enables real-time communication with the backend.
        . Use Case: Real-time order updates, notifications, and IoT integration.
    */
    nitro: {
        experimental: {
            websocket: true,
        },
    },

    build: {
        terser: {
            terserOptions: {
                compress: {
                    drop_console: true,
                },
            },
            extractComments: false, // default was LICENSES
        },
        extractCSS: true,
    },

    css: ['~/assets/css/main.css'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    /*
    [Nuxt tailwindcss][https://tailwindcss.nuxtjs.org/getting-started/installation]
  */
    tailwindcss: {
        cssPath: ['~/assets/css/main.css', { injectPosition: 'first' }],
        config: {},
        viewer: process.env.NODE_ENV === 'development', // provide with the config viewer on Nuxt DevTools
        editorSupport: process.env.NODE_ENV === 'development', // take advantage of some DX utilities
        exposeConfig: false,
    },


    eslint: {
        config: {
            stylistic: true, // <---
        },
    },

    // Runtime configuration
    runtimeConfig: {
        public: {
            apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000', // Public API URL
            socketUrl: process.env.SOCKET_URL || 'http://localhost:3001', // Public Socket URL
            orderSocketUrl: process.env.SOCKET_ORDER_URL, // Public Socket URL
            notificationSocketUrl: process.env.SOCKET_NOTIFICATION_URL, // Public Socket URL
            apiTimeout: process.env.API_TIMEOUT,
        },
    },
})
