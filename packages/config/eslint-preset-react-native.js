const base = require("./eslint-preset");

const parserOptions = {
    parserOptions: {
        project: ["./tsconfig.json"],
        sourceType: "module",
        ecmaFeatures: {
            jsx: true,
        }
    },
    plugins: [
        "react",
        "react-native"
    ],
    rules: {
        "react-native/no-unused-styles": 2,
        "react-native/split-platform-components": 2,
        "react-native/no-inline-styles": 2,
        "react-native/no-color-literals": 2,
        "react-native/no-raw-text": 2,
        "react-native/no-single-element-style-arrays": 2,
    }
}

module.exports = Object.assign(base, parserOptions);