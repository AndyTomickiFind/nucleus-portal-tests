import { expect, test } from '@playwright/test';
import { logResponse } from '../../../src/logger';
import config from '../../../playwright.config';

test.describe(`CRUD e2e API licenses - ${config.name}`, { tag: [`@${config.name}`] }, () => {
    let licenseId: string;
    let licenseName: string;
    let updatedLicenseName: string;
    let logo: string;

    test(`CRUD operations executed sequentially`, async ({ request }, testInfo) => {
        // Step 1: Create a New License
        await test.step('Step 1: Create a New License', async () => {
            licenseName = `[QA] RoboLicense - ${crypto.randomUUID()}`;
            logo = `logo_${Math.floor(Math.random() * 1000)}`; // Example logo placeholder

            const createResponse = await request.post(`https://${config.nucleusPortalServiceUri}/api/v1/licenses`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                    'Content-Type': 'application/json',
                },
                data: {
                    name: [
                        {
                            language: 'en',
                            text: licenseName,
                        },
                    ],
                    logo: logo,
                },
            });

            await logResponse(createResponse, testInfo, 'POST');
            const createStatusCode = createResponse.status();
            expect(createStatusCode).toBe(201);

            const responseBody = await createResponse.json();
            licenseId = responseBody._id; // Assuming `_id` is returned in the response
            expect(licenseId).toBeTruthy();
            expect.soft(responseBody.name[0].text).toBe(licenseName); // Verifying name with language
            console.log(`Created License ID: ${licenseId}`);
        });

        // Step 2: Verify the created license appears in the list of all licenses
        await test.step('Step 2: Verify the License is in the list of all licenses', async () => {
            const getAllResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/licenses?name=${licenseName}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(getAllResponse, testInfo, 'GET');
            const getAllStatusCode = getAllResponse.status();
            expect(getAllStatusCode).toBe(200);

            const responseBody = await getAllResponse.json();
            expect.soft(responseBody[0]).toHaveProperty('_id', licenseId);
        });

        // Step 3: Verify the Created License with GET
        await test.step('Step 3: Verify the Created License with GET', async () => {
            const getCreatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/licenses/${licenseId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(getCreatedResponse, testInfo, 'GET');
            expect(getCreatedResponse.status()).toBe(200);

            const getCreatedBody = await getCreatedResponse.json();
            expect.soft(getCreatedBody).toHaveProperty('_id', licenseId);
            expect.soft(getCreatedBody.name[0]).toHaveProperty('text', licenseName); // Verifying translated text
            expect.soft(getCreatedBody.name[0]).toHaveProperty('language', 'en'); // Verifying language
            expect.soft(getCreatedBody).toHaveProperty('logo', logo);
            console.log(`Verified License via GET: ${licenseId}`);
        });

        // Step 4: Update the License using PATCH
        await test.step('Step 4: Update the License using PATCH', async () => {
            updatedLicenseName = `${licenseName} - Updated`;

            const patchResponse = await request.patch(`https://${config.nucleusPortalServiceUri}/api/v1/licenses/${licenseId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                    'Content-Type': 'application/json',
                },
                data: {
                    name: [
                        {
                            language: 'en',
                            text: updatedLicenseName,
                        },
                    ],
                    logo: `${logo}_updated`, // Updated logo
                },
            });

            await logResponse(patchResponse, testInfo, 'PATCH');
            const patchStatusCode = patchResponse.status();
            expect(patchStatusCode).toBe(204);

            console.log(`Updated License Name via PATCH: ${updatedLicenseName}`);
        });

        // Step 5: Verify the Updated License with GET
        await test.step('Step 5: Verify the Updated License with GET', async () => {
            const getUpdatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/licenses/${licenseId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(getUpdatedResponse, testInfo, 'GET');
            const getUpdatedStatusCode = getUpdatedResponse.status();
            expect(getUpdatedStatusCode).toBe(200);

            const getUpdatedBody = await getUpdatedResponse.json();
            expect(getUpdatedBody).toHaveProperty('_id', licenseId);
            expect(getUpdatedBody.name[0]).toHaveProperty('text', updatedLicenseName); // Verifying translated text
            expect(getUpdatedBody).toHaveProperty('logo', `${logo}_updated`);
            console.log(`Verified Updated License via GET: ${licenseId}`);
        });

        // Step 6: Delete the License
        await test.step('Step 6: Delete the License', async () => {
            const deleteResponse = await request.delete(`https://${config.nucleusPortalServiceUri}/api/v1/licenses/${licenseId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(deleteResponse, testInfo, 'DELETE');
            const deleteStatusCode = deleteResponse.status();
            expect(deleteStatusCode).toBe(204);

            console.log(`License with ID ${licenseId} has been deleted successfully.`);
        });

        // Step 7: Verify the Deletion with GET
        await test.step('Step 7: Verify the Deletion with GET', async () => {
            const getAfterDeleteResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/licenses/${licenseId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(getAfterDeleteResponse, testInfo, 'GET');
            const getAfterDeleteStatusCode = getAfterDeleteResponse.status();
            expect(getAfterDeleteStatusCode).toBe(404); // Not Found

            console.log(`Verified License Deletion (404): ${licenseId}`);
        });
    });
});