import { BasePage } from "./base.page";
import { BrowserContext, Locator, Page, TestInfo } from "@playwright/test";
import { test } from "../fixtures/fixtures";

export class ExchangesPage extends BasePage {
    readonly testInfo: TestInfo;
    readonly topHeader: Locator;
    readonly exchangeNameFilterField: Locator;
    readonly sortButton: Locator;
    readonly saveButton: Locator;
    readonly newExchangeButton: Locator;
    readonly firstDomainButton: Locator;
    readonly domainButton: (label: string) => Locator;
    readonly exchangeNameField: Locator;
    readonly clearFieldButton: (name: string) => Locator;
    readonly exchangeDatapointsDropdownField: (label: string) => Locator;
    readonly exchangeDatapointsValidationLabel: (name: string) => Locator;

    constructor(page: Page, context: BrowserContext, testInfo: TestInfo) {
        super(page, context);
        this.testInfo = testInfo;

        // Mapping locators in the constructor
        this.topHeader = page.locator('//h5');
        this.exchangeNameFilterField = page.locator(`//input[@id='exchange-name-filter-field']`);
        this.sortButton = page.locator("button[aria-label='Sort']");
        this.saveButton = page.getByTestId(`exchange-submit-button`);
        this.newExchangeButton = page.locator("button[data-testid='add-exchange-button']");
        this.firstDomainButton = page.locator("//div[contains(@data-testid, 'exchange-bonuses-form-domain-chip-')]").first();
        this.domainButton = (label: string) =>
            page.locator(`//div[contains(@data-testid, 'exchange-bonuses-form-domain-chip-')and .='${label}']`);
        this.exchangeNameField = page.locator('//input[@id="exchange-general-info-form-name"]');
        this.clearFieldButton = (label: string) =>
            this.exchangeDatapointsDropdownField(label).locator(" //*[@data-testid='CloseIcon']");
        this.exchangeDatapointsDropdownField = (label: string) =>
            page.locator(`//label[.='${label}']/..`);
        this.exchangeDatapointsValidationLabel = (name: string) =>
            page.locator(`//p[@id='exchange-datapoints-form-${name}-autocomplete-field-helper-text']`);
    }

    /**
     * Filter by Exchange Name
     * @param exchangeName - Name of the exchange
     */
    async filterByExchangeName(exchangeName: string) {
        await this.exchangeNameFilterField.fill(exchangeName);
        await this.exchangeNameFilterField.press("Enter");
    }

    getTabLocator(tabName: string): Locator {
        const tabTestId = `exchange-${tabName.toLowerCase().replace(/\s+/g, '-')}-tab`;
        return this.page.locator(`button[data-testid='${tabTestId}']`);
    }

    async exchangeDatapointsClearField(fieldName: string) {
        await test.step("Removing all items in: " + fieldName, async () => {
            await this.exchangeDatapointsDropdownField(fieldName).click();
            await this.clearFieldButton(fieldName).click();
            await this.page.keyboard.press("Escape");
        });
    }
}