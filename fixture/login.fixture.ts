import { type Page } from '@playwright/test';
import { test as base, expect } from './signup.fixture';

export const test = base.extend<{ loggedInPage: Page }>({
    loggedInPage: async ({ page, homePage, header, loginPage, registeredUser }, use) => {
        await base.step('Log in with the account created for this test', async () => {
            await homePage.navigateToHomePage();
            await expect(page).toHaveTitle('Automation Exercise');
            await header.clickSignupLogin();
            await expect(loginPage.heading).toBeVisible();
            await loginPage.fillLoginForm(registeredUser.email, registeredUser.password);
            await loginPage.clickLoginButton();
            await expect(header.loggedInAs(registeredUser.name)).toBeVisible();
        });
        await use(page);
    },
});

export { expect } from '@playwright/test';
