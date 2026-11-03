import { test, expect } from '../fixture/signup.fixture';
import { createUserData } from '../data/user.factory';

test(
    'Login User with correct email and password',
    { tag: '@e2e' },
    async ({ page, homePage, header, loginPage, registerPage, registeredUser }) => {
        await test.step('Open home page and login form', async () => {
            await homePage.navigateToHomePage();
            await expect(page).toHaveTitle('Automation Exercise');
            await expect(header.signupLoginLink).toBeVisible();
            await header.clickSignupLogin();
            await expect(loginPage.heading).toBeVisible();
        });

        await test.step('Log in with the registered account', async () => {
            await loginPage.fillLoginForm(registeredUser.email, registeredUser.password);
            await loginPage.clickLoginButton();
            await expect(header.loggedInAs(registeredUser.name)).toBeVisible();
        });

        // Retain the delete-account steps required by Automation Exercise Test Case 2.
        await test.step('Delete account and verify confirmation', async () => {
            await header.clickDeleteAccount();
            await expect(registerPage.accountDeletedHeading).toBeVisible();
        });
    },
);

test(
    'Login User with incorrect email and password',
    { tag: '@e2e' },
    async ({ page, homePage, header, loginPage }) => {
        // A new UUID avoids depending on a public site's fixed, potentially existing account.
        const invalidUser = createUserData();

        await test.step('Open login form', async () => {
            await homePage.navigateToHomePage();
            await expect(page).toHaveTitle('Automation Exercise');
            await header.clickSignupLogin();
            await expect(loginPage.heading).toBeVisible();
        });

        await test.step('Reject credentials for an unregistered user', async () => {
            await loginPage.fillLoginForm(invalidUser.email, invalidUser.password);
            await loginPage.clickLoginButton();
            await expect(loginPage.errorMessage).toBeVisible();
            await expect(header.loggedInLabel).toBeHidden();
        });
    },
);
