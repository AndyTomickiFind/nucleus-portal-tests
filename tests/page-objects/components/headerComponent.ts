import {BrowserContext, expect, Locator, Page, TestInfo} from "@playwright/test";
import {BasePage} from "../base.page";

export class HeaderComponent extends BasePage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly testInfo: TestInfo;
    readonly menubar: Locator;
    readonly menubarItemHome: Locator;
    readonly menubarItemToplists: Locator;
    readonly menubarItemShortReviews: Locator;
    readonly menubarItemPartners: Locator;
    readonly menubarItemDatabase: Locator;


    constructor(page: Page, context: BrowserContext, testInfo: TestInfo) {
        super(page, context);
        this.page = page;
        this.context = context;
        this.testInfo = testInfo;
        this.menubar = page.locator("//div[@class='MuiBox-root mui-0']");
        this.menubarItemHome = page.locator("//a[.='Home']");
        this.menubarItemToplists = page.locator("//a[.='Toplists']");
        this.menubarItemShortReviews = page.locator("//a[.='Short Reviews']");
        this.menubarItemPartners = page.locator("//button[.='Partners']");
        this.menubarItemDatabase = page.locator("//button[.='Database']");
    }


    async toHaveMenuItems() {
        await expect(this.menubarItemHome).toContainText("Home");
        await expect(this.menubarItemToplists).toContainText("Toplists");
        await expect(this.menubarItemShortReviews).toContainText("Short Reviews");
        await expect(this.menubarItemPartners).toContainText("Partners");
        await expect(this.menubarItemDatabase).toContainText("Database");
    }

}