import { test } from "../../fixtures/fixtures";
import { expect, Locator } from "@playwright/test";
import config from "../../../playwright.config";

test.describe(`SEARCH field functionality - ${config.name} `, { tag: [`@${config.name}`] }, () => {

    // Define landing pages and their corresponding search field locators
    const testLandingPages = [
        {
            path: '/partners/casinos',
            searchFieldSelector: 'casino-name-filter-field'
        },
        {
            path: '/partners/exchanges',
            searchFieldSelector: 'exchange-name-filter-field'
        },
        {
            path: '/database/datapoints/coins',
            searchFieldSelector: 'coin-name-filter-field'
        },
        {
            path: '/database/datapoints/products',
            searchFieldSelector: 'product-name-filter-field'
        },
        {
            path: '/database/datapoints/sports',
            searchFieldSelector: 'sport-name-filter-field'
        },
        {
            path: '/toplists',
            searchFieldSelector: 'toplist-name-filter-field'
        }
    ];

    const invalidCharacters = "<>/[|\\{}()[]^$+*?.]/gabcABC.,';`-=~#@'!£%&¬";

    for (const { path, searchFieldSelector } of testLandingPages) {
        test(`SEARCH for 'invalid' characters on ${path}`, {
            annotation: {
                type: 'issue',
                description: 'https://findco.atlassian.net/browse/DEV-5448',
            }
        }, async ({ HomePage }) => {
            // Step 1: Navigate to the landing page
            await test.step(`Navigate to ${path}`, async () => {
                await HomePage.page.goto(`https://${config.baseUrl}${path}`);
            });

            // Define the search field and alert banner
            const searchField: Locator = HomePage.page.getByTestId(searchFieldSelector);
            const alertBanner: Locator = HomePage.page.locator(`//div[contains(@class, "MuiAlert")]`).first();

            // Array to store failed characters
            const failedCharacters: string[] = [];

            // Step 2: Test invalid characters in the search field
            for (const character of invalidCharacters) {
                await test.step(`Checking character "${character}"`, async () => {
                    await searchField.click();
                    await searchField.pressSequentially(character, { delay: 800 });
                    const alertVisible = await alertBanner.count() > 0;
                    if (alertVisible) {
                        failedCharacters.push(character);
                    }
                    await expect.soft(alertBanner, "Detecting alert banner").not.toBeVisible();
                    await HomePage.page.keyboard.press('Backspace'); // Reset search field
                });
            }

            // Step 3: Report failed characters
            await test.step("Report failed characters", async () => {
                await test.info().attach("Failed Characters", {
                    body: JSON.stringify({
                        landingPage: path,
                        failedCharacters: failedCharacters.length ? failedCharacters : "None"
                    }, null, 2),
                    contentType: "application/json"
                });
            });
        });
    }
});