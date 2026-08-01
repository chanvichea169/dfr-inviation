/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Kantumruy Pro is a variable Khmer/Latin UI face (100–700), so weights
        // are real rather than synthetically bolded. Khmer OS Siemreab ships in
        // /public/fonts and covers the case where Google Fonts is unreachable.
        sans: [
          '"Kantumruy Pro"',
          '"Khmer OS Siemreab"',
          '"Noto Sans Khmer"',
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        siemreap: ['"Khmer OS Siemreab"', '"Kantumruy Pro"', "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },

      colors: {
        // Sapphire — official, calm, high-contrast on both themes.
        brand: {
          50: "#eef3ff",
          100: "#dfe8ff",
          200: "#c5d4ff",
          300: "#a1b6fd",
          400: "#7b92f9",
          500: "#5a6ff2",
          600: "#3f4ee4",
          700: "#333dc9",
          800: "#2b34a2",
          900: "#28327f",
          950: "#1a1f4e",
        },
        // Muted gold for seals, accents and formal flourishes.
        gold: {
          50: "#fdf9ed",
          100: "#f9efcc",
          200: "#f2dc96",
          300: "#eac35b",
          400: "#e3ab32",
          500: "#d18f1c",
          600: "#b46e15",
          700: "#904f16",
          800: "#773f19",
          900: "#653418",
        },

        // Semantic surfaces — the single source of truth for light/dark.
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          raised: "rgb(var(--surface-raised) / <alpha-value>)",
          sunken: "rgb(var(--surface-sunken) / <alpha-value>)",
          inverse: "rgb(var(--surface-inverse) / <alpha-value>)",
        },
        line: {
          DEFAULT: "rgb(var(--line) / <alpha-value>)",
          strong: "rgb(var(--line-strong) / <alpha-value>)",
        },
        ink: {
          DEFAULT: "rgb(var(--ink) / <alpha-value>)",
          muted: "rgb(var(--ink-muted) / <alpha-value>)",
          faint: "rgb(var(--ink-faint) / <alpha-value>)",
          inverse: "rgb(var(--ink-inverse) / <alpha-value>)",
        },
      },

      borderRadius: {
        "4xl": "1.75rem",
        "5xl": "2.25rem",
      },

      boxShadow: {
        soft: "0 1px 2px rgb(16 24 40 / 0.04), 0 8px 24px -14px rgb(16 24 40 / 0.14)",
        card: "0 1px 2px rgb(16 24 40 / 0.04), 0 20px 48px -24px rgb(16 24 40 / 0.22)",
        lift: "0 2px 4px rgb(16 24 40 / 0.05), 0 32px 64px -28px rgb(16 24 40 / 0.30)",
        glow: "0 10px 30px -12px rgb(63 78 228 / 0.55)",
        "glow-lg": "0 18px 48px -16px rgb(63 78 228 / 0.55)",
        hairline: "inset 0 0 0 1px rgb(255 255 255 / 0.06)",
        "top-sheen": "inset 0 1px 0 0 rgb(255 255 255 / 0.14)",
      },

      transitionTimingFunction: {
        spring: "cubic-bezier(0.22, 1, 0.36, 1)",
        snap: "cubic-bezier(0.32, 0.72, 0, 1)",
      },

      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        drift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "33%": { transform: "translate3d(3%, -4%, 0) scale(1.06)" },
          "66%": { transform: "translate3d(-3%, 3%, 0) scale(0.97)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "ring-pulse": {
          "0%": { boxShadow: "0 0 0 0 rgb(63 78 228 / 0.35)" },
          "70%": { boxShadow: "0 0 0 12px rgb(63 78 228 / 0)" },
          "100%": { boxShadow: "0 0 0 0 rgb(63 78 228 / 0)" },
        },
        "sweep-in": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
      },

      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "scale-in": "scale-in 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
        drift: "drift 22s ease-in-out infinite",
        "drift-slow": "drift 34s ease-in-out infinite",
        shimmer: "shimmer 1.8s infinite",
        "ring-pulse": "ring-pulse 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite",
      },
    },
  },
  plugins: [],
};
