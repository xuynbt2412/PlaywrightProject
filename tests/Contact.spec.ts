/* eslint-disable @typescript-eslint/no-unsafe-call */
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';
import { test, expect } from '../fixture/test.fixture';

test('Contact Us Form', { tag: '@e2e' }, async ({ page, homePage, header, contactPage }) => {
    const details = {
        name: 'QA Test',
        email: `contact-${randomUUID()}@example.com`,
        subject: 'Contact form automation check',
        message: 'This is sample feedback submitted by an automated test on the practice website.',
    };
    const attachmentPath = resolve(__dirname, '../data/files/contact-message.txt');

    await test.step('Open home page and navigate to Contact Us', async () => {
        await homePage.navigateToHomePage();
        await expect(page).toHaveURL('/');
        await expect(page).toHaveTitle('Automation Exercise');
        await expect(header.contactUsLink).toBeVisible();
        await header.clickContactUs();
        await expect(page).toHaveURL('/contact_us');
        // The inline submit handler is below parser-blocking scripts; visible fields alone are not ready.
        await page.waitForLoadState('domcontentloaded');
        await expect(contactPage.heading).toBeVisible();
    });

    await test.step('Fill contact details and upload a sample file', async () => {
        await contactPage.fillContactForm(details);
        await contactPage.uploadFile(attachmentPath);
        await expect(contactPage.uploadInput).toHaveValue(/contact-message\.txt$/);
    });

    await test.step('Submit the form and accept the confirmation dialog', async () => {
        // Register the dialog listener before clicking Submit; accept it to unblock the click.
        const [confirmation] = await Promise.all([
            page.waitForEvent('dialog').then(async (dialog) => {
                const result = { type: dialog.type(), message: dialog.message() };
                await dialog.accept();
                return result;
            }),
            contactPage.clickSubmit(),
        ]);
        expect(confirmation.type).toBe('confirm');
        expect(confirmation.message).toBe('Press OK to proceed!');
        await expect(contactPage.successMessage).toBeVisible();
    });

    await test.step('Return to Home and verify the home page', async () => {
        await contactPage.clickHome();
        await expect(page).toHaveURL('/');
        await expect(page).toHaveTitle('Automation Exercise');
        await expect(header.signupLoginLink).toBeVisible();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await expect(contactPage.heading).toBeHidden();
    });
});
