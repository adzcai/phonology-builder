module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: ['airbnb-typescript'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
    'no-nested-ternary': 'off',
    'consistent-return': 'off',
    'no-plusplus': 'off',
    'no-continue': 'off',
    'jsx-a11y/label-has-associated-control': [
      'error',
      { required: { some: ['nesting', 'id'] } },
    ],
  },
};
