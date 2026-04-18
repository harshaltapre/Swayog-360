/** @type {import('tailwindcss').Config} */
export default {
    theme: {
        extend: {
            colors: {
                // Primary: Deep Navy - Stability, Trust, Professional Rigor
                primary: '#1A365D',
                'primary-fixed': '#1A365D',
                'primary-fixed-dim': '#0f1f3a',
                'on-primary': '#ffffff',

                // Tertiary: Growth Green - Success States, Highlights, Secondary CTA
                tertiary: '#48BB78',
                'tertiary-container': '#c6f6d5',
                'on-tertiary': '#ffffff',
                'on-tertiary-container': '#22543d',

                // Neutral Base: Slate - Modern Backdrop
                neutral: '#64748B',
                'neutral-light': '#f1f5f9',

                // Surface & Text
                surface: '#ffffff',
                'surface-container': '#f8fafc',
                'surface-container-low': '#f1f5f9',
                'on-surface': '#1a202c',
                'on-surface-variant': '#64748B',
            },
            borderRadius: {
                none: '0',
                xs: '2px',
                sm: '4px',
                md: '6px',
                lg: '8px',
                xl: '10px',
            },
            boxShadow: {
                xs: '0 1px 2px rgba(26, 54, 93, 0.05)',
                sm: '0 2px 4px rgba(26, 54, 93, 0.08)',
                md: '0 4px 12px rgba(26, 54, 93, 0.1)',
                lg: '0 8px 24px rgba(26, 54, 93, 0.12)',
                xl: '0 12px 32px rgba(26, 54, 93, 0.15)',
            },
            backgroundImage: {
                'gradient-hero': 'linear-gradient(135deg, #1A365D 0%, #0f1f3a 100%)',
                'gradient-success': 'linear-gradient(135deg, #48BB78 0%, #38a169 100%)',
            },
            spacing: {
                // Level 2: Normal balanced spatial rhythm
                ...require('tailwindcss/defaultConfig').theme.spacing,
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
};