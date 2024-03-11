/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './app.js',
    './src/**/*.{html,js}'
  ],
  theme: {
    extend: {}
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}
