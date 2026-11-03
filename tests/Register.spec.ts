import { test, expect } from '../fixture/signup.fixture';

// Exercise both radio options to prevent the previous always-select-Mrs regression.
for (const title of ['Mr', 'Mrs'] as const) {
    test(
        `Register User (${title})`,
        { tag: '@e2e' },
        async ({ page, homePage, header, registerPage, userData }) => {
            const user = { ...userData, title };

            await test.step('Open signup form', async () => {
                await homePage.navigateToHomePage();
                await expect(page).toHaveTitle('Automation Exercise');
                await header.clickSignupLogin();
                await expect(registerPage.signupHeading).toBeVisible();
            });

            await test.step('Submit a new name and email', async () => {
                await registerPage.fillSignupForm(user.name, user.email);
                await registerPage.clickSignupButton();
                await expect(registerPage.accountInformationHeading).toBeVisible();
                await expect(registerPage.emailInput).toHaveValue(user.email);
                await expect(registerPage.emailInput).toBeDisabled();
            });

            await test.step('Fill account details and preferences', async () => {
                await registerPage.fillDetailInformation(user);
                await expect(registerPage.titleOption(title)).toBeChecked();
                await registerPage.selectNewsletter();
                await registerPage.selectSpecialOffers();
            });

            await test.step('Fill address and create account', async () => {
                await registerPage.fillAddressInformation(user.address);
                await registerPage.clickCreateAccountButton();
                await expect(registerPage.accountCreatedHeading).toBeVisible();
            });

            await test.step('Continue and verify the registered user', async () => {
                await registerPage.clickContinueButton();
                await expect(header.loggedInAs(user.name)).toBeVisible();
            });

            await test.step('Delete account and verify confirmation', async () => {
                await header.clickDeleteAccount();
                await expect(registerPage.accountDeletedHeading).toBeVisible();
                await registerPage.clickContinueButton();
                await expect(header.signupLoginLink).toBeVisible();
            });
        },
    );
}

test(
    'Register User with existing email',
    { tag: '@e2e' },
    async ({ page, homePage, header, registerPage, registeredUser }) => {
        await test.step('Open signup form', async () => {
            await homePage.navigateToHomePage();
            await expect(page).toHaveTitle('Automation Exercise');
            await header.clickSignupLogin();
            await expect(registerPage.signupHeading).toBeVisible();
        });

        await test.step('Reject the email already registered by the fixture', async () => {
            await registerPage.fillSignupForm(registeredUser.name, registeredUser.email);
            await registerPage.clickSignupButton();
            await expect(registerPage.existingEmailError).toBeVisible();
            await expect(registerPage.accountInformationHeading).toBeHidden();
        });
    },
);
