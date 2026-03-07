export default {

    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,vue,html}"
    ],

    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2196F3',
                    50: '#E3F2FD',
                    100: '#BBDEFB',
                    500: '#2196F3',
                    600: '#1E88E5',
                },
            },
        },
    },

    // Override style Ionic
    important: true,

    // Hindari konflik dengan Ionic
    prefix: 'tw-',
}