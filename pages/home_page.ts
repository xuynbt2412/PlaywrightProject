import { type Page } from '@playwright/test';

export class HomePage {
    constructor(private page: Page) { }

    async navigateToHomePage() {
        await this.page.goto('http://automationexercise.com/');
    }

    async clickSignupLogin() {
        await this.page.getByRole('link', { name: 'Signup / Login' }).click();
    }

    async fillSignupForm(name: string, email: string) {
        await this.page.locator('[data-qa="signup-name"]').fill(name);
        await this.page.locator('[data-qa="signup-email"]').fill(email);
    }

    async clickSignupButton() {
        await this.page.getByRole('button', { name: 'Signup' }).click();
    }
}