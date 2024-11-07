/** @type {import('tailwindcss').Config} */

import colors from "tailwindcss/colors";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      pretendard: ["Pretendard"],
    },
    colors: {
      ...colors,
      divider: colors.neutral["200"],
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")],
};
