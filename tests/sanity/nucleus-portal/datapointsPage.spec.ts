import {test} from "../../fixtures/fixtures";
import {expect} from "@playwright/test";
import config from "../../../playwright.config";


test.describe(`DATAPOINTS subpage - ${config.name} `, {tag: [`@${config.name}`]}, () => {


    test.beforeEach(async ({DatapointsPage}) => {
        await DatapointsPage.page.goto(`https://${config.baseUrl}/datapoints`);
    });

    test('check the title', async ({DatapointsPage}) => {
        expect(await DatapointsPage.page.title()).toBe('Nucleus Portal');
    });

    test('verify that the expected menu items are displayed and clickable', async ({menuComponent}) => {
        await menuComponent.checkMenuItems();
        await menuComponent.checkDataPointItems();
    });

    test('check the alert banner', async ({components}) => {
        await components.checkAlertBanner("Please use the Datapoint Type filter to view the items");
    });

    test('check comboBoxes', async ({DatapointsPage, components}) => {
        await test.step("Datapoint Type combobox", async () => {
            const datapointTypeComboboxItems: string[] = [
                "Coins",
                "Community Socials",
                "Contact Methods",
                "Crypto Pairs",
                "Currencies",
                "Deposit Methods",
                "Educational Resources",
                "Insurance Providers",
                "Languages",
                "Licenses",
                "Order Types",
                "Payment Types",
                "Positions",
                "Product Categories",
                "Products",
                "Registration Steps",
                "Security Methods",
                "Slot Providers",
                "Sport Types",
                "Sports",
                "Support Issues",
                "Withdrawal Methods"
            ];
            await components.checkCombobox(DatapointsPage.datapointTypeCombobox, datapointTypeComboboxItems);
        });
    });

    test('check the Multi Grid', async ({components, DatapointsPage}) => {
        await components.clickItemFromCombobox(DatapointsPage.datapointTypeCombobox, ["Languages"]);
        await test.step("Check each of the fields in a row", async () => {
            await expect(components.dataGridCell("name", 1)).toContainText("QA Toplist");
            await expect(components.dataGridCell("actions", 1)).toHaveText("Approve");
            await expect(components.dataGridCell("updatedAt", 1)).toContainText("/2025,");
        });
    });
});