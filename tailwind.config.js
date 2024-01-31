/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './client/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
