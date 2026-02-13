import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import unusedImports from 'eslint-plugin-unused-imports';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

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
          // Директивы возможны только при блочном теле: { "use server"; ... }
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
              // FunctionDeclaration / FunctionExpression: вставляем async перед `function`
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

              // ArrowFunctionExpression: вставляем async перед первым токеном стрелочной функции
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
      'unused-imports': unusedImports
    },
    rules: {
      'server-actions/require-async-use-server': 'error',
      'unused-imports/no-unused-imports': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ]
    }
  }
];

export default eslintConfig;
