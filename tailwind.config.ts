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
          100: "#f4f1eb",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
        },
        surface: {
          950: "#08090C",
          900: "#0F131D",
          850: "#121722",
          800: "#151b28",
          700: "#1a2230",
          600: "#202a3a",
        },
        glass: {
          DEFAULT: "rgba(15, 19, 29, 0.72)",
          strong: "rgba(15, 19, 29, 0.92)",
          border: "rgba(255, 255, 255, 0.08)",
          "border-top": "rgba(255, 255, 255, 0.18)",
          "border-hover": "rgba(224, 109, 83, 0.62)",
        },
        accent: {
          DEFAULT: "#E06D53",
          soft: "#f2a18d",
          strong: "#E06D53",
        },
        clay: "#E06D53",
        terracotta: "#F59E0B",
        slate: "#38BDF8",
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
