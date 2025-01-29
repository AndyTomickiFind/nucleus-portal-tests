import {expect, test} from '@playwright/test';
import {logResponse} from '../../../src/logger';
import config from "../../../playwright.config";

test.describe(`CRUD e2e API communitySocial - ${config.name}`, {tag: [`@${config.name}`]}, () => {
    let communitySocialId: string;
    let communitySocialName: string;
    let updatedCommunitySocialName: string;

    test(`CRUD operations executed sequentially`, async ({request}, testInfo) => {
        // Step 1: Create a New Community Social
        await test.step('Step 1: Create a New Community Social', async () => {
            communitySocialName = `[QA] Community Social created by robots ${crypto.randomUUID()}`;
            const createResponse = await request.post(`https://${config.nucleusPortalServiceUri}/api/v1/community-socials`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                },
                data: {
                    "name": [
                        {
                            "language": "en",
                            "text": `${communitySocialName}`
                        }
                    ]
                }
            });

            await logResponse(createResponse, testInfo, "POST");
            const createStatusCode = createResponse.status();
            expect(createStatusCode).toBe(201);

            const responseBody = await createResponse.json();
            communitySocialId = responseBody._id;
            expect(communitySocialId).toBeTruthy();
            expect.soft(responseBody.name[0].text).toBe(communitySocialName);
            console.log(`Created Community Social ID: ${communitySocialId}`);
        });

        // Step 2: Verify the Created Community Social with GET
        await test.step('Step 2: Verify the Created Community Social with GET', async () => {
            const getCreatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/community-socials/${communitySocialId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getCreatedResponse, testInfo, "GET");
            const getCreatedStatusCode = getCreatedResponse.status();
            expect(getCreatedStatusCode).toBe(200);

            const getCreatedBody = await getCreatedResponse.json();
            expect.soft(getCreatedBody).toHaveProperty('_id', communitySocialId);
            expect.soft(getCreatedBody.name[0]).toHaveProperty('text', communitySocialName);
            console.log(`Verified Community Social via GET: ${communitySocialId}`);
        });

        // Step 3: Update the Community Social using PATCH
        await test.step('Step 3: Update the Community Social using PATCH', async () => {
            updatedCommunitySocialName = `${communitySocialName} - Updated`;

            const patchResponse = await request.patch(`https://${config.nucleusPortalServiceUri}/api/v1/community-socials/${communitySocialId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                },
                data: {
                    "name": [{
                        "_id": "679a16b88fcd7847637bba71",
                        "language": "en",
                        "text": `${updatedCommunitySocialName}`
                    }]
                }
            });

            await logResponse(patchResponse, testInfo, "PATCH");
            const patchStatusCode = patchResponse.status();
            expect(patchStatusCode).toBe(204);

            console.log(`Updated Community Social Name via PATCH: ${updatedCommunitySocialName}`);
        });

        // Step 4: Verify the Updated Community Social with GET
        await test.step('Step 4: Verify the Updated Community Social with GET', async () => {
            const getUpdatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/community-socials/${communitySocialId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getUpdatedResponse, testInfo, "GET");
            const getUpdatedStatusCode = getUpdatedResponse.status();
            expect(getUpdatedStatusCode).toBe(200);

            const getUpdatedBody = await getUpdatedResponse.json();
            expect(getUpdatedBody).toHaveProperty('_id', communitySocialId);
            expect(getUpdatedBody).toHaveProperty('name[0].text', updatedCommunitySocialName);
            console.log(`Verified Updated Community Social via GET: ${communitySocialId}`);
        });

        // Step 5: Delete the Community Social
        await test.step('Step 5: Delete the Community Social', async () => {
            const deleteResponse = await request.delete(`https://${config.nucleusPortalServiceUri}/api/v1/community-socials/${communitySocialId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(deleteResponse, testInfo, "DELETE");
            const deleteStatusCode = deleteResponse.status();
            expect(deleteStatusCode).toBe(204);

            console.log(`Community Social with ID ${communitySocialId} has been deleted successfully.`);
        });

        // Step 6: Verify the Deletion with GET
        await test.step('Step 6: Verify the Deletion with GET', async () => {
            const getAfterDeleteResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/community-socials/${communitySocialId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getAfterDeleteResponse, testInfo, "GET");
            const getAfterDeleteStatusCode = getAfterDeleteResponse.status();
            expect(getAfterDeleteStatusCode).toBe(404); // Not Found

            console.log(`Verified Community Social Deletion (404): ${communitySocialId}`);
        });
    });
});