import {BasePage} from "./base.page";
import {BrowserContext, expect, Locator, Page, TestInfo} from "@playwright/test";


export class DatapointsPage extends BasePage {

    readonly testInfo: TestInfo;
    readonly welcomeBanner: Locator;
    readonly nameCombobox: Locator;
    readonly datapointTypeCombobox: Locator;

    constructor(page: Page, context: BrowserContext, testInfo: TestInfo) {
        super(page, context);
        this.testInfo = testInfo;
        this.welcomeBanner = page.locator('//h5');
        this.nameCombobox = page.getByTestId('datapoint-name-filter-field');
        this.datapointTypeCombobox = page.getByTestId('datapoint-type-filter-field');
    }

    async checkWelcomeBanner(bannerText: string) {
        await expect(this.welcomeBanner).toContainText(bannerText);
    }
}
