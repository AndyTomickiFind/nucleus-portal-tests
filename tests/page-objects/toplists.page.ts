import {BasePage} from "./base.page";
import {BrowserContext, Locator, Page, TestInfo} from "@playwright/test";


export class ToplistsPage extends BasePage {

    readonly testInfo: TestInfo;
    readonly searchField: Locator;

    constructor(page: Page, context: BrowserContext, testInfo: TestInfo) {
        super(page, context);
        this.testInfo = testInfo;
        this.searchField = this.page.getByTestId(`toplist-name-filter-field`).locator(`input`);
    }


}
