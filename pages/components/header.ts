import { type Locator } from '@playwright/test';

export class Header {
    readonly signupLoginLink: Locator;
    readonly logoutLink: Locator;
    readonly deleteAccountLink: Locator;
    readonly loggedInLabel: Locator;
    readonly contactUsLink: Locator;

    constructor(private readonly root: Locator) {
        this.signupLoginLink = root.getByRole('link', { name: 'Signup / Login' });
        this.logoutLink = root.getByRole('link', { name: 'Logout' });
        this.deleteAccountLink = root.getByRole('link', { name: 'Delete Account' });
        this.loggedInLabel = root.getByText('Logged in as');
        this.contactUsLink = root.getByRole('link', { name: 'Contact us' });
    }

    loggedInAs(name: string): Locator {
        return this.root.getByText(`Logged in as ${name}`);
    }
    async clickSignupLogin(): Promise<void> {
        await this.signupLoginLink.click();
    }
    async clickLogout(): Promise<void> {
        await this.logoutLink.click();
    }
    async clickDeleteAccount(): Promise<void> {
        await this.deleteAccountLink.click();
    }

    async clickContactUs(): Promise<void> {
        await this.contactUsLink.click();
    }
}
