module.exports = {
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
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
