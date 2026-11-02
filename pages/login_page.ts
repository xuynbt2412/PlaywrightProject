import { type Page } from '@playwright/test';

export class LoginPage {
    constructor(private page: Page) { }

    async fillLoginForm(email: string, password: string) {
        // Trang có cả form đăng ký và đăng nhập; data-qa xác định đúng ô login.
        await this.page.locator('[data-qa="login-email"]').fill(email);
        await this.page.locator('[data-qa="login-password"]').fill(password);
    }

    async clickLoginButton() {
        await this.page.getByRole('button', { name: 'Login', exact: true }).click();
    }
}
