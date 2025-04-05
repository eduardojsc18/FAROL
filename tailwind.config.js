import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./components/**/*.{js,vue,ts}",
        "./layouts/**/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        "./app.vue",
        "./nuxt.config.js",
        "./error.vue",
        "./modules/**/*.{js,vue,ts}"
    ],
    darkMode: 'selector',
    safelist: ['dark'],

    plugins: [tailwindcssAnimate, require("tailwindcss-animate")],
}
