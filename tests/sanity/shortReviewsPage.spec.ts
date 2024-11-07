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
});