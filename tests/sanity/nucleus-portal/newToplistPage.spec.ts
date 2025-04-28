import {test} from "../../fixtures/fixtures";
import {expect} from "@playwright/test";
import config from "../../../playwright.config";


test.describe(`NEW TOPLIST subpage - ${config.name} `, {tag: [`@${config.name}`]}, () => {

    test.beforeEach(async ({NewToplistPage}) => {
        await NewToplistPage.page.goto(`https://${config.baseUrl}/toplists/new`);
    });

    test('check the title', async ({NewToplistPage}) => {
        expect(await NewToplistPage.page.title()).toBe('Nucleus Portal');
    });

    test('verify that the expected menu items are displayed and clickable', async ({menuComponent}) => {
        await menuComponent.checkMenuItems();
        await menuComponent.checkDataPointItems();
    });

    test('check all elements', {
        annotation: {
            type: 'issue',
            description:
                'https://findco.atlassian.net/browse/DEV-6132' // [nucleus-portal] Boolean filters - neutral state.
        },
    }, async ({NewToplistPage, components}) => {

        await NewToplistPage.checkNewToplistHeader("New Toplist");
        await test.step("Check horizontal dividers", async () => {
            const dividerLabels: string[] = [
                "General",
                "Casinos Filters",
                "Overrides",
                "Default Results",
            ];
            await components.checkDividers(dividerLabels);
        });


        await test.step("Check the rest of the elements", async () => {
            await expect(NewToplistPage.nameField).toContainText("Name *");
            await expect(NewToplistPage.verticalCombobox).toContainText("Casinos");
            await expect(NewToplistPage.subVerticalCombobox).toContainText("Default");
            await expect(NewToplistPage.placementsCountInputBox).toBeVisible();
            await expect(NewToplistPage.descriptionInputField).toContainText("Description");
            await expect(NewToplistPage.appliesToProductCombobox).toContainText("Applies to Product *");
            await expect(NewToplistPage.advancedFiltersAccordion).toContainText("Advanced filters");
            await expect(NewToplistPage.addOverrideButton).toBeVisible();

            await NewToplistPage.checkToplistsResults("default", 10);

            await expect(NewToplistPage.cancelButton).toHaveText("Cancel");
            await expect(NewToplistPage.createButton).toHaveText("Create");
        });

        await test.step("Check Casinos Filters", async () => {

            await NewToplistPage.advancedFiltersAccordion.click();
            await components.checkDividers(["Promotions"]);
            await components.checkCombobox(NewToplistPage.casinoProductsCombobox, ["Live Dealer", "Roulette", "Lotteries", "Dice"]);
            await components.checkCombobox(NewToplistPage.licensesCombobox, ["Malta", "Panama", "Sweden", "Not Disclosed"]);
            //await components.checkCombobox(NewToplistPage.softwareProvidersCombobox, ["1Spin4Win", "3Dice", "7777 Gaming", "5Men"]);
            await components.checkCombobox(NewToplistPage.currenciesCombobox, ["[QA] RoboCurrency 01", "[QA] RoboCurrency 02"]);  //PROD-1172
            await components.checkCombobox(NewToplistPage.depositMethodsCombobox, ["1Sol", "1inch"]);
            await components.checkCombobox(NewToplistPage.sportsCombobox, ["Age of Empires", "Archery", "Angry Birds"]);
            await components.clickItemFromCombobox(NewToplistPage.appliesToProductCombobox, ["ccn.com"]);
            await components.checkCombobox(NewToplistPage.promotionTypesCombobox, ["Free bet", "Welcome package", "Cashback", "Free spins", "First deposit"]);

            // https://findco.atlassian.net/browse/DEV-6132
            await components.checkCombobox(NewToplistPage.provablyFairCombobox, ["- No filter applied -", "Yes", "No"]);
            await components.checkCombobox(NewToplistPage.anonymousPlayCombobox, ["- No filter applied -", "Yes", "No"]);

            // Commented out due to: https://findco.atlassian.net/browse/DEV-6132
            //await NewToplistPage.anonymousPlayCheckbox.click();
            //await NewToplistPage.provablyFairCheckbox.click();
        });


        // Button doesn't exist anymore
        // await test.step("Check New Deposit Method", async () => {
        //     await NewToplistPage.newDepositMethodButton.click();
        //     await components.checkDividers(["General", "Upload Logo"]);
        //
        //     await NewToplistPage.newDepositMethodCancelButton.click({trial: true});
        //     await NewToplistPage.newDepositMethodCancelButton.click();
        // });

        await test.step("Check Override modal", async () => {
            await NewToplistPage.addOverrideButton.click();

            const dividerLabels: string[] = [
                "General",
                "Results"
            ];
            await components.checkDividers(dividerLabels);

            await components.checkCombobox(NewToplistPage.appliesToCountriesCombobox, components.countriesList);
            await NewToplistPage.checkToplistsResults("override", 10);

            await NewToplistPage.saveOverrideListButton.click({trial: true});
            await NewToplistPage.cancelOverrideListButton.click();
        });

        //wip
        // await test.step("---", async () => {
        //     await NewToplistPage.advancedFiltersAccordion.click();
        //
        // });
    });
});