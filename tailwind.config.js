export default {

    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,vue,html}"
    ],

    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#6C63FF',
                    50: '#EEECFF',
                    100: '#D9D7FF',
                    500: '#6C63FF',
                    600: '#5A52D5',
                },
                secondary: '#8B5CF6',
                accent: '#00D4FF',
                dark: {
                    DEFAULT: '#0F172A',
                    900: '#0F172A',
                    800: '#111827',
                }
            },
            animation: {
                'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'blob': 'blob 7s infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
            },
        },
    },

    // Override style Ionic
    important: true,
}