import { type Locator, type Page } from '@playwright/test';

export class LoginPage {
    readonly heading: Locator;
    readonly errorMessage: Locator;

    constructor(private readonly page: Page) {
        this.heading = page.getByRole('heading', { name: 'Login to your account' });
        this.errorMessage = page.getByText('Your email or password is incorrect!', { exact: true });
    }

    async fillLoginForm(email: string, password: string): Promise<void> {
        await this.page.getByTestId('login-email').fill(email);
        await this.page.getByTestId('login-password').fill(password);
    }

    async clickLoginButton(): Promise<void> {
        await this.page.getByRole('button', { name: 'Login', exact: true }).click();
    }
}
