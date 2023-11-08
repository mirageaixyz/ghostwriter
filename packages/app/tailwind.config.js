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
      animation: {
        "slide-from-bottom":
          "slide-from-bottom 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards",
        "slide-fade-down":
          "slide-fade-down 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-fade-left":
          "slide-fade-left 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-fade-up": "slide-fade-up 400ms cubic-bezier(0.16, 1, 0.3, 1)",
        "slide-fade-right":
          "slide-fade-dorightwn 400ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "slide-fade-down": {
          from: { opacity: 0, transform: "translateY(-2px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "slide-fade-left": {
          from: { opacity: 0, transform: "translateX(2px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        "slide-fade-up": {
          from: { opacity: 0, transform: "translateY(2px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        "slide-fade-right": {
          from: { opacity: 0, transform: "translateX(-2px)" },
          to: { opacity: 1, transform: "translateX(0)" },
        },
        "slide-from-bottom": {
          "0%": {
            transform: "translateY(2rem)",
            opacity: 0,
          },
          "100%": {
            transform: "translateY(0)",
            opacity: 1,
          },
        },
      },
    },
  },
  plugins: [],
};
