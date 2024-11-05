import {BasePage} from "./base.page";
import {BrowserContext, Page, TestInfo} from "@playwright/test";


export class ToplistsPage extends BasePage {

    readonly testInfo: TestInfo;


    constructor(page: Page, context: BrowserContext, testInfo: TestInfo) {
        super(page, context);
        this.testInfo = testInfo;

    }


}
