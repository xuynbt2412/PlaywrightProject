import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home_page';

export const test = base.extend<{ homePage: HomePage }>({
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await homePage.navigateToHomePage();
        await use(homePage);
    },
});

export { expect } from '@playwright/test';