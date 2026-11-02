import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home_page';
import { RegisterPage } from '../pages/register_page';
import { LoginPage } from '../pages/login_page';

type PageFixtures = {
    homePage: HomePage;
    registerPage: RegisterPage;
    loginPage: LoginPage;
};

export const test = base.extend<PageFixtures>({
    // Khi test yêu cầu homePage, mở trang chủ trước khi chạy test.
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await homePage.navigateToHomePage();
        await use(homePage);
    },
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
    // Dùng chung tab `page` với homePage; chỉ tạo đối tượng, chưa điều hướng.
    loginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        // Cung cấp loginPage cho test. Test tự gọi homePage.clickSignupLogin().
        await use(loginPage);
    },
});

export { expect } from '@playwright/test';
