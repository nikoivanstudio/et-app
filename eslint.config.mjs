import { FlatCompat } from '@eslint/eslintrc';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const serverActionsPlugin = {
  rules: {
    'require-async-use-server': {
      meta: {
        type: 'problem',
        docs: {
          description:
            'Require `async` for functions that contain `"use server"` directive as the first statement.'
        },
        fixable: 'code',
        schema: [],
        messages: {
          mustBeAsync:
            'Function with `"use server"` directive must be declared as `async`.'
        }
      },
      create(context) {
        const sourceCode = context.getSourceCode();

        function hasUseServerDirective(node) {
          if (!node.body || node.body.type !== 'BlockStatement') return false;
          const first = node.body.body?.[0];
          return (
            first &&
            first.type === 'ExpressionStatement' &&
            typeof first.directive === 'string' &&
            first.directive === 'use server'
          );
        }

        function reportAndFix(node) {
          if (node.async) return;
          if (!hasUseServerDirective(node)) return;

          context.report({
            node,
            messageId: 'mustBeAsync',
            fix(fixer) {
              if (
                node.type === 'FunctionDeclaration' ||
                node.type === 'FunctionExpression'
              ) {
                const functionToken = sourceCode.getFirstToken(
                  node,
                  t => t.value === 'function'
                );
                if (!functionToken) return null;
                return fixer.insertTextBefore(functionToken, 'async ');
              }

              if (node.type === 'ArrowFunctionExpression') {
                const firstToken = sourceCode.getFirstToken(node);
                if (!firstToken) return null;
                return fixer.insertTextBefore(firstToken, 'async ');
              }

              return null;
            }
          });
        }

        return {
          FunctionDeclaration: reportAndFix,
          FunctionExpression: reportAndFix,
          ArrowFunctionExpression: reportAndFix
        };
      }
    }
  }
};

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  ...compat.extends('prettier'),
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts'
    ],
    plugins: {
      'server-actions': serverActionsPlugin,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports
    },
    rules: {
      'server-actions/require-async-use-server': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^node:', '^@?\\w'],
            ['^@/app(?:/|$)'],
            ['^@/widgets(?:/|$)'],
            ['^@/features(?:/|$)'],
            ['^@/entities(?:/|$)'],
            ['^@/shared(?:/|$)'],
            ['^@/'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$']
          ]
        }
      ],
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'all',
          ignoreRestSiblings: false
        }
      ]
    }
  }
];

export default eslintConfig;
