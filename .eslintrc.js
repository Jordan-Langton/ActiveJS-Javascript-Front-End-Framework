module.exports = {
  "env": {
    "browser": true,
    "jquery": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  "globals": {
      "Atomics": "readonly",
      "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
      "ecmaVersion": 2018,
      "sourceType": "module"
  },
  "rules": {
    "accessor-pairs": 2,
    "no-debugger": 2,
    "arrow-spacing": 2,
    "block-scoped-var": 2,
    "block-spacing": 2,
    "camelcase": 2,
    "callback-return": 2,
    // "capitalized-comments": 2,
    // "class-methods-use-this": 2,
    "dot-notation": 2,
    // "indent": 2,
    // "indent-legacy": 2,
    "no-alert": 2,
    "no-console": 2,
    "no-implied-eval": 2,
    "no-implicit-globals": 2,
    "no-eval": 2,
    "no-duplicate-imports": 2,
    "no-undef-init": 2,
    "no-unused-vars": 2,
    "no-useless-concat": 2,
    // "no-useless-constructor": 2,
    "no-var": 2,
    "semi": 2
  }
};