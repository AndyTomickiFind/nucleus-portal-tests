import {BrowserContext, expect, Locator, Page, TestInfo} from "@playwright/test";
import {test} from "../../fixtures/fixtures";
import {BasePage} from "../base.page";

export class HeaderComponent extends BasePage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly testInfo: TestInfo;
    readonly menubar: Locator;
    readonly menubarItemHome: Locator;


    constructor(page: Page, context: BrowserContext, testInfo: TestInfo) {
        super(page, context);
        this.page = page;
        this.context = context;
        this.testInfo = testInfo;
        this.menubar = page.locator("//div[@class='MuiBox-root mui-0']");
        this.menubarItemHome = page.locator("//a[.='Home']");
        this.menubarItemHome = page.locator("//a[.='Toplists']");
        this.menubarItemHome = page.locator("//a[.='Short Reviews']");
        this.menubarItemHome = page.locator("//button[.='Partners']");
        this.menubarItemHome = page.locator("//button[.='Database']");
    }


    async toHaveMenuItems(menuItems: string[]) {
        const count = menuItems.length;
        for (let i = 0; i < count; i++) {
            await test.step(`Verify menu item - ${menuItems[i]} `, async () => {
                const textContent = await this.menubar.textContent();
                console.log('Actual text: ' + textContent)
                expect(textContent.trim().toLowerCase()).toContain(menuItems[i].trim().toLowerCase());
            });
        }
    }

}