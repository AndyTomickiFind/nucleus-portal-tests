import { expect, test } from '@playwright/test';
import { logResponse } from '../../../src/logger';
import config from '../../../playwright.config';

test.describe(`CRUD e2e API deposit methods - ${config.name}`, { tag: [`@${config.name}`] }, () => {
    let depositMethodId: string;
    let depositMethodName: string;
    let updatedDepositMethodName: string;
    let logo: string;

    test(`CRUD operations executed sequentially`, async ({ request }, testInfo) => {
        // Step 1: Create a New Deposit Method
        await test.step('Step 1: Create a New Deposit Method', async () => {
            depositMethodName = `[QA] RoboDeposit - ${crypto.randomUUID()}`;
            logo = `logo_${Math.floor(Math.random() * 1000)}`; // Example logo placeholder

            const createResponse = await request.post(`https://${config.nucleusPortalServiceUri}/api/v1/deposit-methods`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                    'Content-Type': 'application/json',
                },
                data: {
                    name: [
                        {
                            language: 'en',
                            text: depositMethodName,
                        },
                    ],
                    type: `65f49a7b06037feabc18e1cd`,
                    logo: logo,
                },
            });

            await logResponse(createResponse, testInfo, 'POST');
            const createStatusCode = createResponse.status();
            expect(createStatusCode).toBe(201);

            const responseBody = await createResponse.json();
            depositMethodId = responseBody._id;
            expect(depositMethodId).toBeTruthy();
            expect.soft(responseBody.name[0].text).toBe(depositMethodName);
            expect.soft(responseBody.type).toBe("65f49a7b06037feabc18e1cd");
            expect.soft(responseBody.logo).toBe(logo);
            console.log(`Created Deposit Method ID: ${depositMethodId}`);
        });

        // Step 2: Verify the created deposit method appears in the list of all deposit methods
        await test.step('Step 2: Verify the Deposit Method is in the list of all deposit methods', async () => {
            const getAllResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/deposit-methods?page=0&size=100&sortField=createdAt&sortOrder=desc`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(getAllResponse, testInfo, 'GET');
            const getAllStatusCode = getAllResponse.status();
            expect(getAllStatusCode).toBe(200);

            const allDepositMethodsResponse = await getAllResponse.json();
            const allDepositMethods = allDepositMethodsResponse.items;

            const found = allDepositMethods.some((method) => method._id === depositMethodId);
            expect(found, `New Deposit Method is in the list of all deposit methods: ${depositMethodId}`).toBe(true);
        });

        // Step 3: Verify the Created Deposit Method with GET
        await test.step('Step 3: Verify the Created Deposit Method with GET', async () => {
            const getCreatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/deposit-methods/${depositMethodId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(getCreatedResponse, testInfo, 'GET');
            const getCreatedStatusCode = getCreatedResponse.status();
            expect(getCreatedStatusCode).toBe(200);

            const getCreatedBody = await getCreatedResponse.json();
            expect.soft(getCreatedBody).toHaveProperty('_id', depositMethodId);
            expect.soft(getCreatedBody.name[0]).toHaveProperty('text', depositMethodName);
            expect.soft(getCreatedBody.name[0]).toHaveProperty('language', 'en');
            expect.soft(getCreatedBody).toHaveProperty('type', "65f49a7b06037feabc18e1cd");
            expect.soft(getCreatedBody).toHaveProperty('logo', logo);
            console.log(`Verified Deposit Method via GET: ${depositMethodId}`);
        });

        // Step 4: Update the Deposit Method using PATCH
        await test.step('Step 4: Update the Deposit Method using PATCH', async () => {
            updatedDepositMethodName = `${depositMethodName} - Updated`;

            const patchResponse = await request.patch(`https://${config.nucleusPortalServiceUri}/api/v1/deposit-methods/${depositMethodId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                    'Content-Type': 'application/json',
                },
                data: {
                    name: [
                        {
                            language: 'en',
                            text: updatedDepositMethodName,
                        },
                    ],
                    type: `65f49a7b06037feabc18e1cd`,
                    logo: `${logo}_updated`,
                },
            });

            await logResponse(patchResponse, testInfo, 'PATCH');
            const patchStatusCode = patchResponse.status();
            expect(patchStatusCode).toBe(204);

            console.log(`Updated Deposit Method Name via PATCH: ${updatedDepositMethodName}`);
        });

        // Step 5: Verify the Updated Deposit Method with GET
        await test.step('Step 5: Verify the Updated Deposit Method with GET', async () => {
            const getUpdatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/deposit-methods/${depositMethodId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(getUpdatedResponse, testInfo, 'GET');
            const getUpdatedStatusCode = getUpdatedResponse.status();
            expect(getUpdatedStatusCode).toBe(200);

            const getUpdatedBody = await getUpdatedResponse.json();
            expect(getUpdatedBody).toHaveProperty('_id', depositMethodId);
            expect(getUpdatedBody.name[0]).toHaveProperty('text', updatedDepositMethodName);
            expect(getUpdatedBody).toHaveProperty('type', `65f49a7b06037feabc18e1cd`);
            expect(getUpdatedBody).toHaveProperty('logo', `${logo}_updated`);
            console.log(`Verified Updated Deposit Method via GET: ${depositMethodId}`);
        });

        // Step 6: Delete the Deposit Method
        await test.step('Step 6: Delete the Deposit Method', async () => {
            const deleteResponse = await request.delete(`https://${config.nucleusPortalServiceUri}/api/v1/deposit-methods/${depositMethodId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(deleteResponse, testInfo, 'DELETE');
            const deleteStatusCode = deleteResponse.status();
            expect(deleteStatusCode).toBe(204);

            console.log(`Deposit Method with ID ${depositMethodId} has been deleted successfully.`);
        });

        // Step 7: Verify the Deletion with GET
        await test.step('Step 7: Verify the Deletion with GET', async () => {
            const getAfterDeleteResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/deposit-methods/${depositMethodId}`, {
                headers: {
                    Authorization: `${config.nucleusPortalToken}`,
                },
            });

            await logResponse(getAfterDeleteResponse, testInfo, 'GET');
            const getAfterDeleteStatusCode = getAfterDeleteResponse.status();
            expect(getAfterDeleteStatusCode).toBe(404); // Not Found

            console.log(`Verified Deposit Method Deletion (404): ${depositMethodId}`);
        });
    });
});