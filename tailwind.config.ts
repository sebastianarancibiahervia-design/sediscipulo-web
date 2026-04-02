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
        moss: "#2E4036",
        clay: "#CC5833",
        cream: "#F2F0E9",
        charcoal: "#1A1A1A",
        skin: "#E8DCC8",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "sans-serif"],
        outfit: ["var(--font-outfit)", "sans-serif"],
        serif: ["var(--font-cormorant)", "serif"],
        mono: ["var(--font-ibm-plex)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
