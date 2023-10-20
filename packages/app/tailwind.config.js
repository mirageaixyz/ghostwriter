/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        cal: ["var(--font-cal)"],
      },
      colors: {
        vista: {
          50: "#effaf5",
          100: "#d7f4e5",
          200: "#b3e7d0",
          300: "#79d2b0",
          400: "#4cbb94",
          500: "#2a9f7a",
          600: "#1b8062",
          700: "#166650",
          800: "#145141",
          900: "#114337",
          950: "#08261f",
        },
      },
      data: {
        active: "active=true",
      },
    },
  },
  plugins: [],
};
