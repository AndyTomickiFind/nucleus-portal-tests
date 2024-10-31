import {BrowserContext, expect, Locator, Page, TestInfo} from "@playwright/test";
import {BasePage} from "../base.page";


async function verifyAndClickMenuItem(menuItem: Locator, expectedText: string): Promise<void> {
    await expect(menuItem).toContainText(expectedText);
    await menuItem.click({trial: true});
}

export class MenuComponent extends BasePage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly testInfo: TestInfo;
    readonly menubar: Locator;
    readonly menubarItem_Home: Locator;
    readonly menubarItem_Toplists: Locator;
    readonly menubarItem_ShortReviews: Locator;
    readonly menubarItem_Partners: Locator;
    readonly menubarItem_Database: Locator;
    readonly subToplistsMenuItem_Search: Locator;
    readonly subToplistsMenuItem_New: Locator;
    readonly subShortReviewsMenuItem_Search: Locator;
    readonly subPartnersMenuItem_Casinos: Locator;
    readonly subDatabaseMenuItem_Datapoints: Locator;
    readonly menubarItem_User: Locator;
    readonly subUserMenuItem_LogOut: Locator;


    constructor(page: Page, context: BrowserContext, testInfo: TestInfo) {
        super(page, context);
        this.page = page;
        this.context = context;
        this.testInfo = testInfo;
        this.menubar = page.locator("//div[@class='MuiBox-root mui-0']");

        //MainMenu
        this.menubarItem_Home = page.locator("//a[.='Home']");
        this.menubarItem_Toplists = page.locator("//a[.='Toplists']");
        this.menubarItem_ShortReviews = page.locator("//a[.='Short Reviews']");
        this.menubarItem_Partners = page.locator("//button[.='Partners']");
        this.menubarItem_Database = page.locator("//button[.='Database']");
        this.menubarItem_User = page.getByRole('button', { name: `User profile picture ${process.env.GOOGLE_UI_USERNAME}` })

        //SubMenus
        this.subToplistsMenuItem_Search = page.locator("//a[contains(@role, 'menuitem') and text() = 'Search']");
        this.subToplistsMenuItem_New = page.locator("//a[contains(@role, 'menuitem') and text() = 'New']");
        this.subShortReviewsMenuItem_Search = page.locator("//a[contains(@role, 'menuitem') and text() = 'Search']");
        this.subPartnersMenuItem_Casinos = page.locator("//a[contains(@role, 'menuitem') and text() = 'Casinos']");
        this.subDatabaseMenuItem_Datapoints = page.getByText('Datapoints');
        this.subUserMenuItem_LogOut = page.getByRole('menuitem', { name: 'Log out' });
    }

    async checkMenuItems() {
        // SubMenu USER
        await this.menubarItem_User.click();
        await verifyAndClickMenuItem(this.subUserMenuItem_LogOut, "Log out");
        await this.page.keyboard.press('Escape');

        // MainMenu
        await verifyAndClickMenuItem(this.menubarItem_User, process.env.GOOGLE_UI_USERNAME);
        await verifyAndClickMenuItem(this.menubarItem_Home, "Home");
        await verifyAndClickMenuItem(this.menubarItem_Toplists, "Toplists");
        await verifyAndClickMenuItem(this.menubarItem_ShortReviews, "Short Reviews");
        await verifyAndClickMenuItem(this.menubarItem_Partners, "Partners");
        await verifyAndClickMenuItem(this.menubarItem_Database, "Database");


        // SubMenu TOPLISTS
        await this.menubarItem_Toplists.hover();
        await verifyAndClickMenuItem(this.subToplistsMenuItem_Search, "Search");
        await verifyAndClickMenuItem(this.subToplistsMenuItem_New, "New");

        // SubMenu SHORT REVIEWS
        await this.menubarItem_ShortReviews.hover();
        await verifyAndClickMenuItem(this.subShortReviewsMenuItem_Search, "Search");

        // SubMenu PARTNERS
        await this.menubarItem_Partners.hover();
        await verifyAndClickMenuItem(this.subPartnersMenuItem_Casinos, "Casinos");

        // SubMenu DATABASE
        await this.menubarItem_Database.hover();
        await verifyAndClickMenuItem(this.subDatabaseMenuItem_Datapoints, "Datapoints");
    }

    async checkDataPointItems() {
        const dataPointItems: string[] = [
            "Coins",
            "Community Socials",
            "Contact Methods",
            "Crypto Pairs",
            "Currencies",
            "Deposit Methods",
            "Educational Resources",
            "Insurance Providers",
            "Languages",
            "Licenses",
            "Order Types",
            "Payment Types",
            "Positions",
            "Product Categories",
            "Products",
            "Registration Steps",
            "Security Methods",
            "Slot Providers",
            "Sport Types",
            "Sports",
            "Support Issues",
            "Withdrawal Methods"
        ];


        await this.menubarItem_Database.click();
        await this.subDatabaseMenuItem_Datapoints.click();

        for (const dataPointItem of dataPointItems) {
            const menuItemLocator: Locator = this.page.getByRole('menuitem', {name: `${dataPointItem}`});
            await verifyAndClickMenuItem(menuItemLocator, dataPointItem)
        }
    }
}