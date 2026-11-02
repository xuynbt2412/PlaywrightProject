import { type Page } from '@playwright/test';

export class HomePage {
    constructor(private page: Page) { }

    async navigateToHomePage() {
        await this.page.goto('http://automationexercise.com/');
    }

    async clickSignupLogin() {
        await this.page.getByRole('link', { name: 'Signup / Login' }).click();
    }
}
