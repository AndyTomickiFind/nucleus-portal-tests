import {expect, test} from '@playwright/test';
import {logResponse} from '../../src/logger';
import config from '../../playwright.config';

test(`[${config.name.toUpperCase()}] GET /api/v1/partners`, async ({request}, testInfo) => {
    const [response] = await Promise.all([request.get(`https://${config.toplistServiceV1Uri}/api/v1/partners`, {
        headers: {
            // Add headers if needed
        },
        params: {
            type: "casinos"
            // add exchanges
        },
        data: {
            // Add body data if needed
        }
    })]);

    await logResponse(response, testInfo, "GET");

    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    const idPattern = /^[0-9a-fA-F]{24}$/;
    //const fullExpectedResponse = JSON.parse(fs.readFileSync(`tests/api/expectedResponses_${process.env.TEST_ENV}/partners.json`, 'utf-8'));
    //expect(responseBody).toMatchObject(fullExpectedResponse);
    responseBody.forEach(item => {
        expect(item).toHaveProperty('_id');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('type');

        expect(item._id).toMatch(idPattern);
        expect(typeof item.name).toBe('string');
        expect(item.type).toBe('casinos');
    });
});
