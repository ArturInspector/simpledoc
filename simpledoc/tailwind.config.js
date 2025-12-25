/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // MS Office-inspired color palette
        office: {
          // Primary colors similar to MS Office
          blue: {
            50: '#e8f4fd',
            100: '#d1e9fb',
            200: '#a3d3f7',
            300: '#75bdf3',
            400: '#47a7ef',
            500: '#217346', // MS Office Green (можно использовать как акцент)
            600: '#1a5c38',
            700: '#13452a',
            800: '#0d2e1c',
            900: '#06170e',
          },
          // Ribbon и UI цвета
          ribbon: {
            bg: '#f3f3f3',
            border: '#d4d4d4',
            hover: '#e5e5e5',
            active: '#d0d0d0',
          },
          // Темная тема
          dark: {
            bg: '#1e1e1e',
            surface: '#252526',
            border: '#3e3e42',
            text: '#cccccc',
            muted: '#858585',
          },
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Cascadia Code', 'Consolas', 'monospace'],
      },
      spacing: {
        ribbon: '48px', // Высота Ribbon
        header: '32px', // Высота Header
      },
      boxShadow: {
        'office': '0 1px 2px rgba(0, 0, 0, 0.1)',
        'office-lg': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
}

