const TS_CONFIG_JSON_PATH = './tsconfig.json';

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    tsconfigRootDir: __dirname,
    project: [TS_CONFIG_JSON_PATH],
  },
  plugins: ['@typescript-eslint', 'import', 'prettier', 'sort-exports'],
  ignorePatterns: ['.eslintrc.cjs', 'build', 'node_modules'],
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: [TS_CONFIG_JSON_PATH],
      },
    },
  },
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  env: {
    es6: true,
    node: true,
  },
  rules: {
    // Common rules
    '@typescript-eslint/no-misused-promises': 'off',
    'no-unused-vars': 'off', // It should be a temporary rule, avoid it in production

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
  overrides: [
    {
      files: ['tests/**/*', 'database/**/*'],
      rules: {
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
        '@typescript-eslint/require-await': 'off',
      },
    },
    {
      files: ['config/**/*'],
      rules: {
        '@typescript-eslint/no-empty-object-type': 'off',
      },
    },
    {
      files: ['app/middleware/**/*'],
      rules: {
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
      },
    },
  ],
};
