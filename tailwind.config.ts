import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

// TON brand blue (https://ton.org) used as the NextUI primary color.
const tonPrimary = {
  50: "#e6f6fd",
  100: "#cceefb",
  200: "#99ddf7",
  300: "#66cbf3",
  400: "#33baef",
  500: "#0098ea",
  600: "#007bbd",
  700: "#005c8d",
  800: "#003e5e",
  900: "#001f2f",
  DEFAULT: "#0098ea",
  foreground: "#ffffff",
};

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      themes: {
        light: { colors: { primary: tonPrimary } },
        dark: { colors: { primary: tonPrimary } },
      },
    }),
  ],
} satisfies Config;
