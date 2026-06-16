/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/index.tsx",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // For components
        background: "#F6F5FF",
        primaryred: "#FF000E",
        primaryblue: "#0066FF",
        dark: "#000000",
        dark: "#000000",
        darkvariant: "#7B7B7B",

        // For texts
        headingText: "",
        subHeadingText: "",
        descriptiveText: "#8F8F8F"
      },
      fontFamily: {
        Poppinsbold: ["Poppinsbold"],
        Poppinsblack: ["Poppinsblack"],
        Poppinslight: ["Poppinslight"],
        Poppinssemibold: ["Poppinssemibold"],
        Poppinsmedium: ["Poppinsmedium"],
        Poppinsregular: ["Poppinsregular"],
      },
      fontSize: {
        screenname: "32px",
        heading: "18px",
        subheading: "16px",
        description: "14px",
      },
      padding: {
        screen: "20px",
      },
      borderRadius: {
        button: "20"
      },
      spacing: {
        extrasmall: "4px",
        small: "8px",
        mid: "16px",
        large: "24px",
        extralarge: "32px",
      },
    },
  },
  plugins: [],
};
