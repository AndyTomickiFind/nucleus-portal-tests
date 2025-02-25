import { expect, test } from '@playwright/test';
import { logResponse } from '../../../src/logger';
import config from '../../../playwright.config';

test.describe(`CRUD e2e API positions - ${config.name}`, { tag: [`@${config.name}`] }, () => {
    let positionId: string;
    let positionName: string;
    let updatedPositionName: string;

    test(`CRUD operations executed sequentially`, async ({ request }, testInfo) => {
        // Step 1: Create a New Position
        await test.step('Step 1: Create a New Position', async () => {
            positionName = `[QA] RoboPosition - ${crypto.randomUUID()}`;

            const createResponse = await request.post(`https://${config.nucleusPortalServiceUri}/api/v1/positions`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                    'Content-Type': 'application/json',
                },
                data: {
                    name: [
                        {
                            language: 'en',
                            text: positionName,
                        },
                    ],
                },
            });

            await logResponse(createResponse, testInfo, 'POST');
            const createStatusCode = createResponse.status();
            expect(createStatusCode).toBe(201);

            const responseBody = await createResponse.json();
            positionId = responseBody._id; // Assuming `_id` is returned in the response
            expect(positionId).toBeTruthy();
            expect.soft(responseBody.name[0].text).toBe(positionName); // Verifying name with language
            console.log(`Created Position ID: ${positionId}`);
        });

        // Step 2: Verify the created position appears in the list of all positions
        await test.step('Step 2: Verify the Position is in the list of all positions', async () => {
            const getAllResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/positions?page=0&size=100&sortField=createdAt&sortOrder=desc&name=${positionName}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(getAllResponse, testInfo, 'GET');
            const getAllStatusCode = getAllResponse.status();
            expect(getAllStatusCode).toBe(200);

            const responseBody = await getAllResponse.json();

            expect.soft(responseBody[0]).toHaveProperty('_id', positionId);
        });

        // Step 3: Verify the Created Position with GET
        await test.step('Step 3: Verify the Created Position with GET', async () => {
            const getCreatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/positions/${positionId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(getCreatedResponse, testInfo, 'GET');
            const getCreatedStatusCode = getCreatedResponse.status();
            expect(getCreatedStatusCode).toBe(200);

            const getCreatedBody = await getCreatedResponse.json();
            expect.soft(getCreatedBody).toHaveProperty('_id', positionId);
            expect.soft(getCreatedBody.name[0]).toHaveProperty('text', positionName); // Verifying translated text
            expect.soft(getCreatedBody.name[0]).toHaveProperty('language', 'en'); // Verifying language
            console.log(`Verified Position via GET: ${positionId}`);
        });

        // Step 4: Update the Position using PATCH
        await test.step('Step 4: Update the Position using PATCH', async () => {
            updatedPositionName = `${positionName} - Updated`;

            const patchResponse = await request.patch(`https://${config.nucleusPortalServiceUri}/api/v1/positions/${positionId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                    'Content-Type': 'application/json',
                },
                data: {
                    name: [
                        {
                            language: 'en',
                            text: updatedPositionName,
                        },
                    ],
                },
            });

            await logResponse(patchResponse, testInfo, 'PATCH');
            const patchStatusCode = patchResponse.status();
            expect(patchStatusCode).toBe(204);

            console.log(`Updated Position Name via PATCH: ${updatedPositionName}`);
        });

        // Step 5: Verify the Updated Position with GET
        await test.step('Step 5: Verify the Updated Position with GET', async () => {
            const getUpdatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/positions/${positionId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(getUpdatedResponse, testInfo, 'GET');
            const getUpdatedStatusCode = getUpdatedResponse.status();
            expect(getUpdatedStatusCode).toBe(200);

            const getUpdatedBody = await getUpdatedResponse.json();
            expect(getUpdatedBody).toHaveProperty('_id', positionId);
            expect(getUpdatedBody.name[0]).toHaveProperty('text', updatedPositionName); // Verifying translated text
            expect(getUpdatedBody.name[0]).toHaveProperty('language', 'en'); // Verifying language
            console.log(`Verified Updated Position via GET: ${positionId}`);
        });

        // Step 6: Delete the Position
        await test.step('Step 6: Delete the Position', async () => {
            const deleteResponse = await request.delete(`https://${config.nucleusPortalServiceUri}/api/v1/positions/${positionId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(deleteResponse, testInfo, 'DELETE');
            const deleteStatusCode = deleteResponse.status();
            expect(deleteStatusCode).toBe(204);

            console.log(`Position with ID ${positionId} has been deleted successfully.`);
        });

        // Step 7: Verify the Deletion with GET
        await test.step('Step 7: Verify the Deletion with GET', async () => {
            const getAfterDeleteResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/positions/${positionId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(getAfterDeleteResponse, testInfo, 'GET');
            const getAfterDeleteStatusCode = getAfterDeleteResponse.status();
            expect(getAfterDeleteStatusCode).toBe(404); // Not Found

            console.log(`Verified Position Deletion (404): ${positionId}`);
        });
    });
});