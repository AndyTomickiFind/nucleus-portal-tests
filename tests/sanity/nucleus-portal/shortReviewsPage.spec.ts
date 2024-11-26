import {test} from "../../fixtures/fixtures";
import {expect} from "@playwright/test";
import config from "../../../playwright.config";
import {timeDifference} from "../../common/helpers";


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
        await test.step("Check each of the fields in a row", async () => {
            await expect(components.dataGridCell("toplistName", 1)).toContainText("QA Toplist");
            await expect(components.dataGridCell("partnerName", 1)).toContainText("Dreamz");
            await expect(components.dataGridCell("status", 1)).toContainText("Created");
            await expect(components.dataGridCell("assignedTo", 1)).toHaveText("");
            await expect(components.dataGridCell("updatedAt", 1)).toContainText("/2024,");
            await expect(components.dataGridCell("actions", 1)).toHaveText("Approve");
        })
    });

    // SORTING TO DO
    // await components.dataGridCell("partnerName", 1).click();    //sort by partner name
    // await ShortReviewsPage.page.waitForLoadState();             //
    // await components.dataGridCell("partnerName", 1).click();    //

    test('edit Short Review', {
        annotation: {
            type: 'issue',
            description: 'https://findco.atlassian.net/browse/DEV-5219',
        },
    }, async ({components, ShortReviewsPage}) => {

        await components.clickItemFromCombobox(ShortReviewsPage.toplistCombobox, "QA Toplist");
        //await components.dblClickDataGridRow(1);
        await ShortReviewsPage.page.locator(`//div[@data-rowindex]/div[.='Dreamz']`).dblclick();  // Edit row containing "Dreamz"
        await test.step("Check elements", async () => {
            await ShortReviewsPage.checkWelcomeBanner("Edit Short Review");
            await components.checkDividers(["English Translation *", "French Translation", "Portuguese Translation", "Spanish Translation"]);
            await components.elementContainsLabels(ShortReviewsPage.gridTopBox, ["Toplist Name", "Partner Name", "Product Name", "Toplist Description", "Toplist Status", "Assigned to"])
            //WIP
        });
        await test.step("Edit and save", async () => {
            await ShortReviewsPage.englishTranslationRichTextEditor.getByRole("textbox").fill("This Short Review has been edited by robots 🤖");
            await ShortReviewsPage.saveButton.click();
            await ShortReviewsPage.page.waitForTimeout(3000);
            await ShortReviewsPage.page.reload();
            await ShortReviewsPage.page.waitForLoadState();
            const date = new Date();
            const expectedUpdateTime = date.toLocaleString();
            const actualUpdateTime = await components.dataGridCell("updatedAt", 1).innerText();
            expect(timeDifference(expectedUpdateTime, actualUpdateTime), `Actual [${actualUpdateTime}] and expected [${expectedUpdateTime}] update time should not differ by more than 10 seconds`).toBeLessThan(10_000);
        });
    });
});