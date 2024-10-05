module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh','prettier'],
  rules: {
    "indent": ["error", 2],
    "linebreak-style": [0, "unix"],
    "quotes": ["error", "single"],
    "semi": ["error", "never"],
    "prettier/prettier": "error",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": 0,
    "import/no-unresolved": [2, { "caseSensitive": false }],
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "import/order": [
      2,
      {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always"
      }
    ],
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ]
  },
}
