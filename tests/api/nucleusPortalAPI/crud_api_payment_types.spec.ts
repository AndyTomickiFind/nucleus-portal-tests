import { expect, test } from '@playwright/test';
import { logResponse } from '../../../src/logger';
import config from '../../../playwright.config';

test.describe(`CRUD e2e API payment-types - ${config.name}`, { tag: [`@${config.name}`] }, () => {
    let paymentTypeId: string;
    let paymentTypeName: string;
    let updatedPaymentTypeName: string;

    test(`CRUD operations executed sequentially`, async ({ request }, testInfo) => {
        // Step 1: Create a New Payment Type
        await test.step('Step 1: Create a New Payment Type', async () => {
            paymentTypeName = `[QA] RoboPaymentType - ${crypto.randomUUID()}`;

            const createResponse = await request.post(`https://${config.nucleusPortalServiceUri}/api/v1/payment-types`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                    'Content-Type': 'application/json',
                },
                data: {
                    name: [
                        {
                            language: 'en',
                            text: paymentTypeName,
                        },
                    ],
                },
            });

            await logResponse(createResponse, testInfo, 'POST');
            const createStatusCode = createResponse.status();
            expect(createStatusCode).toBe(201);

            const responseBody = await createResponse.json();
            paymentTypeId = responseBody._id; // Assuming `_id` is returned in the response
            expect(paymentTypeId).toBeTruthy();
            expect.soft(responseBody.name[0].text).toBe(paymentTypeName); // Verifying name with language
            console.log(`Created Payment Type ID: ${paymentTypeId}`);
        });

        // Step 2: Verify the created payment type appears in the list of all payment types
        await test.step('Step 2: Verify the Payment Type is in the list of all payment types', async () => {
            const getAllResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/payment-types?page=0&size=100&sortField=createdAt&sortOrder=desc&name=${paymentTypeName}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(getAllResponse, testInfo, 'GET');
            const getAllStatusCode = getAllResponse.status();
            expect(getAllStatusCode).toBe(200);

            const responseBody = await getAllResponse.json();

            expect.soft(responseBody[0]).toHaveProperty('_id', paymentTypeId);
        });

        // Step 3: Verify the Created Payment Type with GET
        await test.step('Step 3: Verify the Created Payment Type with GET', async () => {
            const getCreatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/payment-types/${paymentTypeId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(getCreatedResponse, testInfo, 'GET');
            const getCreatedStatusCode = getCreatedResponse.status();
            expect(getCreatedStatusCode).toBe(200);

            const getCreatedBody = await getCreatedResponse.json();
            expect.soft(getCreatedBody).toHaveProperty('_id', paymentTypeId);
            expect.soft(getCreatedBody.name[0]).toHaveProperty('text', paymentTypeName); // Verifying translated text
            expect.soft(getCreatedBody.name[0]).toHaveProperty('language', 'en'); // Verifying language
            console.log(`Verified Payment Type via GET: ${paymentTypeId}`);
        });

        // Step 4: Update the Payment Type using PATCH
        await test.step('Step 4: Update the Payment Type using PATCH', async () => {
            updatedPaymentTypeName = `${paymentTypeName} - Updated`;

            const patchResponse = await request.patch(`https://${config.nucleusPortalServiceUri}/api/v1/payment-types/${paymentTypeId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                    'Content-Type': 'application/json',
                },
                data: {
                    name: [
                        {
                            language: 'en',
                            text: updatedPaymentTypeName,
                        },
                    ],
                },
            });

            await logResponse(patchResponse, testInfo, 'PATCH');
            const patchStatusCode = patchResponse.status();
            expect(patchStatusCode).toBe(204);

            console.log(`Updated Payment Type Name via PATCH: ${updatedPaymentTypeName}`);
        });

        // Step 5: Verify the Updated Payment Type with GET
        await test.step('Step 5: Verify the Updated Payment Type with GET', async () => {
            const getUpdatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/payment-types/${paymentTypeId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(getUpdatedResponse, testInfo, 'GET');
            const getUpdatedStatusCode = getUpdatedResponse.status();
            expect(getUpdatedStatusCode).toBe(200);

            const getUpdatedBody = await getUpdatedResponse.json();
            expect(getUpdatedBody).toHaveProperty('_id', paymentTypeId);
            expect(getUpdatedBody.name[0]).toHaveProperty('text', updatedPaymentTypeName); // Verifying translated text
            expect(getUpdatedBody.name[0]).toHaveProperty('language', 'en'); // Verifying language
            console.log(`Verified Updated Payment Type via GET: ${paymentTypeId}`);
        });

        // Step 6: Delete the Payment Type
        await test.step('Step 6: Delete the Payment Type', async () => {
            const deleteResponse = await request.delete(`https://${config.nucleusPortalServiceUri}/api/v1/payment-types/${paymentTypeId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(deleteResponse, testInfo, 'DELETE');
            const deleteStatusCode = deleteResponse.status();
            expect(deleteStatusCode).toBe(204);

            console.log(`Payment Type with ID ${paymentTypeId} has been deleted successfully.`);
        });

        // Step 7: Verify the Deletion with GET
        await test.step('Step 7: Verify the Deletion with GET', async () => {
            const getAfterDeleteResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/payment-types/${paymentTypeId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(getAfterDeleteResponse, testInfo, 'GET');
            const getAfterDeleteStatusCode = getAfterDeleteResponse.status();
            expect(getAfterDeleteStatusCode).toBe(404); // Not Found

            console.log(`Verified Payment Type Deletion (404): ${paymentTypeId}`);
        });
    });
});