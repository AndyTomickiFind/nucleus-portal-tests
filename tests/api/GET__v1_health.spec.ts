
import { test, expect } from '@playwright/test';
import {logResponse} from '../../src/logger';
import config from "../../playwright.config";

test('GET /v1/health', async ({ request }, testInfo) => {
    const response = await request.get(`https://${config.toplistServiceV1Uri}/v1/health`, {
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
    "status":"ok","info":{"mongoose":{"status":"up"},"rabbitmq":{"status":"up"},"redis":{"status":"up"}},"error":{},"details":{"mongoose":{"status":"up"},"rabbitmq":{"status":"up"},"redis":{"status":"up"}}}
    );
});
