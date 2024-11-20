
import { test, expect } from '@playwright/test';
import {logResponse} from '../../src/logger';
import config from "../../playwright.config";
import fs from "fs";

test(`[${config.name.toUpperCase()}] GET /api/v1/toplists/{id}/lean`, async ({ request }, testInfo) => {
    const testData = JSON.parse(fs.readFileSync(`tests/api/testData_${process.env.TEST_ENV}/toplistsIds.json`, 'utf-8'));
    const response = await request.get(`https://${config.toplistServiceV1Uri}/api/v1/toplists/${testData._id}/lean`, {
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

    expect(response.status()).toBe(200);
    const fullExpectedResponse = JSON.parse(fs.readFileSync(`tests/api/expectedResponses_${process.env.TEST_ENV}/lean.json`, 'utf-8'))
    const responseBody = await response.json();
    expect(responseBody).toMatchObject(fullExpectedResponse);
});
