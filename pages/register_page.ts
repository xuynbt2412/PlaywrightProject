import { type Page } from '@playwright/test';

export class RegisterPage {
    constructor(private page: Page) { }

    async fillSignupForm(name: string, email: string) {
        await this.page.locator('[data-qa="signup-name"]').fill(name);
        await this.page.locator('[data-qa="signup-email"]').fill(email);
    }

    async clickSignupButton() {
        await this.page.getByRole('button', { name: 'Signup' }).click();
    }

    async fillDetailInformation(title: string, name: string, email: string, password: string, day: string, month: string, year: string) {
        await this.page.locator('//input[@id = "id_gender2"]').check();
        await this.page.locator('[data-qa="name"]').fill(name);
        // await this.page.locator('[data-qa="email"]').fill(email);
        await this.page.locator('[data-qa="password"]').fill(password);
        await this.page.locator('[data-qa="days"]').selectOption(day);
        await this.page.locator('[data-qa="months"]').selectOption(month);
        await this.page.locator('[data-qa="years"]').selectOption(year);
    }

    async selectNewsletter() {
        await this.page.getByRole('checkbox', { name: 'Sign up for our newsletter!' }).check();
    }

    async selectSpecialOffers() {
        await this.page.getByRole('checkbox', { name: 'Receive special offers from our partners!' }).check();
    }

    async fillAddressInformation(firstName: string, lastName: string, company: string, address1: string, address2: string, country: string, state: string, city: string, zipcode: string, mobileNumber: string) {
        await this.page.locator('[data-qa="first_name"]').fill(firstName);
        await this.page.locator('[data-qa="last_name"]').fill(lastName);
        await this.page.locator('[data-qa="company"]').fill(company);
        await this.page.locator('[data-qa="address"]').fill(address1);
        await this.page.locator('[data-qa="address2"]').fill(address2);
        await this.page.locator('[data-qa="country"]').selectOption(country);
        await this.page.locator('[data-qa="state"]').fill(state);
        await this.page.locator('[data-qa="city"]').fill(city);
        await this.page.locator('[data-qa="zipcode"]').fill(zipcode);
        await this.page.locator('[data-qa="mobile_number"]').fill(mobileNumber);
    }

    async clickCreateAccountButton() {
        await this.page.getByRole('button', { name: 'Create Account' }).click();
    }

    async clickContinueButton() {
        await this.page.getByRole('link', { name: 'Continue' }).click();
    }

    async clickDeleteAccountButton() {
        await this.page.getByRole('link', { name: 'Delete Account' }).click();
    }
}
