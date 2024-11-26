import {BasePage} from "./base.page";
import {BrowserContext, Locator, Page, TestInfo} from "@playwright/test";

export class ToplistsUI extends BasePage {
    readonly testInfo: TestInfo;

    readonly toplistContainer: Locator;
    readonly toplistItem: Locator;


    constructor(page: Page, context: BrowserContext, testInfo: TestInfo) {
        super(page, context);
        this.testInfo = testInfo;

        this.toplistContainer = page.locator(`.toplist-table-container`);
        this.toplistItem = this.toplistContainer.locator('.toplist-table-item');


    }

    async nthToplistItem(nth: number): Promise<Locator> {
        return this.toplistContainer.locator(`.toplist-table-item`).nth(nth);
    }


}


