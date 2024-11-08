import {BasePage} from "./base.page";
import {BrowserContext, expect, Locator, Page, TestInfo} from "@playwright/test";


export class ShortReviewsPage extends BasePage {

    readonly testInfo: TestInfo;
    readonly welcomeBanner: Locator;
    readonly toplistCombobox: Locator;
    readonly statusCombobox: Locator;
    readonly toplistProductCombobox: Locator;  //topilist ;)

    // Short Review Editor:
    readonly gridTopBox: Locator;
    readonly englishTranslationRichTextEditor: Locator
    readonly saveButton: Locator;

    constructor(page: Page, context: BrowserContext, testInfo: TestInfo) {
        super(page, context);
        this.testInfo = testInfo;
        this.welcomeBanner = page.locator('//h5');
        this.toplistCombobox = page.getByTestId('short-review-toplist-filter-autocomplete');
        this.statusCombobox = page.getByTestId('short-review-status-filter');
        this.toplistProductCombobox = page.getByTestId('short-review-product-filter');

        // Short Review Editor:
        this.gridTopBox = page.locator('//div[contains(@class, "MuiPaper-outlined")]');
        this.englishTranslationRichTextEditor = page.getByTestId("short-review-content-translation-rich-text-editor-container-0");
        this.saveButton = page.getByTestId("short-review-submit-button");
    }

    async checkWelcomeBanner(bannerText: string) {
        await expect(this.welcomeBanner).toContainText(bannerText);
    }
}
