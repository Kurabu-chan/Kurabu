module.exports = {
  require: [
    "ts-node/register/transpile-only",
    "scripts/mocha/register"
  ],
  recursive: true,
  reporter: "dot",
  spec: [
    "src/**/*.spec.ts"
  ]
};
