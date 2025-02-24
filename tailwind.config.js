/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        beige: {
          500: "var(--color-beige-500)",
          100: "var(--color-beige-100)",
        },
        grey: {
          900: "var(--color-grey-900)",
          500: "var(--color-grey-500)",
          300: "var(--color-grey-300)",
          100: "var(--color-grey-100)",
        },
        secondary: {
          green: "var(--color-secondary-green)",
          yellow: "var(--color-secondary-yellow)",
          cyan: "var(--color-secondary-cyan)",
          navy: "var(--color-secondary-navy)",
          red: "var(--color-secondary-red)",
          lightRed: "var(--color-secondary-lightRed)",
          purple: "var(--color-secondary-purple)",
        },
        other: {
          purple: "var(--color-other-purple)",
          turquoise: "var(--color-other-turquoise)",
          brown: "var(--color-other-brown)",
          magenta: "var(--color-other-magenta)",
          blue: "var(--color-other-blue)",
          grey: "var(--color-other-grey)",
          green: "var(--color-other-green)",
          gold: "var(--color-other-gold)",
          orange: "var(--color-other-orange)",
        },
      },
    },
  },
  plugins: [],
};
