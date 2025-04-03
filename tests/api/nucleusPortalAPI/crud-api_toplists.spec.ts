import {expect, test} from '@playwright/test';
import {logResponse} from '../../../src/logger';
import config from "../../../playwright.config";

test.describe(`CRUD e2e API toplists - ${config.name}`, {tag: [`@${config.name}`]}, () => {
    let toplistId, casino1, casino2: string;
    let toplistName: string;
    let toplistDescription: string;

    test(`CRUD operations executed sequentially`, async ({request}, testInfo) => {

        // Step 1: Create a New Toplist
        await test.step('Step 1: Create a New Toplist', async () => {
            switch (process.env.TEST_ENV.toLowerCase()) {
                case "dev": {
                    casino1 = "67e3af40b5ff3179abe4a4db";
                    casino2 = "67e3af41b5ff3179abe4a4e8";
                    break
                }
                case "staging": {
                    casino1 = "67e3af946eb14bd77a43e1c2";
                    casino2 = "67e3af946eb14bd77a43e1cf";
                    break
                }
            }

            toplistName = `[QA] Sample Toplist Created by ${crypto.randomUUID()}`;
            toplistDescription = `Sample description ${crypto.randomUUID()}`;
            const createResponse = await request.post(`https://${config.nucleusPortalServiceUri}/api/v2/toplists`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                },
                data: {
                    "name": toplistName,
                    "description": toplistDescription,
                    "type": "casinos",
                    "subType": "default",
                    "excludedFrom": [],
                    "appliesToProducts": [
                        `${config.defaultDomainId}`
                    ],
                    "placementsCount": 2,
                    "defaultResults": [
                        `${casino1}`,
                        `${casino2}`
                    ],
                    "overrides": [],
                    "filters": {
                        "coins": [],
                        "products": [],
                        "licenses": [],
                        "currencies": [],
                        "depositMethods": [],
                        "sports": [],
                        "promotionTypes": [],
                        "anonymousPlay": false,
                        "provablyFair": false
                    }
                }
            });

            await logResponse(createResponse, testInfo, "POST");
            const createStatusCode = createResponse.status();
            expect(createStatusCode).toBe(201);

            const responseBody = await createResponse.json();
            toplistId = responseBody._id;
            expect(toplistId).toBeTruthy();
            console.log(`Created Toplist ID: ${toplistId}`);
        });

        // Step 2: Verify the Created Toplist with GET
        await test.step('Step 2: Verify the Created Toplist with GET', async () => {
            const getCreatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/toplists/${toplistId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getCreatedResponse, testInfo, "GET");
            const getCreatedStatusCode = getCreatedResponse.status();
            expect(getCreatedStatusCode).toBe(200);

            const getCreatedBody = await getCreatedResponse.json();
            expect.soft(getCreatedBody).toHaveProperty('_id', toplistId);
            expect.soft(getCreatedBody).toHaveProperty('excludedFrom');
            expect.soft(getCreatedBody.name).toBe(toplistName);
            expect.soft(getCreatedBody.description).toBe(toplistDescription);
            console.log(`Verified Toplist via GET: ${toplistId}`);
        });

        // Step 3: Update the Toplist using PATCH
        await test.step('Step 3: Update the Toplist using PATCH', async () => {
            const updatedToplistName = `${toplistName} - Updated`;
            const updatedDescription = `${toplistDescription} - Updated`;

            const patchResponse = await request.patch(`https://${config.nucleusPortalServiceUri}/api/v2/toplists/${toplistId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                },
                data: {
                    "name": updatedToplistName,
                    "description": updatedDescription
                }
            });

            await logResponse(patchResponse, testInfo, "PATCH");
            const patchStatusCode = patchResponse.status();
            expect(patchStatusCode).toBe(204);

            // Update local variables for validation later
            toplistName = updatedToplistName;
            toplistDescription = updatedDescription;
            console.log(`Updated Toplist: Name - ${toplistName} | Description - ${toplistDescription}`);
        });

        // Step 4: Verify the Updated Toplist with GET
        await test.step('Step 4: Verify the Updated Toplist with GET', async () => {
            const getUpdatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/toplists/${toplistId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getUpdatedResponse, testInfo, "GET");
            const getUpdatedStatusCode = getUpdatedResponse.status();
            expect(getUpdatedStatusCode).toBe(200);

            const getUpdatedBody = await getUpdatedResponse.json();
            expect(getUpdatedBody).toHaveProperty('_id', toplistId);
            expect(getUpdatedBody.name).toBe(toplistName);
            expect(getUpdatedBody.description).toBe(toplistDescription);
            console.log(`Verified Updated Toplist via GET: ${toplistId}`);
        });

        // Step 5: Delete the Toplist
        await test.step('Step 5: Delete the Toplist', async () => {
            const deleteResponse = await request.delete(`https://${config.nucleusPortalServiceUri}/api/v1/toplists/${toplistId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(deleteResponse, testInfo, "DELETE");
            const deleteStatusCode = deleteResponse.status();
            expect(deleteStatusCode).toBe(204);

            console.log(`Toplist with ID ${toplistId} has been deleted successfully.`);
        });

        // Step 6: Verify the Deletion with GET
        await test.step('Step 6: Verify the Deletion with GET', async () => {
            const getAfterDeleteResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v2/toplists/${toplistId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getAfterDeleteResponse, testInfo, "GET");
            const getAfterDeleteStatusCode = getAfterDeleteResponse.status();
            expect(getAfterDeleteStatusCode).toBe(404); // Not Found

            console.log(`Verified Toplist Deletion (404): ${toplistId}`);
        });
    });
});
