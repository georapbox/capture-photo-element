import globals from 'globals';
import pluginJs from '@eslint/js';
import { configs as pluginWc } from 'eslint-plugin-wc';

export default [
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.chai,
        ...globals.mocha
      }
    }
  },
  pluginJs.configs.recommended,
  pluginWc['flat/recommended'],
  pluginWc['flat/best-practice'],
  {
    rules: {
      'no-use-before-define': [
        'error',
        {
          functions: false
        }
      ],
      curly: ['warn'],
      eqeqeq: [
        'error',
        'always',
        {
          null: 'ignore'
        }
      ],
      'wc/no-child-traversal-in-connectedcallback': 'off',
      'wc/no-child-traversal-in-attributechangedcallback': 'off'
    }
  },
  {
    ignores: ['dist', 'docs/lib', 'coverage']
  }
];
