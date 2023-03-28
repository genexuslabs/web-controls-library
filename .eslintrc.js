module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  plugins: ["@typescript-eslint", "local"],
  extends: [
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    "plugin:@stencil-community/recommended", // Enables @stencil-community/eslint-plugin.
    "plugin:prettier/recommended" // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    project: "./tsconfig.json",
    sourceType: "module" // Allows for the use of imports
  },
  rules: {
    // - - - - - - - - - - - -
    // ESLint
    // - - - - - - - - - - - -
    camelcase: "warn", // Enforce camelcase naming convention
    curly: "error", // Enforce consistent brace style for all control statements
    eqeqeq: ["error", "always", { null: "ignore" }], // Require the use of === and !==   "ignore" -------> Do not apply this rule to null
    "max-depth": ["warn", 3], // Enforce a maximum depth that blocks can be nested. Many developers consider code difficult to read if blocks are nested beyond a certain depth
    "no-console": "warn", // Warning when using console.log, console.warn or console.error
    "no-debugger": "error", // Error when using debugger;
    "no-duplicate-case": "error", // This rule disallows duplicate test expressions in case clauses of switch statements
    "no-empty": "error", // Disallow empty block statements
    "no-sequences": "error", // Disallow comma operators
    "no-undef": "off", // Allows defining undefined variables
    "no-unneeded-ternary": "error", // Disallow ternary operators when simpler alternatives exist
    "spaced-comment": ["error", "always", { exceptions: ["-", "+", "/"] }], // Enforce consistent spacing after the // or /* in a comment

    // - - - - - - - - - - - -
    // TypeScript ESLint
    // - - - - - - - - - - - -
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-use-before-define": ["error", { functions: false }],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { varsIgnorePattern: "^(h)$" }
    ],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "off",

    // - - - - - - - - - - - -
    // Prettier
    // - - - - - - - - - - - -
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto"
      }
    ],

    // - - - - - - - - - - - -
    // StencilJS
    // - - - - - - - - - - - -
    "@stencil-community/async-methods": "error", // This rule catches Stencil public methods that are not async
    "@stencil-community/decorators-context": "error", // This rule catches Stencil decorators in bad locations
    "@stencil-community/decorators-style": [
      "error",
      {
        prop: "inline",
        state: "inline",
        element: "inline",
        method: "multiline",
        watch: "multiline",
        listen: "multiline"
      }
    ],
    "@stencil-community/element-type": "error", // This rule catches Stencil Element decorator have the correct type
    "@stencil-community/methods-must-be-public": "error", // This rule catches Stencil Methods marked as private or protected
    "@stencil-community/no-unused-watch": "error", // This rule catches Stencil Watchs with non existing Props or States
    "@stencil-community/own-methods-must-be-private": "error", // This rule catches own class methods marked as public
    "@stencil-community/own-props-must-be-private": "error", // This rule catches own class properties marked as public
    "@stencil-community/prefer-vdom-listener": "error", // This rule catches Stencil Listen with vdom events
    "@stencil-community/props-must-be-public": "error", // This rule catches Stencil Props marked as private or protected
    "@stencil-community/props-must-be-readonly": "error", // This rule catches Stencil Props marked as non readonly, excluding mutable ones
    "@stencil-community/required-jsdoc": "error", // This rule catches Stencil Props, Methods and Events to define jsdoc
    "@stencil-community/required-prefix": ["error", ["gx-"]], // Ensures that a Component's tag use the "gx-" prefix.
    "@stencil-community/single-export": "error", // This rule catches modules that expose more than just the Stencil Component itself
    "@stencil-community/strict-boolean-conditions": "off",

    // WA to fix false positive errors
    "@stencil-community/strict-mutable": "warn" // This rule catches Stencil Prop marked as mutable but not changing value in code
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
