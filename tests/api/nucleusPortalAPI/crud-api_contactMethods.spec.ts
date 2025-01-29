import {expect, test} from '@playwright/test';
import {logResponse} from '../../../src/logger';
import config from "../../../playwright.config";

test.describe(`CRUD e2e API contactMethod - ${config.name}`, {tag: [`@${config.name}`]}, () => {
    let contactMethodId: string;
    let contactMethodName: string;
    let updatedContactMethodName: string;

    test(`CRUD operations executed sequentially`, async ({request}, testInfo) => {
        // Step 1: Create a New Contact Method
        await test.step('Step 1: Create a New Contact Method', async () => {
            contactMethodName = `[QA] Contact Method created by robots ${crypto.randomUUID()}`;
            const createResponse = await request.post(`https://${config.nucleusPortalServiceUri}/api/v1/contact-methods`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                },
                data: {
                    "name": [
                        {
                            //"_id": "60d6c7f9f9d4b2b6c1ec55ea",
                            "language": "en",
                            "text": `${contactMethodName}`
                        }
                    ]
                }
            });

            await logResponse(createResponse, testInfo, "POST");
            const createStatusCode = createResponse.status();
            expect(createStatusCode).toBe(201);

            const responseBody = await createResponse.json();
            contactMethodId = responseBody._id;
            expect(contactMethodId).toBeTruthy();
            expect.soft(responseBody.name[0].text).toBe(contactMethodName);
            console.log(`Created Contact Method ID: ${contactMethodId}`);
        });

        // Step 2: Verify the Created Contact Method with GET
        await test.step('Step 2: Verify the Created Contact Method with GET', async () => {
            const getCreatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/contact-methods/${contactMethodId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getCreatedResponse, testInfo, "GET");
            const getCreatedStatusCode = getCreatedResponse.status();
            expect(getCreatedStatusCode).toBe(200);

            const getCreatedBody = await getCreatedResponse.json();
            expect.soft(getCreatedBody).toHaveProperty('_id', contactMethodId);
            expect.soft(getCreatedBody.name[0]).toHaveProperty('text', contactMethodName);
            console.log(`Verified Contact Method via GET: ${contactMethodId}`);
        });

        // Step 3: Update the Contact Method using PATCH
        await test.step('Step 3: Update the Contact Method using PATCH', async () => {
            updatedContactMethodName = `${contactMethodName} - Updated`;

            const patchResponse = await request.patch(`https://${config.nucleusPortalServiceUri}/api/v1/contact-methods/${contactMethodId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                },
                data: {
                    "name": [{
                        "_id": "679a16b88fcd7847637bba71",
                        "language": "en",
                        "text": `${updatedContactMethodName}`
                    }]
                }
            });

            await logResponse(patchResponse, testInfo, "PATCH");
            const patchStatusCode = patchResponse.status();
            expect(patchStatusCode).toBe(204);

            console.log(`Updated Contact Method Name via PATCH: ${updatedContactMethodName}`);
        });

        // Step 4: Verify the Updated Contact Method with GET
        await test.step('Step 4: Verify the Updated Contact Method with GET', async () => {
            const getUpdatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/contact-methods/${contactMethodId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getUpdatedResponse, testInfo, "GET");
            const getUpdatedStatusCode = getUpdatedResponse.status();
            expect(getUpdatedStatusCode).toBe(200);

            const getUpdatedBody = await getUpdatedResponse.json();
            expect(getUpdatedBody).toHaveProperty('_id', contactMethodId);
            expect(getUpdatedBody).toHaveProperty('name[0].text', updatedContactMethodName);
            console.log(`Verified Updated Contact Method via GET: ${contactMethodId}`);
        });

        // Step 5: Delete the Contact Method
        await test.step('Step 5: Delete the Contact Method', async () => {
            const deleteResponse = await request.delete(`https://${config.nucleusPortalServiceUri}/api/v1/contact-methods/${contactMethodId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(deleteResponse, testInfo, "DELETE");
            const deleteStatusCode = deleteResponse.status();
            expect(deleteStatusCode).toBe(204);

            console.log(`Contact Method with ID ${contactMethodId} has been deleted successfully.`);
        });

        // Step 6: Verify the Deletion with GET
        await test.step('Step 6: Verify the Deletion with GET', async () => {
            const getAfterDeleteResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/contact-methods/${contactMethodId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getAfterDeleteResponse, testInfo, "GET");
            const getAfterDeleteStatusCode = getAfterDeleteResponse.status();
            expect(getAfterDeleteStatusCode).toBe(404); // Not Found

            console.log(`Verified Contact Method Deletion (404): ${contactMethodId}`);
        });
    });
});
