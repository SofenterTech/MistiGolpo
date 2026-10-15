/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Monginis-inspired palette
        brand: {
          primary: "#E5097F",
          "primary-dark": "#C40770",
          secondary: "#20134B",
          lavender: "#E2DEF5",
          "lavender-light": "#F1EEFB",
          line: "#E6E2F3",
          bg: "#FFFFFF",
          surface: "#F7F8F9",
          text: "#222222",
          muted: "#666666",
          success: "#3F7D58",
          error: "#B43D3D"
        }
      }
    },
  },
  plugins: [],
}
