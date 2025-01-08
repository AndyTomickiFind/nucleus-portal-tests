import {BasePage} from "./base.page";
import {BrowserContext, Locator, Page, TestInfo} from "@playwright/test";

export class CasinosPage extends BasePage {

    readonly testInfo: TestInfo;
    readonly casinoNameFilterField: Locator;
    readonly sortButton: Locator;
    readonly newCasinoButton: Locator;

    constructor(page: Page, context: BrowserContext, testInfo: TestInfo) {
        super(page, context);
        this.testInfo = testInfo;

        // Mapping locators in the constructor
        this.casinoNameFilterField = page.getByTestId(`casino-name-filter-field`);
        this.sortButton = page.locator("button[aria-label='Sort']");
        this.newCasinoButton = page.locator("button[data-testid='add-casino-button']");
    }

    /**
     * Filter by Casino Name
     * @param casinoName - Name of the casino
     */
    async filterByCasinoName(casinoName: string) {
        await this.casinoNameFilterField.fill(casinoName);
        await this.casinoNameFilterField.press('Enter');
    }

}