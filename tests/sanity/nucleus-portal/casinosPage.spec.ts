import {test} from "../../fixtures/fixtures";
import {expect} from "@playwright/test";
import config from "../../../playwright.config";


test.describe(`PARTNERS/CASINOS subpage - ${config.name} `, {tag: [`@${config.name}`]}, () => {

    test.beforeEach(async ({CasinosPage, menuComponent}) => {
        await CasinosPage.page.goto(`https://${config.baseUrl}`);
        await menuComponent.menubarItem_Partners.click();
        await menuComponent.subPartnersMenuItem_Casinos.click();
        await CasinosPage.page.waitForLoadState();
    });

    test('Check the title and url', async ({CasinosPage}) => {
        await CasinosPage.page.waitForURL('**/partners/casinos');
        expect(await CasinosPage.page.title()).toBe('Nucleus Portal');
        expect(CasinosPage.page.url()).toBe(`https://${config.baseUrl}/partners/casinos`);
    });

    test('Verify that the expected menu items are displayed and clickable', async ({menuComponent}) => {
        await menuComponent.checkMenuItems();
        await menuComponent.checkDataPointItems();
    });


    test('Check the data grid', async ({components}) => {
        await test.step("Data grid table to be visible", async () => {
            await expect(components.dataGrid).toBeVisible();
        })
    });


    test('Update and save Random Casinos and a Specific Casino', async ({request, components, CasinosPage, menuComponent}) => {
        async function getCasinos(): Promise<string[]> {
            const response = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/casinos`, {
                params: {size: 10000},
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            return data.items.map((item) => item.name);
        }

        // Randomly select 5 casinos
        const randomCasinos: string[] = await (async () => {
            const allCasinos = await getCasinos(); // Retrieve the list of casinos
            const selectedCasinos = new Set<string>();

            while (selectedCasinos.size < 5 && allCasinos.length > selectedCasinos.size) {
                // Randomly select a casino and add it to the set to avoid duplicates
                const randomCasino = allCasinos[Math.floor(Math.random() * allCasinos.length)];
                if (!selectedCasinos.has(randomCasino)) {
                    selectedCasinos.add(randomCasino);
                }
            }

            return Array.from(selectedCasinos);
        })();

        for (const casinoName of randomCasinos) {

            await test.step(`Testing Casino that starts with "${casinoName}"`, async () => {
                // Search for the casino
                await test.step("Search for the Casino", async () => {
                    await menuComponent.menubarItem_Partners.click();
                    await menuComponent.subPartnersMenuItem_Casinos.click();
                    await CasinosPage.filterByCasinoName(casinoName);
                    await expect(components.dataGridCell("name", 1)).toBeVisible();
                    await expect(components.dataGridCell("createdAt", 1)).toBeVisible();
                    await expect(components.dataGridCell("updatedAt", 1)).toBeVisible();
                });

                // Open the casino details page
                await test.step("Open the Casino", async () => {
                    await components.dblClickDataGridRow(1);
                    await CasinosPage.page.waitForLoadState();
                    await expect(CasinosPage.topHeader).toContainText("Update Casino");
                });

                // Check all accordion dropdowns
                await test.step("Check all accordion dropdowns", async () => {
                    const dropdowns = [
                        'details-header',
                        'logo-header',
                        'settings-header',
                        'homepage-header',
                        'reviewBy-header',
                        'teaser-header',
                        'prosCons',
                        'legal-header',
                        'extras',
                    ];
                    for (const dropdown of dropdowns) {
                        await test.step(`Clicking on "${dropdown}"`, async () => {
                            await components.openDropdown(dropdown);
                            await expect.soft(components.dropdownHeader(dropdown)).toBeVisible();
                        });
                    }
                });

                // Check the tabs
                await test.step("Check the Tabs", async () => {
                    const tabs = ['General Information', 'Datapoints', 'Affiliate Links', 'Bonuses'];
                    for (const tab of tabs) {
                        const tabLocator = CasinosPage.getTabLocator(tab);
                        await tabLocator.click();
                    }
                });

                // Check the "No Bonus" toggle button
                await test.step("Check No Bonus toggle button", async () => {
                    await CasinosPage.getTabLocator('Bonuses').click();
                    await CasinosPage.firstDomainButton.click(); //first domain that can be found
                    if (await CasinosPage.noBonusToggle.isChecked()) {
                        await CasinosPage.noBonusToggle.click();
                    }
                    await components.checkAlertBanner("Welcome offer value will be returned in the toplist results for");
                    await CasinosPage.noBonusToggle.click();
                    await components.checkAlertBanner(
                        "Please note that you cannot edit offers or packages if the domain has no bonus. If you save this form, any existing offers and packages for this domain will be removed."
                    );
                });
            }); // End of casino test
        } // End of loop through casinos
    });


    test('Pagination and Data Grid items', async ({components}) => {

        await test.step("Select 25 items per page", async () => {
            await components.checkRowsInDataGrid(25, ["name", "createdAt", "updatedAt"]);
            await expect(components.displayedRowsLabel).toContainText("1–25 of ");
        });
        await test.step("Select 15 items per page", async () => {
            await components.checkRowsInDataGrid(15, ["name", "createdAt", "updatedAt"]);
            await expect(components.displayedRowsLabel).toContainText("1–15 of ");
        });
        await test.step("Select 10 items per page", async () => {
            await components.checkRowsInDataGrid(10, ["name", "createdAt", "updatedAt"]);
            await expect(components.displayedRowsLabel).toContainText("1–10 of ");
        });
        await test.step("Check Next Page and Previous Page buttons", async () => {
            await components.nextPageButton.click();
            await expect(components.displayedRowsLabel).toContainText("11–20 of ");
            await components.nextPageButton.click();
            await expect(components.displayedRowsLabel).toContainText("21–30 of ");
            await components.previousPageButton.click();
            await expect(components.displayedRowsLabel).toContainText("11–20 of ");
            await components.previousPageButton.click();
            await expect(components.displayedRowsLabel).toContainText("1–10 of ");
        });
    });

});