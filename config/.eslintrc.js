const path = require("path");

const globalRules = {
  // Core ESLint
  "no-underscore-dangle": ["error", { allow: ["_id"] }],
  "no-debugger": "error",
  "prefer-const": "error",
  "no-var": "error",
  "object-shorthand": "error",
  "prefer-arrow-callback": "error",
  "prefer-template": "error",
  "template-curly-spacing": ["error", "never"],
  "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
  "eol-last": "error",
  "comma-dangle": ["error", "always-multiline"],
  semi: ["error", "always"],
  quotes: ["error", "double", { avoidEscape: true }],
  indent: ["error", 2, { SwitchCase: 1 }],

  // React
  "react/no-deprecated": "error",
  "react/react-in-jsx-scope": "off",
  "react/jsx-props-no-spreading": ["warn", { html: "enforce", custom: "ignore" }],
  "react/jsx-boolean-value": ["error", "never"],
  "react/jsx-curly-brace-presence": ["error", { props: "never", children: "never" }],
  "react/self-closing-comp": "error",
  "react/jsx-wrap-multilines": [
    "error",
    {
      declaration: "parens-new-line",
      assignment: "parens-new-line",
      return: "parens-new-line",
      arrow: "parens-new-line",
    },
  ],
  "react/function-component-definition": [
    "error",
    {
      namedComponents: "arrow-function",
      unnamedComponents: "arrow-function",
    },
  ],

  // React Hooks
  "react-hooks/exhaustive-deps": "error",

  // React Refresh
  "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

  // Imports
  "import/no-unresolved": "error",
  "import/order": [
    "error",
    {
      groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
      "newlines-between": "never",
      alphabetize: { order: "asc", caseInsensitive: true },
    },
  ],
  "import/no-default-export": "error",
  "import/prefer-default-export": "off",

  // Promise
  "promise/prefer-await-to-then": "off",
  "promise/prefer-await-to-callbacks": "off",
  "promise/always-return": "off",
  "promise/catch-or-return": ["error", { allowFinally: true }],

  // SonarJS
  "sonarjs/cognitive-complexity": ["warn", 20],
  "sonarjs/no-duplicate-string": ["warn", { threshold: 5 }],
  "sonarjs/prefer-immediate-return": "off",

  // Accessibility
  "jsx-a11y/no-autofocus": "off",
};

module.exports = {
  env: {
    browser: true,
    es2023: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
    "plugin:@tanstack/query/recommended",
    "plugin:promise/recommended",
    "plugin:sonarjs/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2023,
    sourceType: "module",
    projectService: true,
    tsconfigRootDir: path.join(__dirname, ".."),
  },
  plugins: [
    "react",
    "react-hooks",
    "jsx-a11y",
    "import",
    "react-refresh",
    "promise",
    "sonarjs",
    "@typescript-eslint",
  ],
  overrides: [
    {
      files: ["*.js", "*.jsx"],
      parser: "@babel/eslint-parser",
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
      extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:import/recommended",
        "plugin:@tanstack/query/recommended",
        "plugin:promise/recommended",
        "plugin:sonarjs/recommended",
        "prettier",
      ],
      rules: globalRules,
    },
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:import/recommended",
        "plugin:@tanstack/query/recommended",
        "plugin:promise/recommended",
        "plugin:sonarjs/recommended",
        "prettier",
      ],
      rules: {
        ...globalRules,

        // TypeScript
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "@typescript-eslint/no-deprecated": "error",
        "@typescript-eslint/no-floating-promises": [
          "error",
          {
            allowForKnownSafeCalls: [
              // navigate returns `void | Promise<void>`, which is impossible to handle cleanly.
              // but we don't use data router, so in our case, it's always void.
              { from: "package", name: "NavigateFunction", package: "react-router" },
            ],
          },
        ],
      },
    },
  ],
  rules: globalRules,
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
      node: {
        extensions: [".js", ".jsx", ".json", ".ts", ".tsx"],
      },
    },
    react: {
      version: "detect",
    },
  },
  globals: {
    fetch: "readonly",
    console: "readonly",
    document: "readonly",
    window: "readonly",
    CustomEvent: "readonly",
    ResizeObserver: "readonly",
  },
};
