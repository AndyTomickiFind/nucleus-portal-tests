import {expect, test} from '@playwright/test';
import {logResponse} from '../../../src/logger';
import config from "../../../playwright.config";

test.describe(`CRUD e2e API coins - ${config.name}`, {tag: [`@${config.name}`]}, () => {
    let coinId: string;
    let coinName: string;
    let updatedCoinName: string;
    let shortName: string;

    test(`CRUD operations executed sequentially`, async ({request}, testInfo) => {
        //Step 1: Create a New Coin
        await test.step('Step 1: Create a New Coin', async () => {
            coinName = `[QA] RoboCoin - ${crypto.randomUUID()}`;
            shortName = `[QA]SHRT-${Math.floor(Math.random() * 1000)}`;
            const createResponse = await request.post(`https://${config.nucleusPortalServiceUri}/api/v1/coins`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                },
                data: {
                    "name": [
                        {
                            "language": "en",
                            "text": coinName  // Setting coin name
                        }
                    ],
                    "shortName": shortName,
                    "logo": "no_logo", // Default logo
                    "priority": 1, // Default priority
                    "numberOfSites": 0 // Default number of sites
                }
            });

            await logResponse(createResponse, testInfo, "POST");
            const createStatusCode = createResponse.status();
            expect(createStatusCode).toBe(201);

            const responseBody = await createResponse.json();
            coinId = responseBody._id;
            expect(coinId).toBeTruthy();
            expect.soft(responseBody.name[0].text).toBe(coinName);
            expect.soft(responseBody.shortName).toBe(shortName);
            console.log(`Created Coin ID: ${coinId}`);
        });

        // Step 2: Verify the created coin appears in the list of all coins
        await test.step('Step 2: Verify the Coin is in the list of all coins', async () => {
            const getAllResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/coins?page=0&size=100&sortField=createdAt&sortOrder=desc&shortName=SHRT`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                },
                data: {
                    "name": [
                        {
                            "language": "en",
                            "text": coinName
                        }
                    ],
                    "shortName": shortName,
                    "logo": "no_logo",
                    "priority": 1,
                    "numberOfSites": 0
                }
            });

            await logResponse(getAllResponse, testInfo, "GET");
            const getAllStatusCode = getAllResponse.status();
            expect(getAllStatusCode).toBe(200);

            const allCoinsResponse = await getAllResponse.json();
            const allCoins = allCoinsResponse.items;

            const found = allCoins.some((coin) => coin._id === coinId);
            expect(found, `New Coin is in the list of all coins: ${coinId}`).toBe(true);
        });


        // Step 3: Verify the Created Coin with GET
        await test.step('Step 3: Verify the Created Coin with GET', async () => {
            const getCreatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/coins/${coinId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getCreatedResponse, testInfo, "GET");
            const getCreatedStatusCode = getCreatedResponse.status();
            expect(getCreatedStatusCode).toBe(200);

            const getCreatedBody = await getCreatedResponse.json();
            expect.soft(getCreatedBody).toHaveProperty('_id', coinId);
            expect.soft(getCreatedBody.name[0]).toHaveProperty('text', coinName);
            expect.soft(getCreatedBody).toHaveProperty('shortName', shortName);
            console.log(`Verified Coin via GET: ${coinId}`);
        });

        // Step 4: Update the Coin using PATCH
        await test.step('Step 4: Update the Coin using PATCH', async () => {
            updatedCoinName = `${coinName} - Updated`;

            const patchResponse = await request.patch(`https://${config.nucleusPortalServiceUri}/api/v1/coins/${coinId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                },
                data: {
                    "name": [
                        {
                            "language": "en",
                            "text": `${updatedCoinName}`
                        }
                    ],
                    "shortName": `${shortName}-UPD`, // Example update to short name
                    "priority": 2 // Updated priority
                }
            });

            await logResponse(patchResponse, testInfo, "PATCH");
            const patchStatusCode = patchResponse.status();
            expect(patchStatusCode).toBe(204);

            console.log(`Updated Coin Name via PATCH: ${updatedCoinName}`);
        });

        // Step 5: Verify the Updated Coin with GET
        await test.step('Step 5: Verify the Updated Coin with GET', async () => {
            const getUpdatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/coins/${coinId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getUpdatedResponse, testInfo, "GET");
            const getUpdatedStatusCode = getUpdatedResponse.status();
            expect(getUpdatedStatusCode).toBe(200);

            const getUpdatedBody = await getUpdatedResponse.json();
            expect(getUpdatedBody).toHaveProperty('_id', coinId);
            expect(getUpdatedBody.name[0]).toHaveProperty('text', updatedCoinName);
            console.log(`Verified Updated Coin via GET: ${coinId}`);
        });

        // Step 6: Delete the Coin
        await test.step('Step 6: Delete the Coin', async () => {
            const deleteResponse = await request.delete(`https://${config.nucleusPortalServiceUri}/api/v1/coins/${coinId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(deleteResponse, testInfo, "DELETE");
            const deleteStatusCode = deleteResponse.status();
            expect(deleteStatusCode).toBe(204);

            console.log(`Coin with ID ${coinId} has been deleted successfully.`);
        });

        // Step 7: Verify the Deletion with GET
        await test.step('Step 7: Verify the Deletion with GET', async () => {
            const getAfterDeleteResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/coins/${coinId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getAfterDeleteResponse, testInfo, "GET");
            const getAfterDeleteStatusCode = getAfterDeleteResponse.status();
            expect(getAfterDeleteStatusCode).toBe(404); // Not Found

            console.log(`Verified Coin Deletion (404): ${coinId}`);
        });
    });
});
