module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: [
    "react-refresh",
    "react",
    "@typescript-eslint",
    "prettier",
    "import",
    'sort-exports'
  ],
  settings: {
    "react": {
      "version": "detect",
    },
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
      },
    },
  },
  rules: {
    // Common rules
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/react-in-jsx-scope": 0,
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react-hooks/exhaustive-deps": "off",
    "react/prop-types": "off",
    // Prettier rules
    'prettier/prettier': ['error', require('./.prettierrc.cjs')],

    // Order rules
    'import/order': [
      'warn',
      {
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'sort-exports/sort-exports': [
      'warn',
      {
        sortDir: 'asc',
        ignoreCase: true,
      },
    ],
  },
}
