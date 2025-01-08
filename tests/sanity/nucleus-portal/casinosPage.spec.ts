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

    test('check the title and url', async ({CasinosPage}) => {
        await CasinosPage.page.waitForURL('**/partners/casinos');
        expect(await CasinosPage.page.title()).toBe('Nucleus Portal');
        expect(CasinosPage.page.url()).toBe(`https://${config.baseUrl}/partners/casinos`);
    });

    test('verify that the expected menu items are displayed and clickable', async ({menuComponent}) => {
        await menuComponent.checkMenuItems();
        await menuComponent.checkDataPointItems();
    });



    test('check the data grid', async ({components}) => {
        await test.step("Data grid table to be visible", async () => {
            await expect(components.dataGrid).toBeVisible();
        })
    });

    test('edit and save Casino', async ({components, CasinosPage}) => {
        await test.step("search for the Casino", async () => {
            await CasinosPage.casinoNameFilterField.fill("[QA] Casino used by ROBOTS - do not edit");
            await CasinosPage.casinoNameFilterField.press(`Enter`);

            await expect(components.dataGridCell("name", 1)).toContainText("QA Toplist");
            await expect(components.dataGridCell("domains", 1)).toContainText("ccn.com");
            await expect(components.dataGridCell("type", 1)).toContainText("Casinos");
            await expect(components.dataGridCell("subType", 1)).toContainText("Default");
            await expect(components.dataGridCell("status", 1)).toContainText("Published");
            await expect(components.dataGridCell("updatedAt", 1)).toContainText("/2024,");
        })
    });

    test('pagination and Data Grid items', async ({components}) => {

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