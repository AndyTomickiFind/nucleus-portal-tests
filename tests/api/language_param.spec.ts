import {expect, test} from '@playwright/test';
import {logResponse} from '../../src/logger';
import config from "../../playwright.config";
import fs from "fs";

test(`[${config.name.toUpperCase()}] Test response language according to param EN FR ES PT`, {
    annotation: {
        type: 'issue',
        description: 'https://findco.atlassian.net/browse/DEV-5372',
    },
}, async ({request}, testInfo) => {

    const languages = [
        'en',
        'fr',
        'es',
        'pt',
        'pl',  //should return errorcode 400
    ];

    for (const language of languages) {
        await test.step(`Checking language: ${language}`, async () => {
            const testData = JSON.parse(fs.readFileSync(`tests/api/testData_${process.env.TEST_ENV}/cryptogambling-toplistsIds.json`, 'utf-8'));
            const response = await request.get(`https://${config.toplistServiceV1Uri}/api/v2/toplists/${testData._id}/results`, {
                headers: {
                    // Add headers if needed
                },
                params: {
                    'language': `${language}`
                },
                data: {
                    // Add body data if needed
                }
            });

            await logResponse(response, testInfo);

            // expect(response.status()).toBe(200);
            const fullExpectedResponse = JSON.parse(fs.readFileSync(`tests/api/expectedResponses_${process.env.TEST_ENV}/language_params/language_${language}.json`, 'utf-8'));
            // Parse the response body as JSON
            const responseBody = await response.json();
            expect(responseBody).toMatchObject(fullExpectedResponse);
        });
    }
});