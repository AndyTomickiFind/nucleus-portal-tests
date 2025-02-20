import { expect, test } from '@playwright/test';
import { logResponse } from '../../../src/logger';
import config from "../../../playwright.config";

test.describe(`CRUD e2e API educationalResources - ${config.name}`, { tag: [`@${config.name}`] }, () => {
    let educationalResourceId: string;
    let educationalResourceName: string;
    let updatedEducationalResourceName: string;

    test(`CRUD operations executed sequentially`, async ({ request }, testInfo) => {
        //  Step 1: Create a New Educational Resource
        await test.step('Step 1: Create a New Educational Resource', async () => {
            educationalResourceName = `[QA] Educational Resource created by robots ${crypto.randomUUID()}`;
            const createResponse = await request.post(`https://${config.nucleusPortalServiceUri}/api/v1/educational-resources`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                },
                data: {
                    "name": [
                        {
                            "language": "en",
                            "text": `${educationalResourceName}`
                        }
                    ]
                }
            });

            await logResponse(createResponse, testInfo, "POST");
            const createStatusCode = createResponse.status();
            expect(createStatusCode).toBe(201);

            const responseBody = await createResponse.json();
            educationalResourceId = responseBody._id;
            expect(educationalResourceId).toBeTruthy();
            expect.soft(responseBody.name[0].text).toBe(educationalResourceName);
            console.log(`Created Educational Resource ID: ${educationalResourceId}`);
        });

        // **NEW: Step 2 - Verify the created resource appears in the list of all resources**
        await test.step('Step 2: Verify the Educational Resource is in the list of all resources', async () => {
            const getAllResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/educational-resources`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getAllResponse, testInfo, "GET");
            const getAllStatusCode = getAllResponse.status();
            expect(getAllStatusCode).toBe(200);

            const allResources = await getAllResponse.json();
            const found = allResources.some((resource) => resource._id === educationalResourceId);
            expect(found, "New Educational Resource is in the list of all resources: ${educationalResourceId}").toBe(true);
        });

        // Step 3: Verify the Created Educational Resource with GET
        await test.step('Step 3: Verify the Created Educational Resource with GET', async () => {
            const getCreatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/educational-resources/${educationalResourceId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getCreatedResponse, testInfo, "GET");
            const getCreatedStatusCode = getCreatedResponse.status();
            expect(getCreatedStatusCode).toBe(200);

            const getCreatedBody = await getCreatedResponse.json();
            expect.soft(getCreatedBody).toHaveProperty('_id', educationalResourceId);
            expect.soft(getCreatedBody.name[0]).toHaveProperty('text', educationalResourceName);
            console.log(`Verified Educational Resource via GET: ${educationalResourceId}`);
        });

        // Step 4: Update the Educational Resource using PATCH
        await test.step('Step 4: Update the Educational Resource using PATCH', async () => {
            updatedEducationalResourceName = `${educationalResourceName} - Updated`;

            const patchResponse = await request.patch(`https://${config.nucleusPortalServiceUri}/api/v1/educational-resources/${educationalResourceId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                },
                data: {
                    "name": [
                        {
                            "language": "en",
                            "text": `${updatedEducationalResourceName}`
                        }
                    ]
                }
            });

            await logResponse(patchResponse, testInfo, "PATCH");
            const patchStatusCode = patchResponse.status();
            expect(patchStatusCode).toBe(204);

            console.log(`Updated Educational Resource Name via PATCH: ${updatedEducationalResourceName}`);
        });

        // Step 5: Verify the Updated Educational Resource with GET
        await test.step('Step 5: Verify the Updated Educational Resource with GET', async () => {
            const getUpdatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/educational-resources/${educationalResourceId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getUpdatedResponse, testInfo, "GET");
            const getUpdatedStatusCode = getUpdatedResponse.status();
            expect(getUpdatedStatusCode).toBe(200);

            const getUpdatedBody = await getUpdatedResponse.json();
            expect(getUpdatedBody).toHaveProperty('_id', educationalResourceId);
            expect(getUpdatedBody.name[0]).toHaveProperty('text', updatedEducationalResourceName);
            console.log(`Verified Updated Educational Resource via GET: ${educationalResourceId}`);
        });

        // Step 6: Delete the Educational Resource
        await test.step('Step 6: Delete the Educational Resource', async () => {
            const deleteResponse = await request.delete(`https://${config.nucleusPortalServiceUri}/api/v1/educational-resources/${educationalResourceId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(deleteResponse, testInfo, "DELETE");
            const deleteStatusCode = deleteResponse.status();
            expect(deleteStatusCode).toBe(204);

            console.log(`Educational Resource with ID ${educationalResourceId} has been deleted successfully.`);
        });

        // Step 7: Verify the Deletion with GET
        await test.step('Step 7: Verify the Deletion with GET', async () => {
            const getAfterDeleteResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/educational-resources/${educationalResourceId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getAfterDeleteResponse, testInfo, "GET");
            const getAfterDeleteStatusCode = getAfterDeleteResponse.status();
            expect(getAfterDeleteStatusCode).toBe(404); // Not Found

            console.log(`Verified Educational Resource Deletion (404): ${educationalResourceId}`);
        });
    });
});
