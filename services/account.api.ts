import { type APIRequestContext, type APIResponse } from '@playwright/test';
import { type UserData } from '../data/user.factory';

type Credentials = Pick<UserData, 'email' | 'password'>;

export class AccountApi {
    constructor(private readonly request: APIRequestContext) {}

    async create(user: UserData): Promise<void> {
        const response = await this.request.post('/api/createAccount', {
            form: {
                name: user.name,
                email: user.email,
                password: user.password,
                title: user.title,
                birth_date: user.birthDate.day,
                birth_month: user.birthDate.month,
                birth_year: user.birthDate.year,
                firstname: user.address.firstName,
                lastname: user.address.lastName,
                company: user.address.company,
                address1: user.address.address1,
                address2: user.address.address2,
                country: user.address.country,
                state: user.address.state,
                city: user.address.city,
                zipcode: user.address.zipcode,
                mobile_number: user.address.mobileNumber,
            },
            timeout: 15_000,
        });
        await this.validateResponse(response, 'Create account', [201]);
    }

    async delete(user: Credentials): Promise<void> {
        const response = await this.request.delete('/api/deleteAccount', {
            form: { email: user.email, password: user.password },
            timeout: 15_000,
        });
        // API 404 means this account is already absent, including deletion by the UI test.
        await this.validateResponse(response, 'Delete account', [200, 404]);
    }

    private async validateResponse(
        response: APIResponse,
        operation: string,
        allowedCodes: number[],
    ): Promise<void> {
        try {
            if (!response.ok()) {
                throw new Error(`${operation}: HTTP ${response.status()}`);
            }
            let payload: unknown;
            try {
                payload = await response.json();
            } catch {
                throw new Error(
                    `${operation}: expected a JSON response (HTTP ${response.status()})`,
                );
            }
            if (
                typeof payload !== 'object' ||
                payload === null ||
                !('responseCode' in payload) ||
                typeof payload.responseCode !== 'number'
            ) {
                throw new Error(`${operation}: missing numeric responseCode`);
            }
            if (!allowedCodes.includes(payload.responseCode)) {
                throw new Error(
                    `${operation}: unexpected API responseCode ${payload.responseCode}`,
                );
            }
        } finally {
            await response.dispose();
        }
    }
}
