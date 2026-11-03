import { createServer } from 'node:http';
import { test as base, expect, type APIRequestContext } from '@playwright/test';
import { AccountApi } from '../../services/account.api';
import { createUserData } from '../../data/user.factory';

type RequestRecord = { method: string; path: string; form: URLSearchParams };
type StubServer = {
    url: string;
    status: number;
    body: string;
    requests: RequestRecord[];
};

const test = base.extend<{ apiServer: StubServer; apiClient: APIRequestContext }>({
    // Each test owns a local HTTP server; these checks never contact the public website.
    apiServer: async ({}, use) => {
        const state: StubServer = {
            url: '',
            status: 200,
            body: '{"responseCode":201}',
            requests: [],
        };
        const server = createServer((request, response) => {
            const chunks: Buffer[] = [];
            request.on('data', (chunk: Buffer) => {
                chunks.push(chunk);
            });
            request.on('end', () => {
                state.requests.push({
                    method: request.method ?? '',
                    path: request.url ?? '',
                    form: new URLSearchParams(Buffer.concat(chunks).toString()),
                });
                response.writeHead(state.status, { 'content-type': 'application/json' });
                response.end(state.body);
            });
        });
        await new Promise<void>((resolve, reject) => {
            server.once('error', reject);
            server.listen(0, '127.0.0.1', () => {
                resolve();
            });
        });
        const address = server.address();
        if (address === null || typeof address === 'string') throw new Error('Missing server port');
        state.url = `http://127.0.0.1:${address.port}`;
        try {
            await use(state);
        } finally {
            server.closeAllConnections();
            await new Promise<void>((resolve, reject) => {
                server.close((error) => {
                    if (error) reject(error);
                    else resolve();
                });
            });
        }
    },
    apiClient: async ({ playwright, apiServer }, use) => {
        const client = await playwright.request.newContext({ baseURL: apiServer.url });
        try {
            await use(client);
        } finally {
            await client.dispose();
        }
    },
});

test('Account API sends account details as form data', async ({ apiClient, apiServer }) => {
    const user = createUserData('Mrs');
    await new AccountApi(apiClient).create(user);
    expect(apiServer.requests).toHaveLength(1);
    const sent = apiServer.requests[0];
    expect(sent?.method).toBe('POST');
    expect(sent?.path).toBe('/api/createAccount');
    expect(sent?.form.get('email')).toBe(user.email);
    expect(sent?.form.get('password')).toBe(user.password);
    expect(sent?.form.get('title')).toBe('Mrs');
    expect(sent?.form.get('birth_month')).toBe(user.birthDate.month);
    expect(sent?.form.get('address1')).toBe(user.address.address1);
});

for (const responseCode of [200, 404]) {
    test(`Cleanup accepts API responseCode ${responseCode}`, async ({ apiClient, apiServer }) => {
        apiServer.body = JSON.stringify({ responseCode });
        await new AccountApi(apiClient).delete(createUserData());
        expect(apiServer.requests[0]?.method).toBe('DELETE');
        expect(apiServer.requests[0]?.path).toBe('/api/deleteAccount');
    });
}

for (const status of [404, 503]) {
    test(`Cleanup rejects HTTP ${status} even when the body says success`, async ({
        apiClient,
        apiServer,
    }) => {
        apiServer.status = status;
        apiServer.body = '{"responseCode":200}';
        await expect(new AccountApi(apiClient).delete(createUserData())).rejects.toThrow(
            `HTTP ${status}`,
        );
    });
}

test('Account API rejects non-JSON responses with useful diagnostics', async ({
    apiClient,
    apiServer,
}) => {
    apiServer.body = '<html>Gateway error</html>';
    await expect(new AccountApi(apiClient).create(createUserData())).rejects.toThrow(
        'expected a JSON response',
    );
});

test('Account API rejects malformed success payloads', async ({ apiClient, apiServer }) => {
    apiServer.body = '{"responseCode":"201"}';
    await expect(new AccountApi(apiClient).create(createUserData())).rejects.toThrow(
        'missing numeric responseCode',
    );
});

test('Account API rejects application errors returned with HTTP 200', async ({
    apiClient,
    apiServer,
}) => {
    apiServer.body = '{"responseCode":400}';
    await expect(new AccountApi(apiClient).create(createUserData())).rejects.toThrow(
        'unexpected API responseCode 400',
    );
});
