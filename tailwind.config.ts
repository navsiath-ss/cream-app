import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#fdfbf7",
          100: "#fbf7ef",
          200: "#f6eedd",
          300: "#ede0c4",
          400: "#e1caa2",
          500: "#d3b07d",
          600: "#be9560",
          700: "#9e774c",
          800: "#7f5f3e",
          900: "#684e34",
        },
        brand: {
          gold: "#D4AF37",
          dark: "#0F1117",
          surface: "#1A1D27",
          border: "#2A2E3D",
          accent: "#6366F1",
          emerald: "#10B981",
        }
      },
    },
  },
  plugins: [],
};
export default config;
