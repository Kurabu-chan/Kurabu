module.exports = function (api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            [
                "module-resolver",
                {
                    alias: {
                        "#api": "./src/APIManager",
                        "#routes": "./src/routes",
                        "#comps": "./src/components",
                        "#helpers": "./src/helpers",
                        "#config": "./src/config"
                    },
                },
            ],
        ],
    };
};
