import {BrowserContext, expect, Locator, Page, TestInfo} from "@playwright/test";
import {BasePage} from "../base.page";


export class components extends BasePage {
    readonly page: Page;
    readonly context: BrowserContext;
    readonly testInfo: TestInfo;
    readonly alertBanner: Locator;
    readonly productCombobox: Locator;
    readonly countriesCombobox: Locator;
    readonly verticalCombobox: Locator;
    readonly subVerticalCombobox: Locator;
    readonly dataGrid: Locator;


    constructor(page: Page, context: BrowserContext, testInfo: TestInfo) {
        super(page, context);
        this.page = page;
        this.context = context;
        this.testInfo = testInfo;
        this.alertBanner = page.getByRole('alert').first();
        this.productCombobox = page.getByTestId('domain-id-select');
        this.countriesCombobox = page.getByTestId('country-code-select');
        this.verticalCombobox = page.getByTestId('type-select');
        this.subVerticalCombobox = page.getByTestId('sub-type-select');
        this.dataGrid = page.locator('//div[contains(@class, "MuiDataGrid-root")]');
    }


    async checkAlertBanner(bannerText: string) {
        await expect(this.alertBanner).toContainText(bannerText);
    }


    async checkCombobox(comboboxLocator: Locator, expectedItems: string[]): Promise<void> {
        await comboboxLocator.click();
        for (const item of expectedItems) {
            const itemLocator: Locator = this.page.getByRole('option', { name: item, exact: true })
            await expect(itemLocator).toContainText(item);
            await itemLocator.click({trial: true});
        }
        await this.page.keyboard.press('Escape');
    }

    async clickItemFromCombobox(comboboxLocator: Locator, item: string): Promise<void> {
        await comboboxLocator.click();
        const itemLocator: Locator = this.page.getByRole('option', { name: item, exact: true })
        await itemLocator.click();
        await this.page.keyboard.press('Escape');
    }

}


