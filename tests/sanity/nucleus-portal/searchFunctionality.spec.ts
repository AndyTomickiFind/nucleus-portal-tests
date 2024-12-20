import {test} from "../../fixtures/fixtures";
import {expect, Locator} from "@playwright/test";
import config from "../../../playwright.config";


test.describe(`SEARCH field functionality - ${config.name} `, {tag: [`@${config.name}`]}, () => {
    test('SEARCH for `invalid` characters', async ({HomePage}) => {
        await HomePage.page.goto(`https://${config.baseUrl}/partners/casinos`);

        const searchField: Locator = HomePage.page.getByTestId('casino-name-filter-field');
        const alertBanner: Locator = HomePage.page.locator(`//div[contains(@class, "MuiAlert")]`);

        const characters = "<>/[|\\{}()[]^$+*?.]/gabcABC.,';`-=~#@'!£%&¬";

        const failedCharacters: string[] = [];

        for (const character of characters) {
            await test.step(`Checking character "${character}"`, async () => {
                await searchField.click();
                await searchField.pressSequentially(character, {delay: 800});
                const alertVisible = await alertBanner.count() > 0;
                if (alertVisible) {
                    failedCharacters.push(character);
                }
                await expect.soft(alertBanner, "Detecting alert banner").not.toBeVisible();
                await HomePage.page.keyboard.press('Backspace');
            });
        }

// Report failed characters at the end of the test
        await test.step("Report failed characters", async () => {
            await test.info().attach("Failed Characters", {
                body: JSON.stringify(failedCharacters, null, 2),
                contentType: "application/json"
            });
        });

    });

});