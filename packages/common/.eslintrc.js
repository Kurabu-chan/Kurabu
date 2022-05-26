const base = require("@kurabu/config/eslint-preset");

const parserOptions = {
    parserOptions: {
        project: ["./tsconfig.json"],
        sourceType: "module",
        tsconfigRootDir: __dirname,
    },
}

module.exports = Object.assign(base, parserOptions);