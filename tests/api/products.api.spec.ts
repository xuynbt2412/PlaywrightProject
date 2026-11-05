import { test, expect } from '@playwright/test';

type ProductsResponse = {
    responseCode: number;
    products: unknown[];
};

type MethodNotSupportedResponse = {
    responseCode: number;
    message: string;
};

function isProductsResponse(value: unknown): value is ProductsResponse {
    return (
        typeof value === 'object' &&
        value !== null &&
        'responseCode' in value &&
        typeof value.responseCode === 'number' &&
        'products' in value &&
        Array.isArray(value.products)
    );
}

function assertProductsResponse(value: unknown): asserts value is ProductsResponse {
    if (!isProductsResponse(value)) {
        throw new Error('Response must contain a numeric responseCode and a products array');
    }
}

function isMethodNotSupportedResponse(value: unknown): value is MethodNotSupportedResponse {
    return (
        typeof value === 'object' &&
        value !== null &&
        'responseCode' in value &&
        typeof value.responseCode === 'number' &&
        'message' in value &&
        typeof value.message === 'string'
    );
}

function assertMethodNotSupportedResponse(
    value: unknown,
): asserts value is MethodNotSupportedResponse {
    if (!isMethodNotSupportedResponse(value)) {
        throw new Error('Response must contain a numeric responseCode and a message');
    }
}

test('API 1: Get All Products List', { tag: '@api' }, async ({ request }) => {
    const response = await request.get('/api/productsList');

    expect(response.status()).toBe(200);

    const payload: unknown = await response.json();
    assertProductsResponse(payload);

    expect(payload.responseCode).toBe(200);
    expect(payload.products.length).toBeGreaterThan(0);

    for (const product of payload.products) {
        expect(product).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                name: expect.any(String),
                price: expect.any(String),
                brand: expect.any(String),
                category: expect.any(Object),
            }),
        );
    }
});

test('API 2: POST To All Products List', { tag: '@api' }, async ({ request }) => {
    const response = await request.post('/api/productsList');

    // This practice API returns HTTP 200 and puts the method error code in the JSON body.
    expect(response.status()).toBe(200);

    const payload: unknown = await response.json();
    assertMethodNotSupportedResponse(payload);

    expect(payload.responseCode).toBe(405);
    expect(payload.message).toBe('This request method is not supported.');
});
