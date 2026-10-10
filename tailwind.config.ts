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
        ink: "#0E2744",
        navy: {
          50: "#F3F7FB",
          100: "#E6EEF6",
          200: "#C9D8EA",
          300: "#9BB6D4",
          400: "#5B8FBF",
          500: "#2B74B3",
          600: "#1E5F96",
          700: "#1A4A74",
          800: "#163A5C",
          900: "#12263F",
          950: "#0B1B2E",
        },
        accent: "#1E6BB8",
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "Georgia", "serif"],
        sans: ["var(--font-source-sans)", "system-ui", "sans-serif"],
        script: ["var(--font-caveat)", "cursive"],
      },
      boxShadow: {
        card: "0 10px 40px rgba(14, 39, 68, 0.08)",
        soft: "0 4px 18px rgba(14, 39, 68, 0.06)",
      },
      maxWidth: {
        site: "1320px",
      },
    },
  },
  plugins: [],
};

export default config;
