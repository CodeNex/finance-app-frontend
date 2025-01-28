/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          500: "#98908B",
          100: "#F8F4F0"
        },
        grey: {
          900: "#201F24",
          500: "#696868",
          300: "#B3B3B3",
          100: "#F2F2F2"
        },
        secondary: {
          green: "#277C78",
          yellow: "#F2CDAC",
          cyan: "#82C9D7",
          navy: "#626070",
          red: "#C94736",
          purple: "#826CB0"
        },
        other: {
          purple: "#AF81BA",
          turquoise: "#597C7C",
          brown: "#93674F",
          magenta: "#934F6F",
          blue: "#3F82B2",
          grey: "#97A0AC",
          green: "#7F9161",
          gold: "#CAB361",
          orange: "#BE6C49"
        },
      }
    },
  },
  plugins: [],
}