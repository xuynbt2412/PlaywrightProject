import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default defineConfig(
    { ignores: ['node_modules/**', 'test-results/**', 'playwright-report/**', 'blob-report/**'] },
    {
        files: ['**/*.ts'],
        extends: [tseslint.configs.recommendedTypeChecked],
        languageOptions: {
            parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
        },
        rules: {
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-misused-promises': 'error',
        },
    },
    {
        ...playwright.configs['flat/recommended'],
        files: ['tests/**/*.ts'],
        rules: {
            ...playwright.configs['flat/recommended'].rules,
            'playwright/missing-playwright-await': 'error',
            'playwright/no-wait-for-timeout': 'error',
            'playwright/no-force-option': 'error',
        },
    },
);
