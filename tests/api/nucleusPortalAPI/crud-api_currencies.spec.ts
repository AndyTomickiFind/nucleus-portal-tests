import { expect, test } from '@playwright/test';
import { logResponse } from '../../../src/logger';
import config from '../../../playwright.config';

test.describe(`CRUD e2e API currencies - ${config.name}`, { tag: [`@${config.name}`] }, () => {
    let currencyId: string;
    let currencyName: string;
    let updatedCurrencyName: string;
    let shortName: string;
    let logo: string;

    test(`CRUD operations executed sequentially`, async ({ request }, testInfo) => {
        // Step 1: Create a New Currency
        await test.step('Step 1: Create a New Currency', async () => {
            currencyName = `[QA] RoboCurrency - ${crypto.randomUUID()}`;
            shortName = `[QA]CURR-${Math.floor(Math.random() * 1000)}`;
            logo = `logo_${Math.floor(Math.random() * 1000)}`; // Example logo placeholder

            const createResponse = await request.post(`https://${config.nucleusPortalServiceUri}/api/v1/currencies`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                    'Content-Type': 'application/json',
                },
                data: {
                    name: [
                        {
                            language: 'en',
                            text: currencyName,
                        },
                    ],
                    shortName: shortName,
                    logo: logo,
                },
            });

            await logResponse(createResponse, testInfo, 'POST');
            const createStatusCode = createResponse.status();
            expect(createStatusCode).toBe(201);

            const responseBody = await createResponse.json();
            currencyId = responseBody._id; // Assuming `_id` is returned in the response
            expect(currencyId).toBeTruthy();
            expect.soft(responseBody.name[0].text).toBe(currencyName); // Verifying name with language
            expect.soft(responseBody.shortName).toBe(shortName);
            console.log(`Created Currency ID: ${currencyId}`);
        });

        // Step 2: Verify the created currency appears in the list of all currencies
        await test.step('Step 2: Verify the Currency is in the list of all currencies', async () => {
            const getAllResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/currencies?page=0&size=100&sortField=createdAt&sortOrder=desc&name=${currencyName}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(getAllResponse, testInfo, 'GET');
            const getAllStatusCode = getAllResponse.status();
            expect(getAllStatusCode).toBe(200);

            const responseBody = await getAllResponse.json();

            expect(responseBody.items[0]._id, `New Currency must be in the list of all currencies: ${currencyId}`).toBe(currencyId);
        });

        // Step 3: Verify the Created Currency with GET
        await test.step('Step 3: Verify the Created Currency with GET', async () => {
            const getCreatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/currencies/${currencyId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(getCreatedResponse, testInfo, 'GET');
            const getCreatedStatusCode = getCreatedResponse.status();
            expect(getCreatedStatusCode).toBe(200);

            const getCreatedBody = await getCreatedResponse.json();
            expect.soft(getCreatedBody).toHaveProperty('_id', currencyId);
            expect.soft(getCreatedBody.name[0]).toHaveProperty('text', currencyName); // Verifying translated text
            expect.soft(getCreatedBody.name[0]).toHaveProperty('language', 'en'); // Verifying language
            expect.soft(getCreatedBody).toHaveProperty('shortName', shortName);
            expect.soft(getCreatedBody).toHaveProperty('logo', logo);
            console.log(`Verified Currency via GET: ${currencyId}`);
        });

        // Step 4: Update the Currency using PATCH
        await test.step('Step 4: Update the Currency using PATCH', async () => {
            updatedCurrencyName = `${currencyName} - Updated`;

            const patchResponse = await request.patch(`https://${config.nucleusPortalServiceUri}/api/v1/currencies/${currencyId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                    'Content-Type': 'application/json',
                },
                data: {
                    name: [
                        {
                            language: 'en',
                            text: updatedCurrencyName,
                        },
                    ],
                    shortName: `${shortName}-UPD`, // Example update to short name
                    logo: `${logo}_updated`, // Updated logo
                },
            });

            await logResponse(patchResponse, testInfo, 'PATCH');
            const patchStatusCode = patchResponse.status();
            expect(patchStatusCode).toBe(204);

            console.log(`Updated Currency Name via PATCH: ${updatedCurrencyName}`);
        });

        // Step 5: Verify the Updated Currency with GET
        await test.step('Step 5: Verify the Updated Currency with GET', async () => {
            const getUpdatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/currencies/${currencyId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(getUpdatedResponse, testInfo, 'GET');
            const getUpdatedStatusCode = getUpdatedResponse.status();
            expect(getUpdatedStatusCode).toBe(200);

            const getUpdatedBody = await getUpdatedResponse.json();
            expect(getUpdatedBody).toHaveProperty('_id', currencyId);
            expect(getUpdatedBody.name[0]).toHaveProperty('text', updatedCurrencyName); // Verifying translated text
            expect(getUpdatedBody).toHaveProperty('shortName', `${shortName}-UPD`);
            expect(getUpdatedBody).toHaveProperty('logo', `${logo}_updated`);
            console.log(`Verified Updated Currency via GET: ${currencyId}`);
        });

        // Step 6: Delete the Currency
        await test.step('Step 6: Delete the Currency', async () => {
            const deleteResponse = await request.delete(`https://${config.nucleusPortalServiceUri}/api/v1/currencies/${currencyId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(deleteResponse, testInfo, 'DELETE');
            const deleteStatusCode = deleteResponse.status();
            expect(deleteStatusCode).toBe(204);

            console.log(`Currency with ID ${currencyId} has been deleted successfully.`);
        });

        // Step 7: Verify the Deletion with GET
        await test.step('Step 7: Verify the Deletion with GET', async () => {
            const getAfterDeleteResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/currencies/${currencyId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(getAfterDeleteResponse, testInfo, 'GET');
            const getAfterDeleteStatusCode = getAfterDeleteResponse.status();
            expect(getAfterDeleteStatusCode).toBe(404); // Not Found

            console.log(`Verified Currency Deletion (404): ${currencyId}`);
        });
    });
});