import {expect, test} from '@playwright/test';
import {logResponse} from '../../src/logger';
import config from "../../playwright.config";

test(`[${config.name.toUpperCase()}] GET /api/v1/toplists/{id}`, async ({request}, testInfo) => {
        const uri = `https://${config.toplistServiceV1Uri}/api/v1/toplists/6719ffdfd4372e0607af539a`;
        console.log("Calling: " + uri)
        const response = await request.get(uri, {
            headers: {
                // Add headers if needed
            },
            params: {},
            data: {
                // Add body data if needed
            }
        });

        await logResponse(response, testInfo);

        expect(response.status(), response.body()[Symbol.toStringTag]).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toMatchObject(
            {
                "_id": `6719ffdfd4372e0607af539a`,
                "name": "QA Toplist",
                //"description": "Toplist used by QA - please do not edit.1",
                "type": "casinos",
                "subType": "default",
                "appliesToProducts": ["65f49a7d06037feabc19107e"],
                "overrides": [
                    {
                        "appliesToCountries": ["CY"],
                        "results": ["65f49a7e06037feabc191085",
                            "65f49a8106037feabc1b023a",
                            "65f49a7e06037feabc1910ad",
                            "65f49a7e06037feabc194655",
                            "65f49a7f06037feabc19c8cf",
                            "65f49a8106037feabc1aafad",
                            "65f49a7f06037feabc19a277",
                            "65f49a7e06037feabc195c81",
                            "65f49a7f06037feabc19cb04",
                            "65f49a7f06037feabc19bd2b"],
                        "_id": "671a591cd4372e0607beccd5"
                    }],
                "defaultResults": [
                    "65f49a7e06037feabc1910ad",
                    "65f49a8006037feabc1a57a0",
                    "65f49a7f06037feabc1a1f96",
                    "65f49a7f06037feabc1a0581",
                    "65f49a8206037feabc1b4878",
                    "65f49a8006037feabc1a3ce1",
                    "65f49a7e06037feabc1969d2",
                    "65f49a7e06037feabc195c81",
                    "65f49a7e06037feabc19669e",
                    "65f49a8206037feabc1b6164"
                ],
                "placementsCount": 10,
                "hasPublishedVersion": true,
                "status": "published",
                "createdAt": "2024-10-24T08:05:51.526Z",
                "updatedAt": "2024-11-07T15:44:50.348Z",
                "publishedVersion":
                    {
                        "_id": "6719ffdfd4372e0607af53bf"
                        , "placementsCount": 10,
                        "defaultResults":
                            ["65f49a7e06037feabc1910ad",
                                "65f49a8006037feabc1a57a0",
                                "65f49a7f06037feabc1a1f96",
                                "65f49a7f06037feabc1a0581",
                                "65f49a8206037feabc1b4878",
                                "65f49a8006037feabc1a3ce1",
                                "65f49a7e06037feabc1969d2",
                                "65f49a7e06037feabc195c81",
                                "65f49a7e06037feabc19669e",
                                "65f49a8206037feabc1b6164"
                            ],
                        "overrides": [
                            {
                                "appliesToCountries": ["CY"],
                                "results":
                                    [
                                        "65f49a7e06037feabc191085",
                                        "65f49a8106037feabc1b023a",
                                        "65f49a7e06037feabc1910ad",
                                        "65f49a7e06037feabc194655",
                                        "65f49a7f06037feabc19c8cf",
                                        "65f49a8106037feabc1aafad",
                                        "65f49a7f06037feabc19a277",
                                        "65f49a7e06037feabc195c81",
                                        "65f49a7f06037feabc19cb04",
                                        "65f49a7f06037feabc19bd2b"
                                    ],
                                "_id": "671a591cd4372e0607beccd5"
                            }
                        ],
                        "publishedDate": "2024-11-07T15:44:50.347Z"
                    }
            }
        );
    }
);
