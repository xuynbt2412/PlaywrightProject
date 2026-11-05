import { type Locator, type Page } from '@playwright/test';

export type ContactDetails = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

export class ContactPage {
    readonly heading: Locator;
    readonly successMessage: Locator;
    readonly uploadInput: Locator;
    private readonly root: Locator;

    constructor(page: Page) {
        // This container has no accessible name; scope messages away from the subscription form.
        this.root = page.locator('div.contact-form');
        this.heading = this.root.getByRole('heading', { name: 'Get In Touch', exact: true });
        this.successMessage = this.root.getByText(
            'Success! Your details have been submitted successfully.',
            { exact: true },
        );
        // The upload input has neither a label nor a data-qa attribute.
        this.uploadInput = this.root.locator('input[name="upload_file"]');
    }

    async fillContactForm(details: ContactDetails): Promise<void> {
        await this.root.getByTestId('name').fill(details.name);
        await this.root.getByTestId('email').fill(details.email);
        await this.root.getByTestId('subject').fill(details.subject);
        await this.root.getByTestId('message').fill(details.message);
    }

    async uploadFile(filePath: string): Promise<void> {
        await this.uploadInput.setInputFiles(filePath);
    }

    async clickSubmit(): Promise<void> {
        await this.root.getByRole('button', { name: 'Submit', exact: true }).click();
    }

    async clickHome(): Promise<void> {
        await this.root.getByRole('link', { name: 'Home' }).click();
    }
}
