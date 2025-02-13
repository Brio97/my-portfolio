/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        iconLabel: {
          '0%, 45%': { opacity: '1', transform: 'rotateX(0deg)' },
          '50%, 95%': { opacity: '0', transform: 'rotateX(180deg)' },
          '100%': { opacity: '1', transform: 'rotateX(360deg)' }
        },
        labelIcon: {
          '0%, 45%': { opacity: '0', transform: 'rotateX(180deg)' },
          '50%, 95%': { opacity: '1', transform: 'rotateX(0deg)' },
          '100%': { opacity: '0', transform: 'rotateX(180deg)' }
        }
      },
      animation: {
        iconLabel: 'iconLabel 3s ease-in-out infinite',
        labelIcon: 'labelIcon 3s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}