import { expect, test } from '@playwright/test';
import { logResponse } from '../../../src/logger';
import config from "../../../playwright.config";

test.describe(`CRUD e2e API orderTypes - ${config.name}`, { tag: [`@${config.name}`] }, () => {
    let orderTypeId: string;
    let orderTypeName: string;
    let updatedOrderTypeName: string;

    test(`CRUD operations executed sequentially`, async ({ request }, testInfo) => {
        // Step 1: Create a New Order Type
        await test.step('Step 1: Create a New Order Type', async () => {
            orderTypeName = `[QA] Order Type created by robots ${crypto.randomUUID()}`;
            const createResponse = await request.post(`https://${config.nucleusPortalServiceUri}/api/v1/order-types`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                },
                data: {
                    "name": [
                        {
                            "language": "en",
                            "text": `${orderTypeName}`
                        }
                    ]
                }
            });

            await logResponse(createResponse, testInfo, "POST");
            const createStatusCode = createResponse.status();
            expect(createStatusCode).toBe(201);

            const responseBody = await createResponse.json();
            orderTypeId = responseBody._id;
            expect(orderTypeId).toBeTruthy();
            expect.soft(responseBody.name[0].text).toBe(orderTypeName);
            console.log(`Created Order Type ID: ${orderTypeId}`);
        });

        // Step 2: Verify the Created Order Type with GET
        await test.step('Step 2: Verify the Created Order Type with GET', async () => {
            const getCreatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/order-types/${orderTypeId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getCreatedResponse, testInfo, "GET");
            const getCreatedStatusCode = getCreatedResponse.status();
            expect(getCreatedStatusCode).toBe(200);

            const getCreatedBody = await getCreatedResponse.json();
            expect.soft(getCreatedBody).toHaveProperty('_id', orderTypeId);
            expect.soft(getCreatedBody.name[0]).toHaveProperty('text', orderTypeName);
            console.log(`Verified Order Type via GET: ${orderTypeId}`);
        });

        // Step 3: Update the Order Type using PATCH
        await test.step('Step 3: Update the Order Type using PATCH', async () => {
            updatedOrderTypeName = `${orderTypeName} - Updated`;

            const patchResponse = await request.patch(`https://${config.nucleusPortalServiceUri}/api/v1/order-types/${orderTypeId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                },
                data: {
                    "name": [
                        {
                            "language": "en",
                            "text": `${updatedOrderTypeName}`
                        }
                    ]
                }
            });

            await logResponse(patchResponse, testInfo, "PATCH");
            const patchStatusCode = patchResponse.status();
            expect(patchStatusCode).toBe(204);

            console.log(`Updated Order Type Name via PATCH: ${updatedOrderTypeName}`);
        });

        // Step 4: Verify the Updated Order Type with GET
        await test.step('Step 4: Verify the Updated Order Type with GET', async () => {
            const getUpdatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/order-types/${orderTypeId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getUpdatedResponse, testInfo, "GET");
            const getUpdatedStatusCode = getUpdatedResponse.status();
            expect(getUpdatedStatusCode).toBe(200);

            const getUpdatedBody = await getUpdatedResponse.json();
            expect(getUpdatedBody).toHaveProperty('_id', orderTypeId);
            expect(getUpdatedBody.name[0]).toHaveProperty('text', updatedOrderTypeName);
            console.log(`Verified Updated Order Type via GET: ${orderTypeId}`);
        });

        // Step 5: Delete the Order Type
        await test.step('Step 5: Delete the Order Type', async () => {
            const deleteResponse = await request.delete(`https://${config.nucleusPortalServiceUri}/api/v1/order-types/${orderTypeId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(deleteResponse, testInfo, "DELETE");
            const deleteStatusCode = deleteResponse.status();
            expect(deleteStatusCode).toBe(204);

            console.log(`Order Type with ID ${orderTypeId} has been deleted successfully.`);
        });

        // Step 6: Verify the Deletion with GET
        await test.step('Step 6: Verify the Deletion with GET', async () => {
            const getAfterDeleteResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/order-types/${orderTypeId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getAfterDeleteResponse, testInfo, "GET");
            const getAfterDeleteStatusCode = getAfterDeleteResponse.status();
            expect(getAfterDeleteStatusCode).toBe(404); // Not Found

            console.log(`Verified Order Type Deletion (404): ${orderTypeId}`);
        });
    });
});