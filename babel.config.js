module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [
            ".ios.ts",
            ".android.ts",
            ".ts",
            ".ios.tsx",
            ".android.tsx",
            ".tsx",
            ".jsx",
            ".js",
            ".json"
          ],
          alias: {
            "@": "./src",
            "@api": "./src/api",
            "@assets": "./src/assets",
            "@components": "./src/components",
            "@constants": "./src/constants",
            "@contexts": "./src/contexts",
            "@hooks": "./src/hooks",
            "@models": "./src/models",
            "@navigation": "./src/navigation",
            "@pages": "./src/pages",
            "@theme": "./src/theme",
            "@utils": "./src/utils"
          }
        }
      ],
      [
        "module:react-native-dotenv",
        {
          "moduleName": "@env",
          "path": ".env"
        }
      ]
    ]
  };
};
