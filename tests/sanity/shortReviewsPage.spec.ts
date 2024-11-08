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

        await test.step("Check each of the fields in a row", async () => {
            await expect(components.dataGridCell("toplistName", 1)).toContainText("QA Toplist");
            await expect(components.dataGridCell("partnerName", 1)).toContainText("Dunder Casino");
            await expect(components.dataGridCell("status", 1)).toContainText("Todo");
            await expect(components.dataGridCell("assignedTo", 1)).toContainText("");
            await expect(components.dataGridCell("updatedAt", 1)).toContainText("/2024,");
            await expect(components.dataGridCell("actions", 1)).toHaveText("Approve");
        })
    });

    function parseDate(dateString: string): Date {
        const [datePart, timePart, period] = dateString.split(/[ ,]+/);
        const [month, day, year] = datePart.split('/').map(Number);
        // eslint-disable-next-line prefer-const
        let [hours, minutes, seconds] = timePart.split(':').map(Number);

        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
            hours = 0;
        }

        return new Date(year, month - 1, day, hours, minutes, seconds);
    }
    function timeDifference(dateStr1: string, dateStr2: string): number {
        const date1 = parseDate(dateStr1);
        const date2 = parseDate(dateStr2);
        return Math.abs(date1.getTime() - date2.getTime()); // 10 seconds
    }


    test('edit Short Review', async ({components, ShortReviewsPage}) => {
        await components.clickItemFromCombobox(ShortReviewsPage.toplistCombobox, "QA Toplist");
        await components.dblClickDataGridRow(2);
        await test.step("Check elements", async () => {
            await ShortReviewsPage.checkWelcomeBanner("Edit Short Review");
            await components.checkDividers(["English Translation *", "French Translation", "Portuguese Translation", "Spanish Translation"]);
            await components.elementContainsLabels(ShortReviewsPage.gridTopBox, ["Toplist Name", "Partner Name", "Product Name", "Toplist Description", "Toplist Status", "Assigned to"])
            //WIP
        });
        await test.step("Edit and save", async () => {
            await ShortReviewsPage.englishTranslationRichTextEditor.getByRole("textbox").fill("12345");
            await ShortReviewsPage.saveButton.click();
            await ShortReviewsPage.page.waitForTimeout(3000);
            await ShortReviewsPage.page.reload();
            await ShortReviewsPage.page.waitForLoadState();
            const date = new Date();
            const expectedUpdateTime = date.toLocaleString();
            const actualUpdateTime = await components.dataGridCell("updatedAt", 1).innerText();
            expect(timeDifference(expectedUpdateTime, actualUpdateTime), `Actual [${actualUpdateTime}] and expected [${expectedUpdateTime}] update time is not in 10 seconds range`).toBeLessThan(10_000);
        });
    });
});