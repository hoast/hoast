module.exports = {
  env: {
    es6: true,
  },
  extends: [
    'standard',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: [
    'eslint-plugin-import',
    'eslint-plugin-node',
    'eslint-plugin-promise',
    'jsdoc',
  ],
  rules: {
    'comma-dangle': [
      'warn',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
      },
    ],
    'default-case-last': 0,
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'no-case-declarations': 0,
    'no-cond-assign': 0,
    'no-fallthrough': 0,
    'one-var': 0,
    quotes: [
      'error',
      'single',
    ],
    semi: [
      'error',
      'never',
    ],
    'space-before-function-paren': [
      0,
      'always',
    ],
  },
}
