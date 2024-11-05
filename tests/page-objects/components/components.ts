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
    readonly dataGridRow: Locator;
    readonly rowsPerPageDropdown: Locator;
    readonly previousPageButton: Locator;
    readonly nextPageButton: Locator;
    readonly displayedRowsLabel: Locator;
    readonly newButton: Locator;
    readonly divider: Locator;

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
        this.dataGridRow = page.getByRole("row");
        this.rowsPerPageDropdown = page.locator("//p[.='Rows per page:']/..//*[@role='combobox']");
        this.nextPageButton = page.locator("//button[@aria-label='Go to next page']");
        this.previousPageButton = page.locator("//button[@aria-label='Go to previous page']");
        this.displayedRowsLabel = page.locator("//p[@class='MuiTablePagination-displayedRows mui-1chpzqh']");
        this.newButton = page.locator("//button[@aria-label='New']");
        this.divider = page.getByRole('separator');
    }

    dataGridCell(column: string, rowNumber: number): Locator {
        return this.page.locator(`//div[@data-rowindex="${rowNumber - 1}"]//div[@data-field="${column}"]`)
    }

    async checkAlertBanner(bannerText: string) {
        await expect(this.alertBanner).toContainText(bannerText);
    }


    async checkCombobox(comboboxLocator: Locator, expectedItems: string[]): Promise<void> {
        await comboboxLocator.click();
        for (const item of expectedItems) {
            const itemLocator: Locator = this.page.getByRole('option', {name: item, exact: true})
            await expect(itemLocator).toContainText(item);
            await itemLocator.click({trial: true});
        }
        await this.page.keyboard.press('Escape');
    }

    async clickItemFromCombobox(comboboxLocator: Locator, item: string): Promise<void> {
        await comboboxLocator.click();
        const itemLocator: Locator = this.page.getByRole('option', {name: item, exact: true})
        await itemLocator.click();
    }

    async checkRowsInDataGrid(rowsCount: number) {
        await this.clickItemFromCombobox(this.rowsPerPageDropdown, rowsCount.toString());

        for (let row = 1; row <= rowsCount; row++) {
            await this.dataGridCell("name", row).click({trial: true});
            await this.dataGridCell("domains", row).click({trial: true});
            await this.dataGridCell("type", row).click({trial: true});
            await this.dataGridCell("subType", row).click({trial: true});
            await this.dataGridCell("status", row).click({trial: true});
            await this.dataGridCell("updatedAt", row).click({trial: true});
        }
    }

    async checkDividers(dividersLabels: string[]) {
        for (const dividerLabel of dividersLabels) {
            const dividerLocator = this.divider.and(this.page.locator(`//*[.='${dividerLabel}']`));
            await dividerLocator.scrollIntoViewIfNeeded();
            await expect(dividerLocator).toBeVisible();
        }
    }
}


