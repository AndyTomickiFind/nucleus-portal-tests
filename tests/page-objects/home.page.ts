import {BasePage} from "./base.page";
import {BrowserContext, expect, Locator, Page, TestInfo} from "@playwright/test";


export class HomePage extends BasePage {

    readonly testInfo: TestInfo;
    readonly welcomeBanner: Locator;

    constructor(page: Page, context: BrowserContext, testInfo: TestInfo) {
        super(page, context);
        this.testInfo = testInfo;
        this.welcomeBanner = page.locator('//h5')
    }

    async checkWelcomeBanner(bannerText: string) {
        await expect(this.welcomeBanner).toContainText(bannerText);
    }
}
