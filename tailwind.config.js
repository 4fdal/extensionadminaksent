export default {

    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,vue,html}"
    ],

    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#60A5FA', // light blue
                    50: '#EFF6FF',
                    100: '#DBEAFE',
                    500: '#60A5FA',
                    600: '#3B82F6',
                    light: '#93C5FD',
                },
                secondary: '#38BDF8', // sky blue
                accent: '#00D4FF',
                dark: {
                    DEFAULT: '#1E293B',
                    900: '#0F172A',
                    800: '#1E293B',
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