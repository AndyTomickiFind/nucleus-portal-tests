import { expect, test } from '@playwright/test';
import { logResponse } from '../../../src/logger';
import config from "../../../playwright.config";

test.describe(`CRUD e2e API insuranceProviders - ${config.name}`, { tag: [`@${config.name}`] }, () => {
    let insuranceProviderId: string;
    let insuranceProviderName: string;
    let updatedInsuranceProviderName: string;

    test(`CRUD operations executed sequentially`, async ({ request }, testInfo) => {
        // Step 1: Create a New Insurance Provider
        await test.step('Step 1: Create a New Insurance Provider', async () => {
            insuranceProviderName = `[QA] Insurance Provider created by robots ${crypto.randomUUID()}`;
            const createResponse = await request.post(`https://${config.nucleusPortalServiceUri}/api/v1/insurance-providers`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                },
                data: {
                    "name": [
                        {
                            "language": "en",
                            "text": `${insuranceProviderName}`
                        }
                    ]
                }
            });

            await logResponse(createResponse, testInfo, "POST");
            const createStatusCode = createResponse.status();
            expect(createStatusCode).toBe(201);

            const responseBody = await createResponse.json();
            insuranceProviderId = responseBody._id;
            expect(insuranceProviderId).toBeTruthy();
            expect.soft(responseBody.name[0].text).toBe(insuranceProviderName);
            console.log(`Created Insurance Provider ID: ${insuranceProviderId}`);
        });

        // Step 2: Verify the Created Insurance Provider with GET
        await test.step('Step 2: Verify the Created Insurance Provider with GET', async () => {
            const getCreatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/insurance-providers/${insuranceProviderId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getCreatedResponse, testInfo, "GET");
            const getCreatedStatusCode = getCreatedResponse.status();
            expect(getCreatedStatusCode).toBe(200);

            const getCreatedBody = await getCreatedResponse.json();
            expect.soft(getCreatedBody).toHaveProperty('_id', insuranceProviderId);
            expect.soft(getCreatedBody.name[0]).toHaveProperty('text', insuranceProviderName);
            console.log(`Verified Insurance Provider via GET: ${insuranceProviderId}`);
        });

        // Step 3: Update the Insurance Provider using PATCH
        await test.step('Step 3: Update the Insurance Provider using PATCH', async () => {
            updatedInsuranceProviderName = `${insuranceProviderName} - Updated`;

            const patchResponse = await request.patch(`https://${config.nucleusPortalServiceUri}/api/v1/insurance-providers/${insuranceProviderId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                },
                data: {
                    "name": [
                        {
                            "language": "en",
                            "text": `${updatedInsuranceProviderName}`
                        }
                    ]
                }
            });

            await logResponse(patchResponse, testInfo, "PATCH");
            const patchStatusCode = patchResponse.status();
            expect(patchStatusCode).toBe(204);

            console.log(`Updated Insurance Provider Name via PATCH: ${updatedInsuranceProviderName}`);
        });

        // Step 4: Verify the Updated Insurance Provider with GET
        await test.step('Step 4: Verify the Updated Insurance Provider with GET', async () => {
            const getUpdatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/insurance-providers/${insuranceProviderId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getUpdatedResponse, testInfo, "GET");
            const getUpdatedStatusCode = getUpdatedResponse.status();
            expect(getUpdatedStatusCode).toBe(200);

            const getUpdatedBody = await getUpdatedResponse.json();
            expect(getUpdatedBody).toHaveProperty('_id', insuranceProviderId);
            expect(getUpdatedBody.name[0]).toHaveProperty('text', updatedInsuranceProviderName);
            console.log(`Verified Updated Insurance Provider via GET: ${insuranceProviderId}`);
        });

        // Step 5: Delete the Insurance Provider
        await test.step('Step 5: Delete the Insurance Provider', async () => {
            const deleteResponse = await request.delete(`https://${config.nucleusPortalServiceUri}/api/v1/insurance-providers/${insuranceProviderId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(deleteResponse, testInfo, "DELETE");
            const deleteStatusCode = deleteResponse.status();
            expect(deleteStatusCode).toBe(204);

            console.log(`Insurance Provider with ID ${insuranceProviderId} has been deleted successfully.`);
        });

        // Step 6: Verify the Deletion with GET
        await test.step('Step 6: Verify the Deletion with GET', async () => {
            const getAfterDeleteResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/insurance-providers/${insuranceProviderId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getAfterDeleteResponse, testInfo, "GET");
            const getAfterDeleteStatusCode = getAfterDeleteResponse.status();
            expect(getAfterDeleteStatusCode).toBe(404); // Not Found

            console.log(`Verified Insurance Provider Deletion (404): ${insuranceProviderId}`);
        });
    });
});