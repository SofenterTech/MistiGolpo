/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#8B3A3A",
          secondary: "#F4D6D2",
          bg: "#FFF9F6",
          cream: "#FFF3E8",
          accent: "#D9A441",
          text: "#2D2523",
          muted: "#756966",
          success: "#3F7D58",
          error: "#B43D3D"
        }
      }
    },
  },
  plugins: [],
}
