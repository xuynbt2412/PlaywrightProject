import { test, expect } from '../fixture/login.fixture';

test('Logout User', { tag: '@e2e' }, async ({ loggedInPage, header, loginPage }) => {
    await test.step('Click Logout', async () => {
        await header.clickLogout();
    });

    await test.step('Verify the user is logged out and back on the login page', async () => {
        await expect(loggedInPage).toHaveURL('/login');
        await expect(loginPage.heading).toBeVisible();
        await expect(header.loggedInLabel).toBeHidden();
        await expect(header.logoutLink).toBeHidden();
        await expect(header.signupLoginLink).toBeVisible();
    });
});
