import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        saffron: "#F59E0B",
        chili: "#EF4444",
        basil: "#10B981",
        cream: "#FFFBF0",
        ink: "#1C1917",
        smoke: "#78716C",
      },
      fontFamily: {
        sarabun: ["var(--font-sarabun)", "sans-serif"],
        mitr: ["var(--font-mitr)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
