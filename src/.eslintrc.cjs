/* eslint-env node */
module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "react", "react-hooks"],
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ],
    settings: { react: { version: "detect" } },
    env: { browser: true, es2022: true, node: true },
    overrides: [
        {
            files: ["**/*.tsx", "**/*.ts"],
            rules: {
                "react/react-in-jsx-scope": "off"
            }
        }
    ]
};
