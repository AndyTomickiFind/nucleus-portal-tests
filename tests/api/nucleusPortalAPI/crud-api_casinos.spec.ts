import { expect, test } from '@playwright/test';
import { logResponse } from '../../../src/logger';
import config from "../../../playwright.config";

test.describe(`CRUD e2e API casinos - ${config.name}`, { tag: [`@${config.name}`] }, () => {
    let casinoId: string;
    let casinoName: string;

    test(`CRUD operations executed sequentially`, async ({ request }, testInfo) => {
        // Step 1: Create a New Casino
        await test.step('Step 1: Create a New Casino', async () => {
            casinoName = `[QA] Casino Created by ${crypto.randomUUID()}`;
            const createPayload = {
                "domains": [`${config.defaultDomainId}`],
                "contentLanguagesCodes": ["en"],
                "name": casinoName,
                "logo": "/images/logos/1739964616595_67b5c0c84cb9582fe03c13e6.webp",
                "logoBackground": "FFFFFF",
                "yearFounded": 2025,
                "rating": 4,
                "numberOfGames": 2,
                "freeSpins": null,
                "promoCode": "",
                "homepageUrl": "https://home-page",
                "sweepstakeCasino": false,
                "anonymousPlay": false,
                "endToEndCrypto": false,
                "provablyFair": false,
                "operatedBy": [],
                "registrationToDepositProcess": [],
                "termsAndConditions": "https://terms-and-conditions",
                "minimumDeposit": "",
                "allowedCountries": [],
                "reviewBy": { "shortBio": [], "position": [] },
                "wageringRequirements": [],
                "shortDescription": [],
                "description": [
                    {
                        "domainId": `${config.defaultDomainId}`,
                        "content": [{ "language": "en", "text": "English Description" }]
                    }
                ],
                "teaser": { "gambling": [], "casino": [], "sports": [] },
                "prosCons": { "red": [], "green": [] },
                "homepageImageDesktop": {
                    "title": [{ "language": "en", "text": "EN" }],
                    "description": [],
                    "caption": [],
                    "linkUrl": "",
                    "alt": "",
                    "imageType": "image/jpeg",
                    "subtype": "jpeg",
                    "filesize": 102689,
                    "filename": "Grand-Hyatt-Athens_cocktail-party_Acropolis_DSC07202.jpg",
                    "name": "Grand-Hyatt-Athens_cocktail-party_Acropolis_DSC07202",
                    "mimeType": "image/jpeg",
                    "urlImage": "/images/logos/1739964617432_67b5c0c94cb9582fe03c13e8.jpg"
                },
                "homepageImageMobile": {
                    "title": [{ "language": "en", "text": "EN" }],
                    "description": [],
                    "caption": [],
                    "linkUrl": "",
                    "alt": "",
                    "imageType": "image/jpeg",
                    "subtype": "jpeg",
                    "filesize": 463105,
                    "filename": "carnavalriodesfilecampea-25.jpg",
                    "name": "carnavalriodesfilecampea-25",
                    "mimeType": "image/jpeg",
                    "urlImage": "/images/logos/1739964617730_67b5c0c94cb9582fe03c13ea.jpg"
                },
                "topGames": [],
                "landingPageUrl": [
                    {
                        "domainId": `${config.defaultDomainId}`,
                        "url": "https://landing-page-QAGeneralTestDomain"
                    }
                ],
                "casinoBonuses": [
                    {
                        "domainId": `${config.defaultDomainId}`,
                        "hasNoBonus": true,
                        "bonusContent": [],
                        "bonuses": { "offers": [], "packages": [] }
                    }
                ],
                "products": ["67472e6115b3c618daee31bf"],
                "productCategories": ["65f49a7d06037feabc190bc1"],
                "coins": ["675859585e46917e950c97da", "675859de5e46917e950c9d86"],
                "currencies": [],
                "securityMethods": ["666bf1adda2f46ee38ad1806"],
                "languages": ["65f49a7c06037feabc18f0f7"],
                "supportLanguages": ["65f49a7c06037feabc18f0f7"],
                "depositMethods": ["666bf0c5da2f46ee38acdbc1"],
                "withdrawalMethods": ["666bf14eda2f46ee38ad0727"],
                "slotProviders": ["65f49a7c06037feabc18fe7a"],
                "sports": [],
                "licencesOwned": ["65f49a7c06037feabc18f2b5"],
                "affiliateUrl": [
                    {
                        "domainId": `${config.defaultDomainId}`,
                        "url": "https://general-affil-link-QAGeneralTestDomain"
                    }
                ],
                "affiliateLinks": []
            };

            const createResponse = await request.post(`https://${config.nucleusPortalServiceUri}/api/v1/casinos`, {
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
            casinoId = responseBody._id;
            expect(casinoId).toBeTruthy();
            console.log(`Created Casino ID: ${casinoId}`);
        });

        // Step 2: Verify the Created Casino with GET
        await test.step('Step 2: Verify the Created Casino with GET', async () => {
            const getCreatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/casinos/${casinoId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getCreatedResponse, testInfo, "GET");
            const getCreatedStatusCode = getCreatedResponse.status();
            expect(getCreatedStatusCode).toBe(200);

            const getCreatedBody = await getCreatedResponse.json();
            expect(getCreatedBody).toHaveProperty('_id', casinoId);
            expect(getCreatedBody.name).toBe(casinoName);
            console.log(`Verified Casino via GET: ${casinoId}`);
        });

        // Step 3: Update the Casino using PATCH
        await test.step('Step 3: Update the Casino using PATCH', async () => {
            const updatedCasinoName = `${casinoName} - Updated`;
            const patchPayload = {
                "domains": [`${config.defaultDomainId}`], // Retain the same domains from creation
                "contentLanguagesCodes": ["en"], // Include this to avoid validation errors
                "name": updatedCasinoName, // Update the name
                "rating": 5 // Update the rating
            };

            const patchResponse = await request.patch(`https://${config.nucleusPortalServiceUri}/api/v1/casinos/${casinoId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                },
                data: patchPayload
            });

            await logResponse(patchResponse, testInfo, "PATCH");
            const patchStatusCode = patchResponse.status();
            expect(patchStatusCode).toBe(204);

            casinoName = updatedCasinoName;
            console.log(`Updated Casino: Name - ${casinoName}`);
        });

        // Step 4: Verify the Updated Casino with GET
        await test.step('Step 4: Verify the Updated Casino with GET', async () => {
            const getUpdatedResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/casinos/${casinoId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getUpdatedResponse, testInfo, "GET");
            const getUpdatedStatusCode = getUpdatedResponse.status();
            expect(getUpdatedStatusCode).toBe(200);

            const getUpdatedBody = await getUpdatedResponse.json();
            expect(getUpdatedBody).toHaveProperty('_id', casinoId);
            expect(getUpdatedBody.name).toBe(casinoName);
            console.log(`Verified Updated Casino via GET: ${casinoId}`);
        });

        //Step 5: Delete the Casino
        await test.step('Step 5: Delete the Casino', async () => {
            const deleteResponse = await request.delete(`https://${config.nucleusPortalServiceUri}/api/v1/casinos/${casinoId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(deleteResponse, testInfo, "DELETE");
            const deleteStatusCode = deleteResponse.status();
            expect(deleteStatusCode).toBe(204);

            console.log(`Casino with ID ${casinoId} has been deleted successfully.`);
        });

        // Step 6: Verify the Deletion with GET
        await test.step('Step 6: Verify the Deletion with GET', async () => {
            const getAfterDeleteResponse = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/casinos/${casinoId}`, {
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`
                }
            });

            await logResponse(getAfterDeleteResponse, testInfo, "GET");
            const getAfterDeleteStatusCode = getAfterDeleteResponse.status();
            expect(getAfterDeleteStatusCode).toBe(404);

            console.log(`Verified Casino Deletion (404): ${casinoId}`);
        });
    });
});
