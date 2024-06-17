/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "deepblue" : "#5bbf8b",
        "lightblue" : "#66B3E6",
        "green" : "#4CAF50",
        "orange" : "#FF9800",
        "gray" : "#CCCCCC",
        "yellow" : "#FFEB3B",
        "red" : "#FF5252",
        "white" : "#FFFFFF",
        "black" : "#000000"
      }
    },
  },
  plugins: [require("daisyui")],
}

