import { type Page } from '@playwright/test';

export class HomePage {
    constructor(private readonly page: Page) {}

    async navigateToHomePage(): Promise<void> {
        const maxAttempts = 3;

        for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
            await this.page.goto('/', { waitUntil: 'domcontentloaded' });

            const isServerBusy = await this.page
                .getByRole('heading', { name: /website is under heavy load/i })
                .isVisible();

            if (!isServerBusy) return;

            if (attempt === maxAttempts) {
                throw new Error(
                    `Automation Exercise remained under heavy load after ${maxAttempts} navigation attempts.`,
                );
            }
        }
    }
}
