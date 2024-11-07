import {test} from "../fixtures/fixtures";
import {expect} from "@playwright/test";
import config from "../../playwright.config";


test.describe(`SHORT REVIEWS subpage - ${config.name} `, {tag: [`@${config.name}`]}, () => {

    test.beforeEach(async ({ShortReviewsPage}) => {
        await ShortReviewsPage.page.goto(`https://${config.baseUrl}/short-reviews`);
    });

    test('check the title', async ({ShortReviewsPage}) => {
        expect(await ShortReviewsPage.page.title()).toBe('Nucleus Portal');
    });

    test('verify that the expected menu items are displayed and clickable', async ({menuComponent}) => {
        await menuComponent.checkMenuItems()
        // await menuComponent.checkDataPointItems() //doesnt exist in staging
    });

    test('check the alert banner', async ({components}) => {
        await components.checkAlertBanner("Please select a filter to view the Short Reviews");
    });

    test('check comboBoxes', async ({ShortReviewsPage, components}) => {
        await test.step("Toplist combobox", async () => {
            const toplistComboboxItems: string[] = [
                "QA Toplist",
            ]
            await components.checkCombobox(ShortReviewsPage.toplistCombobox, toplistComboboxItems);
        });
        await test.step("Status combobox", async () => {
            const statusComboboxItems: string[] = [
                "All",
                "Todo",
                "Created",
                "Update required",
                "Approved"
            ]
            await components.checkCombobox(ShortReviewsPage.statusCombobox, statusComboboxItems);
        });
        await test.step("Toplist product combobox", async () => {
            const toplistComboboxItems: string[] = [
                "Select an option",
                "ccn.com",
                "salon.com"
            ]
            await components.checkCombobox(ShortReviewsPage.toplistProductCombobox, toplistComboboxItems);
        });
    });

    test('check the Multi Grid', async ({components, ShortReviewsPage}) => {
        await components.clickItemFromCombobox(ShortReviewsPage.toplistCombobox, "QA Toplist");

        await test.step("`Check each of the fields in a row", async () => {
            await expect(components.dataGridCell("toplistName", 1)).toContainText("QA Toplist");
            await expect(components.dataGridCell("partnerName", 1)).toContainText("Dunder Casino");
            await expect(components.dataGridCell("status", 1)).toContainText("Todo");
            await expect(components.dataGridCell("assignedTo", 1)).toContainText("");
            await expect(components.dataGridCell("updatedAt", 1)).toContainText("11/7/2024,");
            await expect(components.dataGridCell("actions", 1)).toHaveText("Approve");
        })
    });
});