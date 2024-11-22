
import { test, expect } from '@playwright/test';
import { logResponse } from '../../src/logger';
import config from "../../playwright.config";

test(`[${config.name.toUpperCase()}] GET /api/v1/partners/affiliate-url`, async ({ request }, testInfo) => {
    const response = await request.get(`https://${config.toplistServiceV1Uri}/api/v1/partners/affiliate-url`, {
        headers: {
            // Add headers if needed
        },
        params: {
            productName: "ccn.com",
        },
        data: {
            // Add body data if needed
        }
    });

    await logResponse(response, testInfo);

    expect(response.status()).toBe(200);
    //const fullExpectedResponse = JSON.parse(fs.readFileSync(`tests/api/expectedResponses_${process.env.TEST_ENV}/refLinks.json`, 'utf-8'))
    const responseBody = await response.json();
    //expect(responseBody).toMatchObject(fullExpectedResponse);

    const idPattern = /^[0-9a-fA-F]{24}$/;

    // Define a regex pattern for the "ref" field to check for valid URLs
    //const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

    // Iterate over each object and perform assertions
    responseBody.forEach(item => {
        expect(item).toHaveProperty('_id');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('ref');

        // Check the format of the "_id" field
        expect(item._id).toMatch(idPattern);

        // Verify the values of the other properties
        expect(typeof item.name).toBe('string');
      //  expect(item.ref).toMatch(urlPattern);
    });
});
