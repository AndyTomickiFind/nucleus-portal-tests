import {expect, test} from '@playwright/test';
import {logResponse} from '../../src/logger';
import config from "../../playwright.config";

test(`[${config.name.toUpperCase()}] GET /api/v1/toplists`, async ({request}, testInfo) => {
    try {
        const response = await request.get(`https://${config.toplistServiceV1Uri}/api/v1/toplists`, {
            headers: {
                // Add headers if needed
            },
            params: {},
            data: {
                // Add body data if needed
            }
        });

        await logResponse(response, testInfo, "GET");

        expect(response.status()).toBe(200);
        //const fullExpectedResponse = JSON.parse(fs.readFileSync(`tests/api/expectedResponses_${process.env.TEST_ENV}/toplists.json`, 'utf-8'))
        const responseBody = await response.json();
        //expect(responseBody).toMatchObject(fullExpectedResponse);
        // Check if the response is an array
        expect(Array.isArray(responseBody)).toBeTruthy();

        console.log(`Total toplists returned: ${responseBody.length}`);

        // Get the first 20 toplists if there are more than 20
        const toplistsToCheck = responseBody.slice(0, 20);

        // Define a regex pattern for the "_id" field
        const idPattern = /^[0-9a-fA-F]{24}$/;

        // Define a regex pattern for date/time fields
        const dateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

        // Iterate over each object in the toplists array and perform assertions
        toplistsToCheck.forEach((toplist, index) => {
            console.log(`Currently validating toplist "${toplist.name}" at index ${index}`);
            try {
                // Basic field checks
                expect(toplist).toHaveProperty('_id');
                expect(toplist).toHaveProperty('name');
                expect(toplist).toHaveProperty('description');
                expect(toplist).toHaveProperty('type');
                expect(toplist).toHaveProperty('appliesToProducts');
                expect(toplist).toHaveProperty('overrides');
                expect(toplist).toHaveProperty('placementsCount');
                expect(toplist).toHaveProperty('defaultResults');
                expect(toplist).toHaveProperty('createdAt');
                expect(toplist).toHaveProperty('updatedAt');
                expect(toplist).toHaveProperty('hasPublishedVersion');
                expect(toplist).toHaveProperty('publishedVersion');
                expect(toplist.publishedVersion).toHaveProperty('overrides');
                expect(toplist).toHaveProperty('status');
                expect(toplist).toHaveProperty('subType');
                

                // Check the format of specific fields
                expect(toplist._id).toMatch(idPattern);
                expect(typeof toplist.name).toBe('string');
                expect(typeof toplist.description).toBe('string');
                expect(typeof toplist.type).toBe('string');
                expect(Array.isArray(toplist.appliesToProducts)).toBeTruthy();
                toplist.appliesToProducts.forEach(productId => {
                    expect(productId).toMatch(idPattern);
                });
                expect(Array.isArray(toplist.overrides)).toBeTruthy();
                toplist.overrides.forEach(override => {
                    expect(override).toHaveProperty('appliesToCountries');
                    expect(override).toHaveProperty('results');
                    expect(override).toHaveProperty('_id');
                    expect(Array.isArray(override.appliesToCountries)).toBeTruthy();
                    expect(Array.isArray(override.results)).toBeTruthy();
                    expect(override._id).toMatch(idPattern);
                    override.results.forEach(resultId => {
                        expect(resultId).toMatch(idPattern);
                    });
                });
                expect(typeof toplist.placementsCount).toBe('number');
                expect(Array.isArray(toplist.defaultResults)).toBeTruthy();
                toplist.defaultResults.forEach(resultId => {
                    expect(resultId).toMatch(idPattern);
                });
                expect(toplist.createdAt).toMatch(dateTimePattern);
                expect(toplist.updatedAt).toMatch(dateTimePattern);
                expect(typeof toplist.hasPublishedVersion).toBe('boolean');
                if (toplist.hasPublishedVersion) {
                    expect(toplist.publishedVersion).toHaveProperty('overrides');
                    expect(toplist.publishedVersion).toHaveProperty('defaultResults');
                    expect(toplist.publishedVersion).toHaveProperty('placementsCount');
                    expect(toplist.publishedVersion).toHaveProperty('publishedDate');
                    //expect(toplist.publishedVersion).toHaveProperty('_id');
                    expect(Array.isArray(toplist.publishedVersion.overrides)).toBeTruthy();
                    toplist.publishedVersion.overrides.forEach(override => {
                        expect(override).toHaveProperty('appliesToCountries');
                        expect(override).toHaveProperty('results');
                        expect(override).toHaveProperty('_id');
                        expect(Array.isArray(override.appliesToCountries)).toBeTruthy();
                        expect(Array.isArray(override.results)).toBeTruthy();
                        expect(override._id).toMatch(idPattern);
                        override.results.forEach(resultId => {
                            expect(resultId).toMatch(idPattern);
                        });
                    });
                    expect(Array.isArray(toplist.publishedVersion.defaultResults)).toBeTruthy();
                    toplist.publishedVersion.defaultResults.forEach(resultId => {
                        expect(resultId).toMatch(idPattern);
                    });
                    expect(typeof toplist.publishedVersion.placementsCount).toBe('number');
                    expect(toplist.publishedVersion.publishedDate).toMatch(dateTimePattern);
                    //expect(toplist.publishedVersion._id).toMatch(idPattern);
                }
                expect(typeof toplist.status).toBe('string');
                expect(typeof toplist.subType).toBe('string');
            } catch (error) {
                // Log the broken toplist name
                console.error(`Error validating toplist "${toplist.name}" at index ${index}:`, error);
                console.log(`Failed toplist:`, JSON.stringify(toplist, null, 2));
                throw error; // Re-throw error to ensure test failure
            }
        });
    } catch (error) {
        // Log more details if the initial request or array check fails
        console.error('Error in API response validation:', error);
        throw error; // Re-throw error to ensure test failure
    }

});

