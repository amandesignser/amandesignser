/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary-bg': '#0a0a0f',
                'secondary-bg': '#111117',
                'card-bg': 'rgba(17, 17, 23, 0.8)',
                'glass-bg': 'rgba(17, 17, 23, 0.6)',
                'neon-cyan': '#00ffff',
                'neon-pink': '#ff00ff',
                'neon-purple': '#8a2be2',
                'neon-green': '#00ff00',
                'text-primary': '#ffffff',
                'text-secondary': '#b0b0b0',
                'text-muted': '#808080',
            },
            fontFamily: {
                sans: ['"Manufacturing Consent"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
            },
            backgroundImage: {
                'gradient-text': 'linear-gradient(45deg, #00ffff, #ff00ff, #00ff00)',
                'radial-custom': `
          radial-gradient(circle at 25% 25%, rgba(0, 255, 255, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(255, 0, 255, 0.08) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(138, 43, 226, 0.05) 0%, transparent 70%)
        `,
            },
            animation: {
                'float': 'float 20s infinite linear',
                'float-delayed': 'float 25s infinite linear',
                'float-slow': 'float 18s infinite linear',
                'gradient-shift': 'gradientShift 4s ease-in-out infinite',
                'gradient-rotate': 'gradientRotate 8s ease-in-out infinite',
                'spin-slow': 'logo-spin 20s linear infinite',
            },
            keyframes: {
                float: {
                    '0%': { transform: 'translateY(100vh) translateX(0) rotate(0deg)', opacity: '0' },
                    '10%': { opacity: '0.6' },
                    '90%': { opacity: '0.6' },
                    '100%': { transform: 'translateY(-100vh) translateX(100px) rotate(360deg)', opacity: '0' },
                },
                gradientShift: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '25%': { backgroundPosition: '100% 50%' },
                    '50%': { backgroundPosition: '200% 50%' },
                    '75%': { backgroundPosition: '300% 50%' },
                },
                gradientRotate: {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                },
                'logo-spin': {
                    'from': { transform: 'rotate(0deg)' },
                    'to': { transform: 'rotate(360deg)' },
                }
            },
            boxShadow: {
                'neon-glow': '0 0 20px rgba(0, 255, 255, 0.2), inset 0 0 20px rgba(0, 255, 255, 0.1)',
                'neon-glow-hover': '0 0 30px rgba(0, 255, 255, 0.4), 0 0 60px rgba(0, 255, 255, 0.2), inset 0 0 30px rgba(0, 255, 255, 0.15)',
            }
        },
    },
    plugins: [],
}
