import { test as base } from './test.fixture';
import { createUserData, type UserData } from '../data/user.factory';
import { AccountApi } from '../services/account.api';

type AccountFixtures = {
    accountApi: AccountApi;
    userData: UserData;
    registeredUser: UserData;
};

export const test = base.extend<AccountFixtures>({
    accountApi: async ({ request }, use) => {
        await use(new AccountApi(request));
    },

    userData: [
        async ({ accountApi }, use, testInfo) => {
            // Fresh data, not yet registered. Owns cleanup for both UI and API registration.
            const user = createUserData();
            try {
                await use(user);
            } finally {
                try {
                    await accountApi.delete(user);
                } catch (error) {
                    // Preserve the original setup/test failure and attach cleanup diagnostics.
                    await testInfo.attach('account-cleanup-error', {
                        body: error instanceof Error ? error.message : String(error),
                        contentType: 'text/plain',
                    });
                    if (
                        testInfo.status === testInfo.expectedStatus &&
                        testInfo.errors.length === 0
                    ) {
                        throw error;
                    }
                }
            }
        },
        { timeout: 30_000 },
    ],

    registeredUser: async ({ userData, accountApi }, use) => {
        // API creates the account without authenticating the test's browser context.
        await base.step('Create a unique account through API', async () => {
            await accountApi.create(userData);
        });
        await use(userData);
    },
});

export { expect } from '@playwright/test';
