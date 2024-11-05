import {BasePage} from "./base.page";
import {BrowserContext, expect, Locator, Page, TestInfo} from "@playwright/test";


export class NewToplistPage extends BasePage {

    readonly testInfo: TestInfo;
    readonly newToplistHeader: Locator;


    constructor(page: Page, context: BrowserContext, testInfo: TestInfo) {
        super(page, context);
        this.testInfo = testInfo;
        this.newToplistHeader = page.locator('//h5');

    }

    async checkNewToplistHeader(bannerText: string) {
        await expect(this.newToplistHeader).toContainText(bannerText);
    }


}
