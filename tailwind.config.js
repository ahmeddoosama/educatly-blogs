/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem !important',
    },
    opacity: {
      "0-pct": "0%",
      "5-pct": "5%",
      "6-pct": "6%",
      "10-pct": "10%",
      "15-pct": "15%",
      "16-pct": "16%",
      "20-pct": "20%",
      "25-pct": "25%",
      "30-pct": "30%",
      "35-pct": "35%",
      "40-pct": "40%",
      "45-pct": "45%",
      "50-pct": "50%",
      "55-pct": "55%",
      "60-pct": "60%",
      "65-pct": "65%",
      "70-pct": "70%",
      "75-pct": "75%",
      "80-pct": "80%",
      "85-pct": "85%",
      "90-pct": "90%",
      "95-pct": "95%",
      "100-pct": "100%"
    },
    colors: {
      ...colors,
    },
    extend: {
      colors: {
        primary: '#6941C6',
        secondary: '#42307D',
        cardinal: '#C1272D',
        mangoOrange: '#F7863F',
        porcelain: '#EDF1F7',
        lavenderMist: '#e4e9f2',
        mistBlue: "#667085",
        davyGrey: '#54585C',
        ebonyClay: '#101828',
        santaGray: '#99a5af',
        romance: "#F9F5FF"
      },

      boxShadow: {
        'lg': '0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814'
      },
    },
  },
  plugins: [],
}
