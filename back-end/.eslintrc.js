module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    'no-console': 'off',
    'no-multi-spaces': 'error',
    'block-spacing': 'error',
    'brace-style': 'error',
    'comma-dangle': 'error',
    'comma-spacing': 'error',
    'no-trailing-spaces': 'error',
    'no-whitespace-before-property': 'error',
    'quotes': ['error', 'single'],
    'semi': 'error',
    'semi-spacing': 'error',
    'arrow-spacing': 'error',
    'object-curly-spacing': ['error', 'always'],
    'no-duplicate-imports': 'error',
    'no-var': 'error',
    'space-before-blocks': ['error', 'always'],
    'space-infix-ops': 'error'
  }
};
