const base = require("@kurabu/config/eslint-preset-react-native");

const parserOptions = {
    parserOptions: {
        project: ["./tsconfig.json"],
        sourceType: "module",
        ecmaVersion: 2015
    },
}

module.exports = Object.assign(base, parserOptions);