import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teak: {
          DEFAULT: "#5C3A1E",
          dark: "#3E2712",
          light: "#7A5230",
        },
        gold: {
          DEFAULT: "#8B6914",
          soft: "#C4A265",
          hover: "#6B5010",
        },
        cream: {
          DEFAULT: "#FFF8F0",
          alt: "#EDE5D8",
        },
        card: "#FEFCF8",
        "text-main": "#2C1810",
        "text-muted": "#6B5545",
        price: "#8B2500",
      },
      fontFamily: {
        serif: ["'Mitr'", "var(--font-castoro)", "serif"],
        sans: ["'Krub'", "sans-serif"],
        castoro: ["var(--font-castoro)", "serif"],
        mitr: ["'Mitr'", "sans-serif"],
        pattaya: ["'Pattaya'", "cursive"],
      },
      fontSize: {
        // Accessible size scale
        "body": ["1rem", { lineHeight: "1.7" }],       // 18-20px
        "body-lg": ["1.125rem", { lineHeight: "1.7" }], // 20-22px
        "h5": ["1.25rem", { lineHeight: "1.4" }],       // 22-25px
        "h4": ["1.5rem", { lineHeight: "1.3" }],        // 27-30px
        "h3": ["1.75rem", { lineHeight: "1.3" }],       // 31-35px
        "h2": ["2.25rem", { lineHeight: "1.2" }],       // 40-45px
        "h1": ["2.75rem", { lineHeight: "1.1" }],       // 49-55px
        "display": ["3.5rem", { lineHeight: "1.1" }],   // 63-70px
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
