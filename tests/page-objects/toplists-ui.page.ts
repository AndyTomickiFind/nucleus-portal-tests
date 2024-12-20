import {BasePage} from "./base.page";
import {BrowserContext, expect, Locator, Page, TestInfo} from "@playwright/test";

export class ToplistsUI extends BasePage {
    readonly testInfo: TestInfo;

    readonly toplistContainer: Locator;
    readonly toplistItem: Locator;
    readonly doNotConsentButton: Locator;



    constructor(page: Page, context: BrowserContext, testInfo: TestInfo) {
        super(page, context);
        this.testInfo = testInfo;

        this.toplistContainer = page.locator(`.toplist-table-container`);
        this.toplistItem = this.toplistContainer.locator(`.toplist-table-item`);
        this.doNotConsentButton = page.locator(`//button[@class="fc-button fc-cta-do-not-consent fc-secondary-button"]`);
    }

    async nthToplistItem(nth: number): Promise<Locator> {
        return this.toplistContainer.locator(`.toplist-table-item`).nth(nth);
    }

    async compareExpectedToActualElements(topListsResultsJson) {
        //const desiredField = topListsResultsJson.sites[0].name;

        await expect(this.toplistContainer).toBeVisible();

        const numberOfItems: number = topListsResultsJson.length;

        await expect(this.toplistItem, `There must be ${numberOfItems} items in the toplist`).toHaveCount(numberOfItems);



        for (const [index, itemJson] of topListsResultsJson.entries()){
            const nthItemLocator: Locator = await this.nthToplistItem(index);
           // console.log(itemJson.description);
            console.log(nthItemLocator.textContent())
        }

    }

}



