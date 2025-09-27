module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off',
    'no-console': 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  env: {
    'react-native/react-native': true,
    es6: true,
    node: true,
  },
  ignorePatterns: [
    'node_modules/',
    'android/',
    'ios/',
    '*.config.js',
    '*.config.ts',
    'dist/',
    'build/',
  ],
};