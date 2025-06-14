import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import globals from 'globals'
import eslintComments from 'eslint-plugin-eslint-comments'
import unicorn from 'eslint-plugin-unicorn'
import sonarjs from 'eslint-plugin-sonarjs'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintPluginJest from 'eslint-plugin-jest' // <-- ADD THIS

export default defineConfig([
  globalIgnores(['out/', 'coverage/', 'out/scripts/prettify/prettify.js']),
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      js,
      'eslint-comments': eslintComments,
      unicorn,
      sonarjs,
      jest: eslintPluginJest, // <-- USE THE IMPORTED PLUGIN
    },
    rules: {
      ...js.configs.recommended.rules,
      ...eslintComments.configs.recommended.rules,
      ...unicorn.configs.recommended.rules,
      ...sonarjs.configs.recommended.rules,
      ...eslintPluginJest.configs.recommended.rules, // <-- USE THE IMPORTED PLUGIN
      'sonarjs/todo-tag': 'off',

      // Match Prettier config:
      semi: ['error', 'never'],
      quotes: ['warn', 'single'],

      'unicorn/string-content': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'warn',
    },
  },
])
