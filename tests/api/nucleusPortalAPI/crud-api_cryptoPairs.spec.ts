import { expect, test } from '@playwright/test';
import { logResponse } from '../../../src/logger';
import config from "../../../playwright.config";

test.describe(`CRUD e2e API cryptoPair - ${config.name}`, { tag: [`@${config.name}`] }, () => {
    let cryptoPairId: string;
    let cryptoPairsName: string;
    let updatedCryptoPairsName: string;

    test(`CRUD operations executed sequentially`, async ({ request }, testInfo) => {
        // Step 1: Create a New CryptoPair
        await test.step('Step 1: Create a New CryptoPair', async () => {
            cryptoPairsName = `[QA] Crypto Pair created by robots ${crypto.randomUUID()}`;
            const createResponse = await request.post(`https://${config.nucleusPortalServiceUri}/api/v1/crypto-pairs`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                },
                data: {
                    "name": `${cryptoPairsName}`
                }
            });

            await logResponse(createResponse, testInfo, "POST");
            const createStatusCode = createResponse.status();
            expect(createStatusCode).toBe(201);

            const responseBody = await createResponse.json();
            cryptoPairId = responseBody._id;
            expect(cryptoPairId).toBeTruthy();
            expect(responseBody.name).toBe(cryptoPairsName);
            console.log(`Created Crypto Pair ID: ${cryptoPairId}`);
        });

        // Step 2: Verify the Created CryptoPair with GET
        await test.step('Step 2: Verify the Created CryptoPair with GET', async () => {
            const getCreatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/crypto-pairs/${cryptoPairId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getCreatedResponse, testInfo, "GET");
            const getCreatedStatusCode = getCreatedResponse.status();
            expect(getCreatedStatusCode).toBe(200);

            const getCreatedBody = await getCreatedResponse.json();
            expect(getCreatedBody).toHaveProperty('_id', cryptoPairId);
            expect(getCreatedBody).toHaveProperty('name', cryptoPairsName);
            console.log(`Verified Crypto Pair via GET: ${cryptoPairId}`);
        });

        // Step 3: Update the CryptoPair using PATCH
        await test.step('Step 3: Update the CryptoPair using PATCH', async () => {
            updatedCryptoPairsName = `${cryptoPairsName} - Updated`;

            const patchResponse = await request.patch(`https://${config.nucleusPortalServiceUri}/api/v1/crypto-pairs/${cryptoPairId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                },
                data: {
                    "name": `${updatedCryptoPairsName}`
                }
            });

            await logResponse(patchResponse, testInfo, "PATCH");
            const patchStatusCode = patchResponse.status();
            expect(patchStatusCode).toBe(204);

            console.log(`Updated Crypto Pair Name via PATCH: ${updatedCryptoPairsName}`);
        });

        // Step 4: Verify the Updated CryptoPair with GET
        await test.step('Step 4: Verify the Updated CryptoPair with GET', async () => {
            const getUpdatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/crypto-pairs/${cryptoPairId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getUpdatedResponse, testInfo, "GET");
            const getUpdatedStatusCode = getUpdatedResponse.status();
            expect(getUpdatedStatusCode).toBe(200);

            const getUpdatedBody = await getUpdatedResponse.json();
            expect(getUpdatedBody).toHaveProperty('_id', cryptoPairId);
            expect(getUpdatedBody).toHaveProperty('name', updatedCryptoPairsName);
            console.log(`Verified Updated Crypto Pair via GET: ${cryptoPairId}`);
        });

        // Step 5: Delete the CryptoPair
        await test.step('Step 5: Delete the CryptoPair', async () => {
            const deleteResponse = await request.delete(`https://${config.nucleusPortalServiceUri}/api/v1/crypto-pairs/${cryptoPairId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(deleteResponse, testInfo, "DELETE");
            const deleteStatusCode = deleteResponse.status();
            expect(deleteStatusCode).toBe(204);

            console.log(`Crypto Pair with ID ${cryptoPairId} has been deleted successfully.`);
        });

        // Step 6: Verify the Deletion with GET
        await test.step('Step 6: Verify the Deletion with GET', async () => {
            const getAfterDeleteResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/crypto-pairs/${cryptoPairId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getAfterDeleteResponse, testInfo, "GET");
            const getAfterDeleteStatusCode = getAfterDeleteResponse.status();
            expect(getAfterDeleteStatusCode).toBe(404); // Not Found

            console.log(`Verified Crypto Pair Deletion (404): ${cryptoPairId}`);
        });
    });
});
