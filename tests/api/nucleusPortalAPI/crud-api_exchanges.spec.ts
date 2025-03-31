import { expect, test } from '@playwright/test';
import { logResponse } from '../../../src/logger';
import config from "../../../playwright.config";

test.describe(`CRUD e2e API exchanges - ${config.name}`, { tag: [`@${config.name}`] }, () => {
    let exchangeId: string;
    let exchangeName: string;

    test(`CRUD operations executed sequentially`, async ({ request }, testInfo) => {
        // Step 1: Create a New Exchange
        await test.step('Step 1: Create a New Exchange', async () => {
            exchangeName = `[QA] Exchange created by robots ${crypto.randomUUID()}`;
            const createPayload = {
                "domains": [`${config.defaultDomainId}`],
                "contentLanguagesCodes": ["en"],
                "name": exchangeName,
                "landingPageUrl": "https://landing-page",
                "homepageUrl": "https://home-page",
                "logo": { "url": "/images/logos/1739968292252_67b5cf244cb9582fe0463409.webp" },
                "homepageImageMobile": { "url": "/images/logos/1739968294177_67b5cf264cb9582fe046340d.webp" },
                "homepageImageDesktop": { "url": "/images/logos/1739968293897_67b5cf254cb9582fe046340b.jpg" },
                "otherExchangeFeatures": "no",
                "phoneNumber": "",
                "owner": "QA",
                "termsAndConditions": "https://hot-terms-and-conditioners",
                "headquarter": "660bd00b53314b10fc9c0052",
                "supportEmails": [],
                "allowedCountries": [],
                "excludedCountries":["AF","RU","US"],
                "availabilityHours": 24,
                "availabilityDays": 7,
                "interfaceCleanlinessScore": 2,
                "mobileExperienceScore": 4,
                "minimumDeposit": 42,
                "designScore": 3,
                "finalRating": 5,
                "supportAccessibilityScore": 2,
                "interfaceFluidityScore": 1,
                "supportEfficiencyScore": 3,
                "yearFounded": 2025,
                "mobileApp": false,
                "liveChatSupport": false,
                "liveChatAvailability": false,
                "kycAml": [{ "language": "en", "text": "EN" }],
                "featuredSnippet": [],
                "promotion": [{ "language": "en", "text": "EN" }],
                "fees": [
                    {
                        "productPaymentMethod": [{ "language": "en", "text": "EN" }],
                        "typeOfFee": [{ "language": "en", "text": "EN" }]
                    }
                ],
                "reviewedBy": { "shortBio": [], "name": "" },
                "insurance": { "condition": [], "eventsCovered": [] },
                "prosCons": { "pros": [], "cons": [] },
                "products": ["666bef37da2f46ee38ac95d5"],
                "coins": ["675859de5e46917e950c9d86", "675859585e46917e950c97da"],
                "cryptoPairs": ["6799ff5a8fcd78476375a3fb"],
                "currencies": [],
                "siteLanguages": ["65f49a7c06037feabc18f0f7"],
                "supportLanguages": ["65f49a7c06037feabc18f0f7"],
                "contactMethods": ["675970e227b4c437fa48f43f"],
                "depositMethods": ["666bf079da2f46ee38acce3b"],
                "depositCurrencies": ["65f49a7c06037feabc18ee9e"],
                "withdrawalMethods": ["666bf14eda2f46ee38ad0727"],
                "licenses": ["65f49a7c06037feabc18f2eb"],
                "supportIssues": ["666bf1adda2f46ee38ad17f3"],
                "securityMethods": ["673c9a477e8b87fc195817ca"],
                "communitySocials": ["679a249c8fcd784763a0469f"],
                "orderTypesAvailable": ["679a2a588fcd784763a150d3"],
                "educationalResources": ["679a2efd8fcd784763a253a7"],
                "registrationSteps": ["666bf1adda2f46ee38ad18b9"],
                "affiliateLinks": [
                    {
                        "affiliateLinkUrl": "https://aff-link-per-dimension",
                        "dimensions": [{ "type": "domains", "ids": [`${config.defaultDomainId}`] }]
                    }
                ],
                "status": "published"
            };

            const createResponse = await request.post(`https://${config.nucleusPortalServiceUri}/api/v1/exchanges`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                },
                data: createPayload
            });

            await logResponse(createResponse, testInfo, "POST");
            const createStatusCode = createResponse.status();
            expect(createStatusCode).toBe(201);

            const responseBody = await createResponse.json();
            exchangeId = responseBody._id;
            expect(exchangeId).toBeTruthy();
            console.log(`Created Exchange ID: ${exchangeId}`);
        });

        // Step 2: Verify the Created Exchange with GET
        await test.step('Step 2: Verify the Created Exchange with GET', async () => {
            const getCreatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/exchanges/${exchangeId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getCreatedResponse, testInfo, "GET");
            const getCreatedStatusCode = getCreatedResponse.status();
            expect(getCreatedStatusCode).toBe(200);

            const getCreatedBody = await getCreatedResponse.json();
            expect(getCreatedBody).toHaveProperty('_id', exchangeId);
            expect(getCreatedBody.name).toBe(exchangeName);
            console.log(`Verified Exchange via GET: ${exchangeId}`);
        });

        // Step 3: Update the Exchange using PATCH
        await test.step('Step 3: Update the Exchange using PATCH', async () => {
            const updatedExchangeName = `${exchangeName} - Updated`;
            const patchPayload = {
                "domains": [`${config.defaultDomainId}`], // Retain the same domains
                "contentLanguagesCodes": ["en"], // Retain the same language codes
                "name": updatedExchangeName, // Update the name
                "finalRating": 4, // Update the rating
                "status": "published"
            };

            const patchResponse = await request.patch(`https://${config.nucleusPortalServiceUri}/api/v1/exchanges/${exchangeId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                },
                data: patchPayload
            });

            await logResponse(patchResponse, testInfo, "PATCH");
            const patchStatusCode = patchResponse.status();
            expect(patchStatusCode).toBe(204);

            exchangeName = updatedExchangeName;
            console.log(`Updated Exchange: Name - ${exchangeName}`);
        });

        // Step 4: Verify the Updated Exchange with GET
        await test.step('Step 4: Verify the Updated Exchange with GET', async () => {
            const getUpdatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/exchanges/${exchangeId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getUpdatedResponse, testInfo, "GET");
            const getUpdatedStatusCode = getUpdatedResponse.status();
            expect(getUpdatedStatusCode).toBe(200);

            const getUpdatedBody = await getUpdatedResponse.json();
            expect(getUpdatedBody).toHaveProperty('_id', exchangeId);
            expect(getUpdatedBody.name).toBe(exchangeName);
            console.log(`Verified Updated Exchange via GET: ${exchangeId}`);
        });

        //Step 5: Delete the Exchange
        await test.step('Step 5: Delete the Exchange', async () => {
            const deleteResponse = await request.delete(`https://${config.nucleusPortalServiceUri}/api/v1/exchanges/${exchangeId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(deleteResponse, testInfo, "DELETE");
            const deleteStatusCode = deleteResponse.status();
            expect(deleteStatusCode).toBe(204);

            console.log(`Exchange with ID ${exchangeId} has been deleted successfully.`);
        });

        // Step 6: Verify the Deletion with GET
        await test.step('Step 6: Verify the Deletion with GET', async () => {
            const getAfterDeleteResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/exchanges/${exchangeId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getAfterDeleteResponse, testInfo, "GET");
            const getAfterDeleteStatusCode = getAfterDeleteResponse.status();
            expect(getAfterDeleteStatusCode).toBe(404);

            console.log(`Verified Exchange Deletion (404): ${exchangeId}`);
        });
    });
});