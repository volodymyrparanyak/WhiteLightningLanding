/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'default': ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        'heading': ['var(--font-nunito)', 'system-ui', 'sans-serif'],
        'body': ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        secondary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 20px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
        'button': '0 2px 4px rgba(59, 130, 246, 0.3)',
        'button-hover': '0 4px 8px rgba(59, 130, 246, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: 'inherit',
            h1: {
              fontFamily: 'var(--font-nunito)',
              fontWeight: 700,
              color: 'inherit',
            },
            h2: {
              fontFamily: 'var(--font-nunito)',
              fontWeight: 700,
              color: 'inherit',
            },
            h3: {
              fontFamily: 'var(--font-nunito)',
              fontWeight: 600,
              color: 'inherit',
            },
            h4: {
              fontFamily: 'var(--font-nunito)',
              fontWeight: 600,
              color: 'inherit',
            },
            p: {
              fontFamily: 'var(--font-inter)',
              color: 'inherit',
            },
            code: {
              fontFamily: '"Fira Code", monospace',
              color: 'inherit',
              padding: '0.2em 0.4em',
              borderRadius: '0.375rem',
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
            },
            pre: {
              fontFamily: '"Fira Code", monospace',
              color: 'inherit',
              backgroundColor: '#f6f8fa',
              borderRadius: '0.5rem',
              padding: '1.25rem',
              overflow: 'auto',
            },
            'pre code': {
              backgroundColor: 'transparent',
              fontSize: '0.875rem',
              padding: 0,
            },
            a: {
              color: '#3b82f6',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}