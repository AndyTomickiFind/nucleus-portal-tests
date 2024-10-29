import {BasePage} from "./base.page";
import {BrowserContext, Locator, Page, TestInfo} from "@playwright/test";
import config from "../../playwright.config";


export class LoginPage extends BasePage {

    readonly testInfo: TestInfo;
    readonly signInWithGoogleButton: Locator;

    constructor(page: Page, context: BrowserContext, testInfo: TestInfo) {
        super(page, context);
        this.testInfo = testInfo;
        this.signInWithGoogleButton = page.locator('button[tabindex="0"]')
    }

    async login(userName: string, password: string): Promise<void> {
        // await this.context.addCookies([{name: 'access_token', value: process.env.DEV_ACCESS_TOKEN, url: `https://${config.baseUrl}`}]);
        // await this.context.addCookies([{name: 'refresh_token', value: process.env.DEV_REFRESH_TOKEN, url: `https://${config.baseUrl}`}]);
        await this.signInWithGoogleButton.click();
        await this.page.fill('input[type="email"]', userName)
        await this.page.click('#identifierNext')
        await this.page.fill('input[type="password"]', password)
        await this.page.click('#passwordNext')
        await this.page.waitForLoadState();
        await this.page.waitForSelector('//*[.="Hello Nucleus"]');
    }

    async navigateToNucleusPortal() {
        await this.navigateTo(`https://${config.baseUrl}`);
    }

}
