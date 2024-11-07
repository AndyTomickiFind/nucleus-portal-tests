import {BasePage} from "./base.page";
import {BrowserContext, expect, Locator, Page, TestInfo} from "@playwright/test";


export class ShortReviewsPage extends BasePage {

    readonly testInfo: TestInfo;
    readonly welcomeBanner: Locator;
    readonly toplistCombobox: Locator;
    readonly statusCombobox: Locator;
    readonly toplistProductCombobox: Locator;  //topilist ;)

    constructor(page: Page, context: BrowserContext, testInfo: TestInfo) {
        super(page, context);
        this.testInfo = testInfo;
        this.welcomeBanner = page.locator('//h5');
        this.toplistCombobox = page.getByTestId('short-review-toplist-filter-autocomplete');
        this.statusCombobox = page.getByTestId('short-review-status-filter');
        this.toplistProductCombobox = page.getByTestId('short-review-product-filter');

    }

    async checkWelcomeBanner(bannerText: string) {
        await expect(this.welcomeBanner).toContainText(bannerText);
    }
}
