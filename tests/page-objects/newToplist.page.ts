import {BasePage} from "./base.page";
import {BrowserContext, expect, Locator, Page, TestInfo} from "@playwright/test";


export class NewToplistPage extends BasePage {

    readonly testInfo: TestInfo;
    readonly newToplistHeader: Locator;
    readonly nameField: Locator;
    readonly verticalCombobox: Locator;
    readonly subVerticalCombobox: Locator;
    readonly placementsCountInputBox: Locator;
    readonly descriptionInputField: Locator;
    readonly appliesToProductCombobox: Locator;
    readonly coinsCombobox: Locator;
    readonly advancedFiltersAccordion: Locator;
    readonly casinoProductsCombobox: Locator;
    readonly licensesCombobox: Locator;
    readonly anonymousPlayCheckbox: Locator;
    readonly provablyFairCheckbox: Locator;
    readonly softwareProvidersCombobox: Locator;
    readonly depositMethodsCombobox: Locator;
    readonly sportsCombobox: Locator;
    readonly newDepositMethodButton: Locator;
    readonly newDepositMethodCancelButton: Locator;
    readonly newDepositMethodCreateButton: Locator;
    readonly promotionTypesCombobox: Locator;
    readonly addOverrideButton: Locator;
    readonly cancelButton: Locator;
    readonly createButton: Locator;
    readonly appliesToCountriesCombobox: Locator;
    readonly saveOverrideListButton: Locator;
    readonly cancelOverrideListButton: Locator;

    constructor(page: Page, context: BrowserContext, testInfo: TestInfo) {
        super(page, context);
        this.testInfo = testInfo;
        this.newToplistHeader = page.locator('//h5');
        this.nameField = page.getByTestId("toplist-name-field");
        this.verticalCombobox = page.getByTestId("toplist-type-select");
        this.subVerticalCombobox = page.getByTestId("toplist-sub-type-select");
        this.placementsCountInputBox = page.getByTestId("toplist-placements-count-field");
        this.descriptionInputField = page.getByTestId("toplist-description-field");
        this.appliesToProductCombobox = page.getByTestId("toplist-products-autocomplete-field");
        this.coinsCombobox = page.getByTestId("toplist-form-filters-casinos-coins-autocomplete-field");
        this.advancedFiltersAccordion = page.getByTestId("toplist-form-advanced-filters-accordion");
        this.casinoProductsCombobox = page.getByTestId("toplist-form-filters-casinos-products-autocomplete");
        this.licensesCombobox = page.getByTestId("toplist-form-filters-casinos-licenses-autocomplete");
        this.anonymousPlayCheckbox = page.getByTestId("toplist-form-filters-casinos-anonymous-play-checkbox");
        this.provablyFairCheckbox = page.getByTestId("toplist-form-filters-casinos-provably-fair-checkbox");
        this.softwareProvidersCombobox = page.getByTestId("toplist-form-filters-casinos-slot-providers-autocomplete");
        this.depositMethodsCombobox = page.getByTestId("toplist-form-filters-casinos-deposit-methods-autocomplete");
        this.sportsCombobox = page.getByTestId("toplist-form-filters-casinos-sports-autocomplete");
        this.newDepositMethodButton = page.getByTestId("toplist-form-filters-casinos-deposit-methods-autocomplete-new-button");
        this.newDepositMethodCancelButton = page.getByTestId("deposit-method-cancel-button");
        this.newDepositMethodCreateButton = page.getByTestId("deposit-method-submit-button");
        this.promotionTypesCombobox = page.getByTestId("toplist-form-filters-casinos-promotion-types-autocomplete");
        this.addOverrideButton = page.getByTestId("add-override-button");
        this.cancelButton = page.getByTestId("toplist-cancel-button");
        this.createButton = page.getByTestId("toplist-submit-button");
        this.appliesToCountriesCombobox = page.getByTestId("toplist-override-countries-autocomplete");
        this.saveOverrideListButton = page.getByTestId("toplist-override-submit-button");
        this.cancelOverrideListButton = page.getByTestId("toplist-override-cancel-button");

    }

    toplistResultsItem(listType: string, itemNumber: number): Locator {
        return this.page.getByTestId(`toplist-${listType}-result-${itemNumber}-autocomplete`);
    }

    async checkNewToplistHeader(bannerText: string) {
        await expect(this.newToplistHeader).toContainText(bannerText);
    }

    async checkToplistsResults(listType: string, itemsCount: number) {
        for (let i = 1; i < itemsCount; i++) {
            // await this.toplistResultsItem(listType, i).scrollIntoViewIfNeeded();
            await this.page.mouse.wheel(0, 10);
            await this.toplistResultsItem(listType, i).click({trial: true})
        }
    }

}
