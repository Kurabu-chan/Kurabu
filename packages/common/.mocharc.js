module.exports = {
    require: [
        "ts-node/register/transpile-only",
        "scripts/mocha/register"
    ],
    recursive: true,
    reporter: "dot",
    spec: [
        "tests/**/*.spec.ts"
    ],
    files: [
        "tests/**/*.spec.ts"
    ]
};