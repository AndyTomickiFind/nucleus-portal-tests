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


    test('Update and save Casino', async ({components, CasinosPage}) => {
        await test.step("search for the Casino", async () => {
            const casinoName = "Casino used by ROBOTS - do not edit";
            await CasinosPage.filterByCasinoName(casinoName);
            await expect(components.dataGridCell("name", 1)).toContainText(casinoName);
            await expect(components.dataGridCell("createdAt", 1)).toBeVisible();
            await expect(components.dataGridCell("updatedAt", 1)).toBeVisible();
        });

        await test.step("Open the Casino", async () => {
            await components.dblClickDataGridRow(1);
            await CasinosPage.page.waitForLoadState();
            await expect(CasinosPage.topHeader).toContainText("Update Casino");
        });

        await test.step("Check all of accordion dropdowns", async () => {
            // Define the list of dropdown headers to click
            const dropdowns = ['details-header', 'logo-header', 'settings-header', 'homepage-header', 'reviewBy-header', 'teaser-header', 'prosCons', 'legal-header', 'extras'];

            // Iterate through the dropdowns and click on each
            for (const dropdown of dropdowns) {
                await test.step(`Clicking on "${dropdown}"`, async () => {
                    await components.openDropdown(dropdown);
                    await expect.soft(components.dropdownHeader(dropdown)).toBeVisible();
                });
            }
        });

        await test.step("Check the Tabs", async () => {
            const tabs = ['General Information', 'Datapoints', 'Affiliate Links', 'Bonuses'];
            for (const tab of tabs) {
                const tabLocator = CasinosPage.getTabLocator(tab);
                await tabLocator.click();
            }
        });

        await test.step("Check No Bonus toggle button", async () => {
            await CasinosPage.getTabLocator('Bonuses').click();
            await CasinosPage.domainButton('salon.com').click();
            await CasinosPage.noBonusToggle.click();
            await components.checkAlertBanner("Welcome offer value will be returned in the toplist results for salon.com.");
            await CasinosPage.noBonusToggle.click();
            await components.checkAlertBanner("Please note that you cannot edit offers or packages if the domain has no bonus. If you save this form, any existing offers and packages for this domain will be removed.");
        });
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