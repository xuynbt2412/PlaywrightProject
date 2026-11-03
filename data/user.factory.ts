import { randomUUID } from 'node:crypto';

export type Title = 'Mr' | 'Mrs';
export type AddressData = {
    firstName: string;
    lastName: string;
    company: string;
    address1: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobileNumber: string;
};
export type AccountDetails = {
    title: Title;
    name: string;
    password: string;
    birthDate: { day: string; month: string; year: string };
};
export type UserData = AccountDetails & { email: string; address: AddressData };

export function createUserData(title: Title = 'Mr'): UserData {
    const id = randomUUID();
    return {
        name: `user_${id.slice(0, 8)}`,
        email: `qa-${id}@example.com`,
        password: `Test@${randomUUID()}`,
        title,
        birthDate: { day: '1', month: '1', year: '1990' },
        address: {
            firstName: 'Test',
            lastName: 'User',
            company: 'Test Company',
            address1: '123 Test Street',
            address2: 'Unit 1',
            country: 'Canada',
            state: 'Ontario',
            city: 'Toronto',
            zipcode: '12345',
            mobileNumber: '1234567890',
        },
    };
}
