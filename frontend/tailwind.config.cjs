/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                sans: ["Inter", ...defaultTheme.fontFamily.sans]
            },
            colors: {
                pop: {
                    orange: {
                        light: "#FFAD00",
                        dark: "#FBB86C"
                    },
                    blue: {
                        light: "#63B1BC",
                        dark: "#6ACAD8"
                    },
                    green: {
                        light: "#82BF8C",
                        dark: "#90CFB0"
                    },
                    red: {
                        light: "#E56A54",
                        dark: "#EA9090"
                    },
                    yellow: {
                        light: "#FEDB40",
                        dark: "#F9D87A"
                    },
                    purple: {
                        light: "#CF7DFF",
                        dark: "#D58CFF"
                    },
                    pink: {
                        light: "#F93A83",
                        dark: "#FF9CDD"
                    },
                    indigo: {
                        light: "#3E88FF",
                        dark: "#95C4FC"
                    },
                    grey: {
                        warm: "#ADA29E",
                        light: "#9B8EAE",
                        dark: "#574F4A"
                    },
                    light_neutral_grey: {
                        100: "#EEE",
                        300: "#CCC",
                        500: "#AAA",
                        700: "#888",
                        900: "#666"
                    },
                    dark_neutral_grey: {
                        100: "#888",
                        300: "#666",
                        500: "#444",
                        700: "#222",
                        900: "#111"
                    },
                    light_ui: {
                        100: "#FCFCFC",
                        300: "#F6F6F6",
                        500: "#EDEDED",
                        700: "#E6E6E6",
                        900: "#DEDEDE"
                    },
                    dark_ui: {
                        100: "#474341",
                        300: "#403C3A",
                        500: "#393634",
                        700: "#33302F",
                        900: "#2B2928"
                    }
                }
            }
        }
    },
    plugins: []
};
