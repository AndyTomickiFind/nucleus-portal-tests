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
    readonly chipButton: (label: string) => Locator;
    readonly chipButtonCloseX: (label: string) => Locator;

    readonly countriesList: string[] = [
        "Angola", "Antarctica", "Argentina", "Aruba", "Australia", "Bangladesh",
        "Belarus", "Belize", "Bosnia and Herzegovina", "Botswana", "Bouvet Island",
        "British Indian Ocean Territory", "Cambodia", "Canada", "China", "Comoros",
        "Congo, the Democratic Republic of the", "Cuba", "Curaçao", "Czech Republic",
        "Djibouti", "Ecuador", "Ethiopia", "Fiji", "Gambia", "Georgia", "Gibraltar",
        "Greece", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Lesotho", "Malawi",
        "Mali", "Malta", "Marshall Islands", "Mayotte", "Monaco", "Morocco", "Myanmar",
        "Nepal", "Netherlands Antilles", "Niger", "Norfolk Island", "Paraguay", "Peru",
        "Puerto Rico", "Saint Helena, Ascension and Tristan da Cunha", "Saint Martin (French part)",
        "Sierra Leone", "South Georgia and the South Sandwich Islands", "South Korea", "Sudan",
        "Suriname", "Sweden", "Syrian Arab Republic", "Tanzania, United Republic of", "Thailand",
        "Tonga", "Turks and Caicos Islands", "Uganda", "United Arab Emirates", "United States Minor Outlying Islands",
        "Uzbekistan", "Vietnam", "Western Sahara", "Zimbabwe", "Afghanistan", "Algeria",
        "American Samoa", "Armenia", "Barbados", "Bermuda", "Bonaire, Sint Eustatius and Saba",
        "Burkina Faso", "Cayman Islands", "Chad", "Chile", "Egypt", "Equatorial Guinea",
        "Eritrea", "Falkland Islands (Malvinas)", "Faroe Islands", "French Southern Territories",
        "Gabon", "Ghana", "Grenada", "Guernsey", "Guinea-Bissau", "Guyana", "Haiti", "Hungary",
        "Indonesia", "Iran, Islamic Republic of", "Iraq", "Jamaica", "Jersey", "Jordan",
        "Lao People's Democratic Republic", "Liberia", "Lithuania", "Macedonia, the former Yugoslav Republic of",
        "Maldives", "Mauritania", "Mexico", "Micronesia, Federated States of", "Mozambique",
        "Netherlands", "New Caledonia", "Niue", "Norway", "Pakistan", "Palau", "Poland", "Russia",
        "Saint Barthélemy", "Saint Kitts and Nevis", "Samoa", "Senegal", "Slovakia", "Slovenia", "Somalia",
        "South Sudan", "Sri Lanka", "Switzerland", "Trinidad and Tobago", "Tunisia", "Turkey",
        "Ukraine", "United Kingdom", "United States", "Uruguay", "Vanuatu", "Anguilla",
        "Antigua and Barbuda", "Bolivia", "Brunei", "Bulgaria", "Cameroon", "Colombia",
        "Congo", "Denmark", "Dominican Republic", "Estonia", "Finland", "French Guiana",
        "French Polynesia", "Guadeloupe", "Holy See (Vatican City State)", "Hong Kong",
        "Ireland", "Italy", "Lebanon", "Libya", "Madagascar", "Moldova, Republic of",
        "Montenegro", "Montserrat", "Nauru", "Nigeria", "Oman", "Panama", "Papua New Guinea",
        "Saint Lucia", "Saint Pierre and Miquelon", "San Marino", "Sao Tome and Principe",
        "Saudi Arabia", "Serbia", "Seychelles", "South Africa", "Spain", "Taiwan", "Tajikistan",
        "Togo", "Tokelau", "Virgin Islands, U.S.", "Wallis and Futuna", "Yemen", "Zambia",
        "Åland Islands", "Albania", "Andorra", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
        "Belgium", "Benin", "Bhutan", "Brazil", "Burundi", "Cape Verde", "Central African Republic",
        "Christmas Island", "Cocos (Keeling) Islands", "Cook Islands", "Costa Rica", "Croatia",
        "Cyprus", "Dominica", "El Salvador", "France", "Germany", "Greenland", "Guam", "Guatemala",
        "Guinea", "Heard Island and McDonald Islands", "Honduras", "Iceland", "India", "Isle of Man",
        "Israel", "Ivory Coast", "Japan", "Kazakhstan", "Kenya", "Korea, Democratic People's Republic of",
        "Latvia", "Liechtenstein", "Luxembourg", "Macao", "Malaysia", "Martinique", "Mauritius",
        "Mongolia", "Namibia", "New Zealand", "Nicaragua", "Northern Mariana Islands",
        "Palestinian Territory, Occupied", "Philippines", "Pitcairn", "Portugal", "Qatar", "Réunion",
        "Romania", "Rwanda", "Saint Vincent & the Grenadines", "Singapore", "Sint Maarten (Dutch part)",
        "Solomon Islands", "Svalbard and Jan Mayen", "Swaziland", "Timor-Leste", "Turkmenistan", "Tuvalu",
        "Venezuela", "Virgin Islands, British"
    ];

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
        this.dropdownHeader = (headerName: string) => page.locator(`div[data-testid='${headerName}']`);
        this.chipButton = (label: string) => page.getByRole("button").locator(`//*[contains(text(),'${label}')]`);
        this.chipButtonCloseX = (label: string) =>
            this.page.locator(`//*[contains(text(),'${label}')]/..//*[@data-testid='CancelIcon']`);
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


    async clickItemFromCombobox(comboboxLocator: Locator, items: string[], exact: boolean = true
    ): Promise<void> {
        await comboboxLocator.click();
        for (const item of items) {
            await comboboxLocator.locator("input").fill(item);
            await this.page.waitForLoadState();
            const itemLocator: Locator = this.page.getByRole('option', {name: item, exact: exact});
            await itemLocator.click();
        }
        await this.page.keyboard.press('Escape');
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


