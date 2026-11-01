import { HomePage } from '../pages/home_page';
import { test, expect } from '../fixture/test.fixture';

const nameSignUp = 'userTest111';
const emailSignUp = 'userTest111@gmail.com';

test('Register User', async ({ page, homePage }) => {
    //3. Verify that home page is visible successfully
    await test.step('Verify home page', async () => {
        await expect(page).toHaveTitle('Automation Exercise');
    })

    //4. Click on 'Signup / Login' button
    await test.step('Click on Signup / Login button', async () => {
        await homePage.clickSignupLogin();
    })

    //5. Verify 'New User Signup!' is visible
    await test.step('Verify New User Signup! is visible', async () => {
        await expect(page.getByText('New User Signup!')).toBeVisible();
    })

    //6. Enter name and email address
    await test.step('Enter name and email address', async () => {
        await homePage.fillSignupForm(nameSignUp, emailSignUp);
    })

    //7. Click 'Signup' button
    await test.step('Click Signup button', async () => {
        await homePage.clickSignupButton();
    })

    // 8. Verify that 'ENTER ACCOUNT INFORMATION' is visible
    await test.step('Verify account information', async () => {
        await expect(page.getByText('ENTER ACCOUNT INFORMATION')).toBeVisible();
    })
})


