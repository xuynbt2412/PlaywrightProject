import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home_page';
import { RegisterPage } from '../pages/register_page';
import { LoginPage } from '../pages/login_page';
import { Header } from '../pages/components/header';

type PageFixtures = {
    homePage: HomePage;
    registerPage: RegisterPage;
    loginPage: LoginPage;
    header: Header;
};

// Page objects do not navigate. Tests/state fixtures explicitly choose where to start.
export const test = base.extend<PageFixtures>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    header: async ({ page }, use) => {
        await use(new Header(page.getByRole('banner')));
    },
});

export { expect } from '@playwright/test';
