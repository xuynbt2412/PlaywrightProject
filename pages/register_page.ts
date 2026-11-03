import { type Locator, type Page } from '@playwright/test';
import { type AccountDetails, type AddressData, type Title } from '../data/user.factory';

export class RegisterPage {
    readonly signupHeading: Locator;
    readonly accountInformationHeading: Locator;
    readonly emailInput: Locator;
    readonly accountCreatedHeading: Locator;
    readonly accountDeletedHeading: Locator;
    readonly existingEmailError: Locator;

    constructor(private readonly page: Page) {
        this.signupHeading = page.getByRole('heading', { name: 'New User Signup!' });
        this.accountInformationHeading = page.getByText('Enter Account Information', {
            exact: true,
        });
        this.emailInput = page.getByTestId('email');
        this.accountCreatedHeading = page.getByTestId('account-created');
        this.accountDeletedHeading = page.getByTestId('account-deleted');
        this.existingEmailError = page.getByText('Email Address already exist!', { exact: true });
    }

    titleOption(title: Title): Locator {
        return this.page.getByRole('radio', { name: `${title}.`, exact: true });
    }

    async fillSignupForm(name: string, email: string): Promise<void> {
        await this.page.getByTestId('signup-name').fill(name);
        await this.page.getByTestId('signup-email').fill(email);
    }

    async clickSignupButton(): Promise<void> {
        await this.page.getByRole('button', { name: 'Signup', exact: true }).click();
    }

    async fillDetailInformation(details: AccountDetails): Promise<void> {
        await this.titleOption(details.title).check();
        await this.page.getByTestId('name').fill(details.name);
        await this.page.getByTestId('password').fill(details.password);
        await this.page.getByTestId('days').selectOption(details.birthDate.day);
        await this.page.getByTestId('months').selectOption(details.birthDate.month);
        await this.page.getByTestId('years').selectOption(details.birthDate.year);
    }

    async selectNewsletter(): Promise<void> {
        await this.page.getByRole('checkbox', { name: 'Sign up for our newsletter!' }).check();
    }

    async selectSpecialOffers(): Promise<void> {
        await this.page
            .getByRole('checkbox', { name: 'Receive special offers from our partners!' })
            .check();
    }

    async fillAddressInformation(address: AddressData): Promise<void> {
        await this.page.getByTestId('first_name').fill(address.firstName);
        await this.page.getByTestId('last_name').fill(address.lastName);
        await this.page.getByTestId('company').fill(address.company);
        await this.page.getByTestId('address').fill(address.address1);
        await this.page.getByTestId('address2').fill(address.address2);
        await this.page.getByTestId('country').selectOption(address.country);
        await this.page.getByTestId('state').fill(address.state);
        await this.page.getByTestId('city').fill(address.city);
        await this.page.getByTestId('zipcode').fill(address.zipcode);
        await this.page.getByTestId('mobile_number').fill(address.mobileNumber);
    }

    async clickCreateAccountButton(): Promise<void> {
        await this.page.getByRole('button', { name: 'Create Account', exact: true }).click();
    }

    async clickContinueButton(): Promise<void> {
        await this.page.getByRole('link', { name: 'Continue', exact: true }).click();
    }
}
