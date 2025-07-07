/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", "ui-sans-serif", "system-ui"],
      },
      colors: {
        primary: "#2A3C5D",
        accent: "#00B8A9",
      },
      boxShadow: {
        soft: "0 2px 12px rgba(0,0,0,0.06)",
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};


