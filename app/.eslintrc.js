module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        //"plugin:@typescript-eslint/recommended",
        "plugin:@angular-eslint/recommended",
    ],
    "plugins": [
        "@angular-eslint",
        "eslint-plugin-import",
        "eslint-plugin-jsdoc",
        "@angular-eslint/eslint-plugin",
        "eslint-plugin-prefer-arrow",
        "@typescript-eslint",
        "@typescript-eslint/tslint"
    ],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "parserOptions": {
        "ecmaFeatures": {},
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "ignorePatterns": [
        "**/*.spec.ts",
        "**/*test.ts",
        "main.ts",
        "polyfills.ts"
    ],
    "rules": {
        // "@typescript-eslint/semi": "off",
        // "@typescript-eslint/prefer-nullish-coalescing": "off",
        // "@typescript-eslint/strict-boolean-expressions": "off",
        // "@typescript-eslint/consistent-type-imports": "off",
        // "@typescript-eslint/indent": "warn",
        // "padded-blocks": "warn",
        // "array-bracket-spacing": "warn",
        // "prefer-const": "error",
        // "space-in-parens": "warn",
        // "@typescript-eslint/space-before-function-paren": "warn",
        // "@typescript-eslint/no-extraneous-class": "warn",
        // "no-console": ["error", { "allow": ["warn", "error"] }]
        "@typescript-eslint/semi": ["error", "always"],
            "@typescript-eslint/prefer-nullish-coalescing": "off",
            "@typescript-eslint/strict-boolean-expressions": "off",
            "@typescript-eslint/consistent-type-imports": "off",
            "@typescript-eslint/indent": ["warn", 2],
            "linebreak-style": ["warn", "windows"],
            "quotes": ["warn", "single", { "allowTemplateLiterals": true }],
            "padded-blocks": ["warn", "never"],
            "array-bracket-spacing": "warn",
            "prefer-const": "error",
            "space-in-parens": "warn",
            "no-multiple-empty-lines": "warn",
            "@typescript-eslint/space-before-function-paren": ["warn", "never"],
            "@typescript-eslint/no-extraneous-class": "warn",
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/no-explicit-any": ["error", { "fixToUnknown": false, "ignoreRestArgs": false }],
            "@typescript-eslint/explicit-function-return-type": ["error", { "allowExpressions": true }],
            "no-console": ["error", { "allow": ["warn", "error"] }]
    }
}