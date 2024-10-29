import {BrowserContext, expect, Locator, Page, TestInfo} from "@playwright/test";
import {test} from "../../fixtures/fixtures";
import {BasePage} from "../base.page";

export class FooterComponent extends BasePage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly testInfo: TestInfo;
    readonly footer: Locator;
    readonly copyrightText: Locator;
    readonly menu: Locator;
    readonly footerLogo: Locator;
    readonly footerBrandNote: Locator;
    readonly facebookIcon: Locator;
    readonly xIcon: Locator;
    readonly mailIcon: Locator;
    readonly bottomNavBar: Locator;

    constructor(page: Page, context: BrowserContext, testInfo: TestInfo) {
        super(page, context);
        this.page = page;
        this.context = context;
        this.testInfo = testInfo;
        this.footer = page.locator(`.wo-footer`);
        this.copyrightText = page.getByText('Property of Find.co');
        this.menu = page.locator(`ul.wo-footer-menu`);
        this.footerLogo = page.locator(`a.footer-logo`)
        this.footerBrandNote = page.getByText('Webopedia, your online tech resource');
        this.facebookIcon = page.locator('.wo-footer .wo-icon-share-facebook');
        this.xIcon = page.locator('.wo-footer .wo-icon-share-x');
        this.mailIcon = page.locator('.wo-footer .wo-icon-share-email');
        this.bottomNavBar = page.locator('ul.wo-footer-menu>li>a');
    }


    async verifyFooterLogo() {
        await expect(this.footerLogo).toBeVisible();
        await this.footerLogo.click({trial: true});
    }

    async verifyWebopediaBrandNote() {
        await expect(this.footerBrandNote).toBeVisible();
    }

    async verifySocialIcons() {
        await expect(this.facebookIcon).toBeVisible();
        await expect(this.xIcon).toBeVisible();
        await expect(this.mailIcon).toBeVisible();
        await this.facebookIcon.click({trial: true});
        await this.xIcon.click({trial: true});
        await this.mailIcon.click({trial: true});
    }

    async toHaveBottomMenuItems(bottomMenuItems: string[]) {
        const count = await bottomMenuItems.length;
        for (let i = 0; i < count; i++) {
            await test.step(`Verify menu item - ${bottomMenuItems[i]} `, async () => {
                const textContent = await this.bottomNavBar.nth(i).textContent();
                console.log('Actual text: ' + textContent)
                expect(textContent.trim()).toBe(bottomMenuItems[i].trim());
            });
        }
    }
}