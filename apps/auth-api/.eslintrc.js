const base = require("@kurabu/config/eslint-preset");

const parserOptions = {
    parserOptions: {
        project: ["./tsconfig.json"],
        tsconfigRootDir: __dirname,
        sourceType: "module",
    },
}

module.exports = Object.assign(base, parserOptions);