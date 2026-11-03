import { type Page } from '@playwright/test';

export class HomePage {
    constructor(private readonly page: Page) {}

    async navigateToHomePage(): Promise<void> {
        await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    }
}
