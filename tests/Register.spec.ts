import { HomePage } from '../pages/home_page';
import { test, expect } from '../fixture/test.fixture';

const nameSignUp = 'userTest111';
const emailSignUp = 'userTest111@gmail.com';
const password = '123456';
const day = '1';
const month = 'January';
const year = '1990';

const firstName = 'User';
const lastName = 'Test';
const company = 'Company';
const address1 = 'Address1';
const address2 = 'Address2';
const country = 'Canada';
const state = 'State';
const city = 'City';
const zipcode = '12345';
const mobileNumber = '1234567890';

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

    // 9. Fill details: Title, Name, Email, Password, Date of birth
    await test.step('Fill details', async () => {
        await homePage.fillDetailInformation('Mrs', nameSignUp, emailSignUp, password, day, month, year);
    })

    // 10. Select checkbox 'Sign up for our newsletter!'
    await test.step('Select checkbox newsletter', async () => {
        await homePage.selectNewsletter();
    })

    // 11. Select checkbox 'Receive special offers from our partners!'
    await test.step('Select checkbox special offers', async () => {
        await homePage.selectSpecialOffers();
    })

    // 12. Fill details: First name, Last name, Company, Address, Address2, Country, State, City, Zipcode, Mobile Number
    await test.step('Fill address information', async () => {
        await homePage.fillAddressInformation(firstName, lastName, company, address1, address2, country, state, city, zipcode, mobileNumber);
    })

    // 13. Click 'Create Account button'
    await test.step('Click Create Account button', async () => {
        await homePage.clickCreateAccountButton();
    })

    // 14. Verify that 'ACCOUNT CREATED!' is visible
    await test.step('Verify account created', async () => {
        await expect(page.getByText('ACCOUNT CREATED!')).toBeVisible();
    })

    // 15. Click 'Continue' button
    await test.step('Click Continue button', async () => {
        await homePage.clickContinueButton();
    })

    // 16. Verify that 'Logged in as username' is visible
    await test.step('Verify logged in as username', async () => {
        await expect(page.getByText(`Logged in as ${nameSignUp}`)).toBeVisible();
    })

    // 17. Click 'Delete Account' button
    await test.step('Click Delete Account button', async () => {
        await homePage.clickDeleteAccountButton();
    })

    // 18. Verify that 'ACCOUNT DELETED!' is visible and click 'Continue' button
    await test.step('Verify account deleted', async () => {
        await expect(page.getByText('ACCOUNT DELETED!')).toBeVisible();
        await homePage.clickContinueButton();
    })

})


