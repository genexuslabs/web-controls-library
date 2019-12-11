module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  plugins: ["@typescript-eslint", "local"],
  extends: [
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    "plugin:@stencil/recommended" // Enables @stencil/eslint-plugin.
  ],
  parserOptions: {
    project: "./tsconfig.json"
  },
  rules: {
    "@typescript-eslint/no-use-before-define": ["error", { functions: false }],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { varsIgnorePattern: "^(h)$" }
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto"
      }
    ],
    "@stencil/strict-boolean-conditions": ["error", ["allow-string"]],
    "@stencil/strict-mutable": "off"
  },
  overrides: [
    {
      files: ["**/*.tsx"],
      rules: {
        "local/jsx-uses-my-pragma": "error", // These are needed to avoid getting a not used error with imports used in JSX
        "local/jsx-uses-vars": "error"
      }
    }
  ]
};
