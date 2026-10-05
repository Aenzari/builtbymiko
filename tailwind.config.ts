import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          100: "#f1f5ed",
          400: "#a4b0a4",
          500: "#718076",
          600: "#506056",
        },
        surface: {
          950: "#0b0d0c",
          900: "#101412",
          850: "#151a17",
          800: "#1a211d",
          700: "#242d27",
          600: "#334037",
        },
        glass: {
          DEFAULT: "rgba(255, 255, 255, 0.04)",
          strong: "rgba(255, 255, 255, 0.07)",
          border: "rgba(255, 255, 255, 0.12)",
          "border-top": "rgba(255, 255, 255, 0.22)",
          "border-hover": "rgba(190, 255, 130, 0.42)",
        },
        accent: {
          DEFAULT: "#b7f36b",
          soft: "#d9ffad",
          strong: "#8fc64e",
        },
        clay: "#ff8e70",
        terracotta: "#d2a679",
        slate: "#91b5c7",
      },
      fontFamily: {
        sans: [
          "var(--font-display)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        grain: "url('/noise.svg')",
      },
      boxShadow: {
        // Dark glass surfaces read through a restrained inset highlight and
        // deep diffuse shadow; .specular-border supplies the directional edge.
        glass: "0 1px 0 0 rgba(255,255,255,0.12) inset, 0 24px 60px -24px rgba(0,0,0,0.45)",
        "glass-lg": "0 1px 0 0 rgba(255,255,255,0.16) inset, 0 38px 90px -28px rgba(0,0,0,0.6)",
      },
      borderColor: {
        specular: "rgba(255,255,255,0.1)",
      },
      backdropBlur: {
        xs: "2px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "grain-shift": {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "10%": { transform: "translate3d(-1%,-2%,0)" },
          "30%": { transform: "translate3d(2%,1%,0)" },
          "50%": { transform: "translate3d(-1%,2%,0)" },
          "70%": { transform: "translate3d(1%,-1%,0)" },
          "90%": { transform: "translate3d(-2%,1%,0)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        grain: "grain-shift 1.2s steps(6) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
