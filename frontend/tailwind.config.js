/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Curator's Canvas Palette
                canvas: '#F9F9F7',
                surface: '#FFFFFF',
                text: {
                    primary: '#222222',
                    secondary: '#6B6B6B',
                },
                accent: {
                    DEFAULT: '#BC6C4A',
                    light: '#D4856A',
                    dark: '#9A5738',
                },
                border: '#EAEAE7',
                input: '#F0F0F0',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
}