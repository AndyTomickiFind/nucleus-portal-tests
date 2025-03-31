import {BasePage} from "./base.page";
import {BrowserContext, Locator, Page, TestInfo} from "@playwright/test";
import {test} from "../fixtures/fixtures";

export class CasinosPage extends BasePage {

    readonly testInfo: TestInfo;
    readonly topHeader: Locator;
    readonly casinoNameFilterField: Locator;
    readonly sortButton: Locator;
    readonly saveButton: Locator;
    readonly newCasinoButton: Locator;
    readonly firstDomainButton: Locator;
    readonly domainButton: (label: string) => Locator;
    readonly noBonusToggle: Locator;
    readonly casinoNameField: Locator;
    readonly clearFieldButton: (name: string) => Locator;
    readonly casinoDatapointsDropdownField: (label: string) => Locator;
    readonly casinoDatapointsValidationLabel: (name: string) => Locator;
    readonly selectedContentLanguagesDropdown: Locator;
    readonly selectedDomainsDropdown: Locator;
    readonly statusDropdown: Locator;


    constructor(page: Page, context: BrowserContext, testInfo: TestInfo) {
        super(page, context);
        this.testInfo = testInfo;

        // Mapping locators in the constructor
        this.topHeader = page.locator('//h5');
        this.casinoNameFilterField = page.locator(`//input[@id='casino-name-filter-field']`);
        this.sortButton = page.locator("button[aria-label='Sort']");
        this.saveButton = page.getByTestId(`casino-submit-button`);
        this.newCasinoButton = page.locator("button[data-testid='add-casino-button']");
        this.firstDomainButton = page.locator("//div[contains(@data-testid, 'casino-bonuses-form-domain-chip-')]").first();
        this.domainButton = (label: string) =>
            page.locator(`//div[contains(@data-testid, 'casino-bonuses-form-domain-chip-')and .='${label}']`);
        this.noBonusToggle = page.locator('//input[@id="casino-domain-has-bonuses-toggle"]');
        this.casinoNameField = page.locator('//input[@id="casino-general-info-form-field-name"]');
        this.clearFieldButton = (label: string) =>
            this.casinoDatapointsDropdownField(label).locator(" //*[@data-testid='CloseIcon']");
        this.casinoDatapointsDropdownField = (label: string) =>
            page.locator(`//label[.='${label}']/..`);
        this.casinoDatapointsValidationLabel = (name: string) =>
            page.locator(`//p[@id='casino-datapoints-form-${name}-autocomplete-field-helper-text']`);
        this.selectedContentLanguagesDropdown = page.getByTestId(`casino-content-languages-codes-autocomplete`);
        this.selectedDomainsDropdown = page.getByTestId(`casino-domains-autocomplete-field`);
        this.statusDropdown = page.getByTestId(`casino-status-select`);


    }

    /**
     * Filter by Casino Name
     * @param casinoName - Name of the casino
     */
    async filterByCasinoName(casinoName: string) {
        await this.casinoNameFilterField.fill(casinoName);
        await this.casinoNameFilterField.press('Enter');
    }

    getTabLocator(tabName: string): Locator {
        const tabTestId = `casino-${tabName.toLowerCase().replace(/\s+/g, '-')}-tab`;
        return this.page.locator(`button[data-testid='${tabTestId}']`);
    }

    async casinoDatapointsClearField(fieldName: string) {
        await test.step("Removing all items in: " + fieldName, async () => {
            await this.casinoDatapointsDropdownField(fieldName).click();
            await this.clearFieldButton(fieldName).click();
            await this.page.keyboard.press('Escape');
        });
    }
}