const base = require("@kurabu/config/eslint-preset");

const parserOptions = {
    parserOptions: {
        project: ["./tsconfig.json", "./tsconfig.tests.json"],
        sourceType: "module",
        tsconfigRootDir: __dirname,
    },
}

module.exports = Object.assign(base, parserOptions);