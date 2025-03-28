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

    const invalidCharacters = "<>/[|\\{}()[]^$+*?.]/gabcABC.,';`-=~#@'!£%&¬";  //These are valid but used to throw an error
    const searchKeywords = [
        "[QA] Search me 1",
        "[QA] Search me 2"
    ];

    for (const { path, searchFieldSelector } of testLandingPages) {
        test(`SEARCH for invalid characters and specified keywords on ${path}`, {
            annotation: {
                type: 'issue',
                description: 'https://findco.atlassian.net/browse/DEV-5448', //"Invalid regular expression" internal server error while searching in the portal
            }
        }, async ({ HomePage }) => {
            await test.step(`Navigate to ${path}`, async () => {
                await HomePage.page.goto(`https://${config.baseUrl}${path}`);
                await HomePage.page.waitForLoadState('domcontentloaded');
                await HomePage.page.waitForTimeout(500);
            });

            const searchField: Locator = HomePage.page.getByTestId(searchFieldSelector);

            const failedCharacters: string[] = [];
            for (const character of invalidCharacters) {
                await test.step(`Checking character "${character}"`, async () => {
                    await searchField.click();
                    await searchField.pressSequentially(character, { delay: 500 });
                    const alertBanner: Locator = HomePage.page.locator(`//div[contains(@class, "MuiAlert")]`).first();
                    let attempts = 0;
                    while (attempts < 3 && await alertBanner.isVisible()) {
                        attempts++;
                        await HomePage.page.waitForTimeout(500);
                    }
                    if (await alertBanner.count() > 0) {
                        failedCharacters.push(character);
                    }
                    await HomePage.page.keyboard.press('Backspace'); // Reset search field
                });
            }

            // Report failed characters
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

    test.describe(`SEARCH functionality for specified keywords - ${config.name} `, {tag: [`@${config.name}`]}, () => {
        for (const {path, searchFieldSelector} of testLandingPages) {
            test(`SEARCH for specified keywords on ${path}`, {
                annotation: {
                    type: 'issue',
                    description: 'https://findco.atlassian.net/browse/DEV-5626',
                }
            }, async ({HomePage, components}) => {
                await test.step(`Navigate to ${path}`, async () => {
                    await HomePage.page.goto(`https://${config.baseUrl}${path}`);
                });

                // Define the search field
                const searchField: Locator = HomePage.page.getByTestId(searchFieldSelector).locator(`//input`);
                for (const keyword of searchKeywords) {
                    await test.step(`Searching for keyword "${keyword}"`, async () => {
                        await searchField.click();
                        await searchField.pressSequentially(keyword, {delay: 100});
                        await HomePage.page.keyboard.press('Enter');
                        await expect(components.dataGridCell("name", 1), `Checking grid contains keyword ${keyword}`).toContainText(keyword);
                        await searchField.clear();
                    });
                }
            });
        }
    });
});
