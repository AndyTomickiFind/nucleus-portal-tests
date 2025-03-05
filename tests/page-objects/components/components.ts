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
    readonly toplistAutomationCombobox: Locator;
    readonly dataGrid: Locator;
    readonly dataGridRow: Locator;
    readonly rowsPerPageDropdown: Locator;
    readonly previousPageButton: Locator;
    readonly nextPageButton: Locator;
    readonly displayedRowsLabel: Locator;
    readonly newButton: Locator;
    readonly divider: Locator;
    readonly dropdownHeader: (headerName: string) => Locator;

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
        this.toplistAutomationCombobox = page.getByTestId('toplist-automation-select');
        this.dataGrid = page.locator('//div[contains(@class, "MuiDataGrid-root")]');
        this.dataGridRow = page.getByRole("row");
        this.rowsPerPageDropdown = page.locator("//p[.='Rows per page:']/..//*[@role='combobox']");
        this.nextPageButton = page.locator("//button[@aria-label='Go to next page']");
        this.previousPageButton = page.locator("//button[@aria-label='Go to previous page']");
        this.displayedRowsLabel = page.locator("//p[contains(@class, 'MuiTablePagination-displayedRows')]");
        this.newButton = page.locator("//button[@aria-label='New']");
        this.divider = page.getByRole('separator');
        this.dropdownHeader = (headerName: string) =>
            page.locator(`div[data-testid='${headerName}']`);
    }

    dataGridCell(column: string, rowNumber: number): Locator {
        return this.page.locator(`//div[@data-rowindex="${rowNumber - 1}"]//div[@data-field="${column}"]`)
    }

    async dblClickDataGridRow(rowNumber: number): Promise<void> {
        const dataGridRow = this.page.locator(`//div[@data-rowindex="${rowNumber - 1}"]`);
        await expect(this.dataGrid.locator(dataGridRow)).toBeVisible();
        await this.dataGrid.locator(dataGridRow).dblclick();
    }

    async checkAlertBanner(bannerText: string) {
        await expect(this.alertBanner, `Alert banner should contain text :"${bannerText}"`).toContainText(bannerText);
    }


    async checkCombobox(comboboxLocator: Locator, expectedItems: string[]): Promise<void> {
        await comboboxLocator.click();
        for (const item of expectedItems) {
            await comboboxLocator.locator("input").fill(item);
            const itemLocator: Locator = this.page.getByRole('option', {name: item, exact: true})
            await expect(itemLocator).toContainText(item);
            await itemLocator.click({trial: true});
            await comboboxLocator.locator("input").clear();
        }
        await this.page.keyboard.press('Escape');
    }


    async clearCombobox(comboboxLocator: Locator): Promise<void> {
        await comboboxLocator.click();
        const closeIcon = comboboxLocator.getByTestId("CloseIcon");
        if (await closeIcon.isVisible()) {
            await closeIcon.click();
        }
        await this.page.keyboard.press('Escape');
    }


    async clickItemFromCombobox(comboboxLocator: Locator, item: string, exact: boolean = true
    ): Promise<void> {
        await comboboxLocator.click();
        await comboboxLocator.locator("input").fill(item);
        await this.page.waitForLoadState();
        const itemLocator: Locator = this.page.getByRole('option', {name: item, exact: exact})
        await itemLocator.click();
    }

    async selectFromDropdown(comboboxLocator: Locator, item: string): Promise<void> {
        await comboboxLocator.click();
        const itemLocator: Locator = this.page.getByRole('option', {name: item, exact: true})
        await itemLocator.click();
    }

    async checkRowsInDataGrid(rowsCount: number, dataGridCells: string[]) {
        await this.selectFromDropdown(this.rowsPerPageDropdown, rowsCount.toString());

        for (let row = 1; row <= rowsCount; row++) {
            for (const cell of dataGridCells) {
                await this.dataGridCell(cell, row).click({trial: true});
            }
        }
    }

    async checkDividers(dividersLabels: string[]) {
        for (const dividerLabel of dividersLabels) {
            const dividerLocator = this.divider.and(this.page.locator(`//*[.='${dividerLabel}']`));
            await dividerLocator.scrollIntoViewIfNeeded();
            await expect(dividerLocator).toBeVisible();
        }
    }

    //check if the element contains all the strings
    async elementContainsLabels(elementLocator: Locator, labels: string[]) {
        for (const label of labels) {
            await expect(elementLocator, `Element should contain text:"${label}"`).toContainText(label);
        }
    }

    async openDropdown(headerName: string) {
        await this.dropdownHeader(headerName).click();
    }
}


