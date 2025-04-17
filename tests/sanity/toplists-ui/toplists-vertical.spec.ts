import {test} from "../../fixtures/fixtures";
import {expect} from "@playwright/test";
import config from "../../../playwright.config";


test.describe(`TOPLIST - UI - ${config.name} `, () => {
    test.skip(process.env.CI === 'true', 'Skipped in CI due to unauthorized access');
    test.beforeEach(async ({ToplistsUI}, testInfo) => {
        const landingPage = `https://${config.staticPage.username}:${config.staticPage.password}@${process.env.TEST_ENV}.ccn.com/crypto-gambling/`;
        testInfo.annotations.push({
            type: "info",
            description: landingPage,
        });
        await ToplistsUI.page.goto(landingPage);  //temporary
      //  await ToplistsUI.doNotConsentButton.click();
    });

    test('Check Toplist for visibility of elements', async ({ToplistsUI, request}) => {

        // await expect(ToplistsUI.page).toHaveScreenshot();
        // const id = "673efb7fdaa386be8b2edc89"; //temporary - staging toplist
        // const response = await request.get(`https://${config.toplistServiceV1Uri}/api/v2/toplists/${id}/results`, {
        //     headers: {
        //         // Add headers if needed
        //     },
        //     params: {
        //         // Add query params if needed
        //     },
        //     data: {
        //         // Add body data if needed
        //     }
        // });
        // const responseBody = await response.json();
        // //expect(ToplistsUI.compareExpectedToActualElements(responseBody.sites)).toBeTruthy();

        await expect(ToplistsUI.toplistContainer).toMatchAriaSnapshot(
            `- link "Up to 50 GBP Welcome Package + 100 Free Spins":
  - strong: Up to 50 GBP Welcome Package + 100 Free Spinsjhjhjvkhvk`
        );
    });


});