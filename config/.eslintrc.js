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
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2023,
    sourceType: "module",
    requireConfigFile: false,
    babelOptions: {
      presets: ["@babel/preset-react"],
    },
  },
  plugins: ["react", "react-hooks", "jsx-a11y", "import", "react-refresh", "promise", "sonarjs"],
  rules: {
    // Core ESLint
    "no-underscore-dangle": ["error", { allow: ["_id"] }],
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
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
    "react/prop-types": "error",
    "react/no-deprecated": "error",
    "react/jsx-uses-react": "off",
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
    "promise/catch-or-return": "error",

    // SonarJS
    "sonarjs/cognitive-complexity": ["warn", 20],
    "sonarjs/no-duplicate-string": ["warn", { threshold: 5 }],
    "sonarjs/prefer-immediate-return": "off",

    // Accessibility
    "jsx-a11y/no-autofocus": "off",
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".json"],
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
