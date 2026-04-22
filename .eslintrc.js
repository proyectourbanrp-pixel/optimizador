module.exports = {
    "env": {
        "node": true,
        "es2021": true,
        "browser": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": "latest"
    },
    "rules": {
        "no-console": "off",
        "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
        "prefer-const": "error",
        "no-var": "error",
        "semi": ["error", "always"],
        "quotes": ["error", "single"],
        "indent": ["error", 4],
        "comma-dangle": ["error", "never"],
        "object-curly-spacing": ["error", "always"],
        "array-bracket-spacing": ["error", "never"]
    }
};
