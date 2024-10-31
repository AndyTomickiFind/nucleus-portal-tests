import {BasePage} from "./base.page";
import {BrowserContext, expect, Locator, Page, TestInfo} from "@playwright/test";


export class ToplistsPage extends BasePage {

    readonly testInfo: TestInfo;
    readonly alertBanner: Locator;

    constructor(page: Page, context: BrowserContext, testInfo: TestInfo) {
        super(page, context);
        this.testInfo = testInfo;
        this.alertBanner = page.getByRole('alert').first();
    }

     async checkAlertBanner(bannerText: string) {
         await expect(this.alertBanner).toContainText(bannerText);
     }
}
