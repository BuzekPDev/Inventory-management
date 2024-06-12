/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './views/**/*.{html,js,ejs}'
  ],
  theme: {
    extend: {
      height: {
        '0.5': '0.125rem',
        '0.75': '0.1875rem'
      },
      maxWidth: {
        'limit': '1000px'
      }
    },
    screens: {
      'sm': '561px'
    }
  },
  plugins: [],
}

