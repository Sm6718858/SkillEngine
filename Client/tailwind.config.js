/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
   safelist: [
    "translate-x-0",
    "-translate-x-full",
    "md:translate-x-0",
    "transition-transform",
    "duration-300",
    "ease-in-out"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
