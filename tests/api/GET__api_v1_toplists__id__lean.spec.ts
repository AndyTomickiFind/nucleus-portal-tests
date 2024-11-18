
import { test, expect } from '@playwright/test';
import {logResponse} from '../../src/logger';
import config from "../../playwright.config";

test('GET /api/v1/toplists/{id}/lean', async ({ request }, testInfo) => {
    const response = await request.get(`https://${config.toplistServiceV1Uri}/api/v1/toplists/6719ffdfd4372e0607af539a/lean`, {
        headers: {
            // Add headers if needed
        },
        params: {
            // Add query params if needed
        },
        data: {
            // Add body data if needed
        }
    });

    await logResponse(response, testInfo);

    expect(response.status()).toBe(200); // Customize based on the expected status code
    const responseBody = await response.json();
    expect(responseBody).toMatchObject({
        // Add expected response body
    });
});
