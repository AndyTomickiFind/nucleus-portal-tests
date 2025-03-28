import {expect, test} from '@playwright/test';
import {logResponse} from '../../../src/logger';
import config from "../../../playwright.config";
import fs from "fs";

test(`[${config.name.toUpperCase()}] Toplist auto updater - Toplist relevancy`, {
    annotation: {
        type: 'issue',
        description: 'https://findco.atlassian.net/browse/DEV-5629',  //[nucleus-portal-be] Toplists auto update process changes
    },
}, async ({request}, testInfo) => {

    await test.step(`Set the toplist with default values`, async () => {
        const testData = JSON.parse(fs.readFileSync(`tests/api/testData_${process.env.TEST_ENV}/toplistRelevancy_default.json`, 'utf-8'));
        const response = await request.patch(`https://${config.nucleusPortalServiceUri}/api/v2/toplists/67c015ca36fcef3efd3a7d00`, {
            headers: {
                "Authorization": `${config.nucleusPortalToken}`,
                "Content-Type": "application/json"
            },
            params: {},
            data: testData
        });

        await logResponse(response, testInfo, "PATCH");
        expect.soft([401, 403], "User is not authorized to access this resource").not.toContain(response.status());
        expect(response.status(), "There is an issue receiving the response from:" + response.url()).toBe(204);
    });

    await test.step(`Run Toplist relevancy automation`, async () => {
        const testData = JSON.parse(fs.readFileSync(`tests/api/testData_${process.env.TEST_ENV}/autoUpdater.json`, 'utf-8'));
        const response = await request.post(`https://${config.nucleusPortalServiceUri}/api/v1/toplists-auto-update`, {
            headers: {
                "Authorization": `${config.nucleusPortalToken}`,
                "Content-Type": "application/json"
            },
            params: {},
            data: testData
        });

        await logResponse(response, testInfo, "POST");
        expect.soft([401, 403], "User is not authorized to access this resource").not.toContain(response.status());
        expect(response.status(), "There is an issue receiving the response from:" + response.url()).toBe(200);
    });
});