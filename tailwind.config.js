/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D9D9D9',  
        secondary: '#F5F5F5',
        accent: '#FF6347',   
        background: '#F9F9F9',
        text: '#333333',     
      },
    },
  },
  plugins: [],
}
