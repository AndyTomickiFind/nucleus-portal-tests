import {expect, test} from '@playwright/test';
import {logResponse} from '../../src/logger';
import config from '../../playwright.config';
import fs from 'fs';

test(`[${config.name.toUpperCase()}] GET /api/v1/partners`, async ({request}, testInfo) => {
    const [response] = await Promise.all([request.get(`https://${config.toplistServiceV1Uri}/api/v1/partners`, {
        headers: {
            // Add headers if needed
        },
        params: {
            type: "casinos"
        },
        data: {
            // Add body data if needed
        }
    })]);

    await logResponse(response, testInfo);

    expect(response.status()).toBe(200); // Customize based on the expected status code
    const responseBody = await response.json();

    const fullExpectedResponse = JSON.parse(fs.readFileSync(`tests/api/expectedResponses_${process.env.TEST_ENV}/partners.json`, 'utf-8'))
    expect(responseBody).toMatchObject(fullExpectedResponse);
});
