import {test} from "../../fixtures/fixtures";
import {expect} from "@playwright/test";
import config from "../../../playwright.config";
import {timeDifference} from "../../common/helpers";


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


    test('Check Random Casinos and a Specific Casino', async ({request, components, CasinosPage, menuComponent}) => {
        async function getCasinos(): Promise<string[]> {

            const response = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/casinos`, {
                params: {size: 10000},
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                }
            });

            expect.soft([401, 403], "User is not authorized to access this resource").not.toContain(response.status());
            expect(response.status(), "There is an issue receiving the response from:" + response.url()).toBe(200);

            const data = await response.json();
            return data.items.map((item) => item.name);

        }

        // Randomly select 5 casinos
        const randomCasinos: string[] = await (async () => {
            const allCasinos = (await getCasinos()).filter(casino => !casino.toLowerCase().includes("do not edit")); // Exclude casinos with "do not edit" in the name
            const selectedCasinos = new Set<string>();
            while (selectedCasinos.size < 5 && allCasinos.length > selectedCasinos.size) {
                // Randomly select a casino and add it to the set to avoid duplicates
                const randomCasino = allCasinos[Math.floor(Math.random() * allCasinos.length)];
                if (!selectedCasinos.has(randomCasino)) {
                    selectedCasinos.add(randomCasino);
                }
            }
            return [...Array.from(selectedCasinos)];
        })();

        for (const casinoName of randomCasinos) {
            await test.step(`Testing Casino "${casinoName}"`, async () => {
                // Search for the casino
                await test.step("Search for the Casino", async () => {
                    await menuComponent.menubarItem_Partners.click();
                    await menuComponent.subPartnersMenuItem_Casinos.click();
                    await CasinosPage.filterByCasinoName(casinoName);
                    await expect.soft(components.dataGridCell("name", 1)).toBeVisible();
                    await expect.soft(components.dataGridCell("createdAt", 1)).toBeVisible();
                    await expect.soft(components.dataGridCell("updatedAt", 1)).toBeVisible();
                });

                // Open the casino details page
                await test.step("Open the Casino", async () => {
                    await CasinosPage.page.waitForTimeout(2000);

                    await components.dblClickDataGridRow(1);
                    await CasinosPage.page.waitForLoadState('domcontentloaded');

                    await expect(CasinosPage.topHeader).toBeVisible();
                    await expect(CasinosPage.topHeader).toBeEnabled();

                    // This is the assertion that might fail
                    await expect.soft(CasinosPage.topHeader).toContainText("Update Casino");
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
            });
        }
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


    test('Update/edit a Specific Casino', async ({components, CasinosPage, menuComponent}) => {
        const casinoName = `[QA] 3 Casino used by ROBOTS - do not edit`;
        await test.step(`Updating Casino "${casinoName}"`, async () => {
            // Search for the casino
            await test.step("Search for the Casino", async () => {
                await menuComponent.menubarItem_Partners.click();
                await menuComponent.subPartnersMenuItem_Casinos.click();
                await CasinosPage.filterByCasinoName(casinoName);
            });

            // Open the casino details page
            await test.step("Open the Casino", async () => {
                await components.dblClickDataGridRow(1);
                await expect.soft(CasinosPage.topHeader).toContainText("Update Casino");
            });

            const date: Date = new Date();
            await test.step("Edit General Information", async () => {
                await CasinosPage.casinoNameField.fill(casinoName + " - " + date.toISOString());
            });

            await test.step("Save Casino", async () => {
                await CasinosPage.saveButton.click();
            });

            await test.step("Check if the Casino is saved and updated", async () => {
                await CasinosPage.page.waitForTimeout(2000);
                await menuComponent.menubarItem_Partners.click();
                await menuComponent.subPartnersMenuItem_Casinos.click();
                await CasinosPage.filterByCasinoName(casinoName);
                await expect(components.dataGridCell("name", 1)).toContainText(casinoName + " - " + date.toISOString());
                const actualUpdateTime = await components.dataGridCell("updatedAt", 1).innerText();
                const timedate = new Date();
                const expectedUpdateTime = timedate.toLocaleString();
                expect(timeDifference(expectedUpdateTime, actualUpdateTime), `Actual [${actualUpdateTime}] and expected [${expectedUpdateTime}] update time should not differ by more than 30 seconds`).toBeLessThan(30000);
            });

        });
    });


    test('Check Validation Messages', {
            annotation: {
                type: 'issue',
                description: 'https://findco.atlassian.net/browse/DEV-5499',
            },
        },
        async ({components, CasinosPage, menuComponent}) => {
            const casinoName = `[QA] Casino used by ROBOTS - do not edit`;
            await test.step(`Updating Casino "${casinoName}"`, async () => {
                // Search for the casino
                await test.step("Search for the Casino", async () => {
                    await menuComponent.menubarItem_Partners.click();
                    await menuComponent.subPartnersMenuItem_Casinos.click();
                    await CasinosPage.filterByCasinoName(casinoName);
                });

                // Open the casino details page
                await test.step("Open the Casino", async () => {
                    await CasinosPage.page.waitForTimeout(1200);
                    await components.dblClickDataGridRow(1);
                    await CasinosPage.page.waitForLoadState();
                    await expect.soft(CasinosPage.topHeader).toContainText("Update Casino");
                });


                await test.step("Edit DATAPOINTS", async () => {
                    await CasinosPage.getTabLocator("DATAPOINTS").click();

                    const fieldsToClear = ["Products *", "Product Categories *", "Coins *", "Currencies *", "Security Methods *", "Languages *", "Support Languages *", "Slot Providers *", "Sports", "Deposit Methods *", "Withdrawal Methods *", "Licenses Owned *"];
                    for (const field of fieldsToClear) {
                        await CasinosPage.casinoDatapointsClearField(field);
                    }
                });


                await test.step("Save Casino", async () => {
                    await CasinosPage.saveButton.click();
                });

                await test.step("Check validation messages", async () => {
                    // Required fields
                    const requiredFields: string[] = ["products", "coins", "currencies", "security-methods", "languages", "support-languages", "slot-providers", "deposit-methods", "withdrawal-methods", "licenses-owned"];
                    for (const field of requiredFields) {
                        await expect(CasinosPage.casinoDatapointsValidationLabel(field), `${field} field is required`).toBeVisible();
                    }

                    //Not required fields
                    await expect(CasinosPage.casinoDatapointsValidationLabel("sports"), "Sports field is not required (DEV-5499)").not.toBeVisible();
                });

            });
        });
});