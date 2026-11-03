import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { defineConfig, devices } from '@playwright/test';

if (existsSync('.env')) loadEnvFile('.env');

const baseURL = process.env.BASE_URL ?? 'https://automationexercise.com';
const parsedURL = new URL(baseURL);
if (!['http:', 'https:'].includes(parsedURL.protocol)) {
    throw new Error('BASE_URL must be an HTTP or HTTPS URL');
}

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 2 : undefined,
    timeout: 30_000,
    reporter: [
        ['list'],
        ['html', { open: 'never' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
    ],
    use: {
        baseURL,
        testIdAttribute: 'data-qa',
        headless: true,
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        navigationTimeout: 20_000,
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
