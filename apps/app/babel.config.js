module.exports = function(api) {
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
                        "#config": "./src/config",
                        "#data": "./src/dataSources",
                        "#actions": "./src/actions",
                        "#decorators": "./src/decorators",
                        "#errors": "./src/errors",
                    },
                },
            ],
            'react-native-reanimated/plugin'
        ],
    };
};
