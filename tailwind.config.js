/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'soft-pink': '#FFD1DC',
        'strawberry': '#FF8B94',
        'matcha': '#C1D7AE',
        'dark-matcha': '#8DA37E',
        'cream': '#FFF0F5',
        'mint': '#E8F5E9'
      }
    },
  },
  plugins: [],
}