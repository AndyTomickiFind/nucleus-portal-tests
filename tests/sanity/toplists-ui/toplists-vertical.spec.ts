import {test} from "../../fixtures/fixtures";
import {expect} from "@playwright/test";
import config from "../../../playwright.config";





test.describe(`TOPLIST - UI - ${config.name} `, {tag: [`@${config.name}`]}, () => {

    test.beforeEach(async ({ToplistsUI}) => {
        await ToplistsUI.page.goto(`https://${process.env.STATIC_PAGE_USER}:${process.env.STATIC_PAGE_PASSWORD}@${process.env.TEST_ENV}.ccn.com/crypto-gambling/`);  //temporary
    });

    test('Check Toplist for visibility of elements', async ({ToplistsUI, request}) => {
        const id = "673efb7fdaa386be8b2edc89"; //temporary - staging toplist
        const response = await request.get(`https://${config.toplistServiceV1Uri}/api/v1/toplists/${id}/results`, {
            headers: {
                // Add headers if needed
            },
            params: {
                // Add query params if needed
            },
            data: {
                // Add body data if needed
            }
        });
        const responseBody = await response.json();
        const desiredField = responseBody.sites[0].name;

        console.log('Desired Field:', desiredField);

        await expect(ToplistsUI.toplistContainer).toBeVisible();
        await expect(ToplistsUI.toplistItem, "There must be 10 items in the toplist").toHaveCount(10);

        const item = await ToplistsUI.nthToplistItem(1);
        await expect(item).toContainText(desiredField);
    });


});