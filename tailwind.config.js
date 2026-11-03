/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    logs: false,
    themes: [
      {
        studiolight: {
          primary: "#0b7a75",
          "primary-content": "#ffffff",
          secondary: "#b8326f",
          "secondary-content": "#ffffff",
          accent: "#d99a1c",
          "accent-content": "#1b1405",
          neutral: "#1a2430",
          "neutral-content": "#eef2f5",
          "base-100": "#ffffff",
          "base-200": "#f0f3f6",
          "base-300": "#dce2e8",
          "base-content": "#17212b",
          info: "#2b7bb9",
          success: "#1f8a5b",
          warning: "#c98a12",
          error: "#c8413b",
        },
      },
      {
        studiodark: {
          primary: "#39c2bb",
          "primary-content": "#04201f",
          secondary: "#e2679f",
          "secondary-content": "#2a0717",
          accent: "#f0b84a",
          "accent-content": "#241a05",
          neutral: "#0d1319",
          "neutral-content": "#e6ecf0",
          "base-100": "#161e27",
          "base-200": "#111820",
          "base-300": "#26323f",
          "base-content": "#e6ecf0",
          info: "#5aa9e6",
          success: "#43c28b",
          warning: "#e8b13c",
          error: "#ef6f68",
        },
      },
    ],
    darkTheme: "studiodark",
  },
};
