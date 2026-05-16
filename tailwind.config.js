/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            colors: {
                dark: {
                    900: '#0a0e1a',
                    800: '#0f1729',
                    700: '#151d30',
                    600: '#1a2340',
                    500: '#1e293b',
                },
                surface: {
                    DEFAULT: 'rgba(255,255,255,0.04)',
                    hover: 'rgba(255,255,255,0.08)',
                    active: 'rgba(255,255,255,0.12)',
                    border: 'rgba(255,255,255,0.08)',
                },
                accent: {
                    indigo: '#6366f1',
                    violet: '#8b5cf6',
                    cyan: '#06b6d4',
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(ellipse at top, var(--tw-gradient-stops))',
                'accent-gradient': 'linear-gradient(135deg, #6366f1, #8b5cf6, #a78bfa)',
                'accent-gradient-h': 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                'dark-gradient': 'linear-gradient(180deg, #0a0e1a 0%, #111827 50%, #0f1729 100%)',
                'glass-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
                'hero-glow': 'radial-gradient(600px circle at 50% 0%, rgba(99,102,241,0.15), transparent 70%)',
            },
            boxShadow: {
                'glow': '0 0 30px rgba(99,102,241,0.15)',
                'glow-lg': '0 0 60px rgba(99,102,241,0.2)',
                'glow-accent': '0 0 40px rgba(139,92,246,0.2)',
                'glow-emerald': '0 0 30px rgba(16,185,129,0.2)',
                'glass': '0 8px 32px rgba(0,0,0,0.3)',
                'card': '0 4px 24px rgba(0,0,0,0.2)',
                'card-hover': '0 8px 40px rgba(0,0,0,0.3)',
            },
            animation: {
                'shimmer': 'shimmer 2s infinite linear',
                'float': 'float 6s ease-in-out infinite',
                'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
                'slide-up': 'slideUp 0.5s ease-out',
                'fade-in': 'fadeIn 0.3s ease-out',
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'pulse-glow': {
                    '0%, 100%': { boxShadow: '0 0 20px rgba(99,102,241,0.1)' },
                    '50%': { boxShadow: '0 0 40px rgba(99,102,241,0.3)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
};