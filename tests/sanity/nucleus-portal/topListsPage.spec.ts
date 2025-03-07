import {test} from "../../fixtures/fixtures";
import {expect} from "@playwright/test";
import config from "../../../playwright.config";

test.describe(`TOPLISTS subpage - ${config.name} `, {tag: [`@${config.name}`]}, () => {

    test.beforeEach(async ({ToplistsPage, menuComponent}) => {
        await ToplistsPage.page.goto(`https://${config.baseUrl}`);
        await menuComponent.menubarItem_Toplists.click();
        await ToplistsPage.page.mouse.move(20, 20) //get rid of the submenu popup
        await ToplistsPage.page.waitForLoadState();
    });

    test('check the title and url', async ({ToplistsPage}) => {
        await ToplistsPage.page.waitForURL('**/toplists');
        expect(await ToplistsPage.page.title()).toBe('Nucleus Portal');
        expect(ToplistsPage.page.url()).toBe(`https://${config.baseUrl}/toplists`);
    });

    test('verify that the expected menu items are displayed and clickable', async ({menuComponent}) => {
        await menuComponent.checkMenuItems();
        await menuComponent.checkDataPointItems();
    });

    test('check the alert banner', async ({components}) => {
        await components.checkAlertBanner("Please use the name search or select a filter to view the Toplists");
    });

    test('check comboBoxes', async ({components}) => {
        await test.step("Product combobox", async () => {
            const productComboboxItems: string[] = [
                "Select an option",
                "[QA] GeneralTestDomain"
            ]
            await components.checkCombobox(components.productCombobox, productComboboxItems);
        });

        await test.step("Countries combobox", async () => {
            const headerOption: string = "Select an option";
            const countries: string[] = [
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

            const countriesComboboxItems: string[] = [headerOption, ...countries];
            await components.checkCombobox(components.countriesCombobox, countriesComboboxItems);
        });

        await test.step("Vertical combobox", async () => {
            const verticalComboboxItems: string[] = [
                "Select an option",
                "Casinos",
                "Exchanges"
            ]
            await components.checkCombobox(components.verticalCombobox, verticalComboboxItems);
        });

        await test.step("SubVertical combobox", async () => {
            const subVerticalComboboxItems: string[] = [
                "Select an option",
                "Default",
                "Casino",
                "Gambling",
                "Sport"
            ]
            await components.checkCombobox(components.subVerticalCombobox, subVerticalComboboxItems);
        });

        await test.step("Toplist Automation combobox", async () => {
            const toplistAutomationComboboxItems: string[] = [
                "Select an option",
                "Included",
                "Excluded"
            ]
            await components.checkCombobox(components.toplistAutomationCombobox, toplistAutomationComboboxItems);
        });
    });

    test('check the search by Country', async ({components}) => {
        await test.step("`QA Toplist` must be visible when selecting `Cyprus` on ccn.com", async () => {
            await components.clickItemFromCombobox(components.productCombobox, ["ccn.com"]);
            await expect(components.dataGrid).toBeVisible();
            await components.clickItemFromCombobox(components.countriesCombobox, ["Cyprus"]);
            await expect(components.dataGridCell("name", 1)).toContainText("QA Toplist");
            await expect(components.dataGridCell("domains", 1)).toContainText("ccn.com");
            await expect(components.dataGridCell("type", 1)).toContainText("Casinos");
            await expect(components.dataGridCell("subType", 1)).toContainText("Default");
            await expect(components.dataGridCell("status", 1)).toContainText("Published");
            await expect(components.dataGridCell("updatedAt", 1)).toContainText("/2025,");
        })
    });

    test('pagination and Data Grid items', async ({components}) => {
        //  test.skip(process.env.TEST_ENV === 'staging', 'Not enough Toplists in staging env to test pagination');

        await components.clickItemFromCombobox(components.productCombobox, ["ccn.com"]);
        await components.clickItemFromCombobox(components.countriesCombobox, ["Select an option"]);
        await test.step("Select 25 items per page", async () => {
            await components.checkRowsInDataGrid(25, ["name", "domains", "type", "subType", "status", "automation", "updatedAt"]);
            await expect(components.displayedRowsLabel).toContainText("1–25 of ");
        });
        await test.step("Select 15 items per page", async () => {
            await components.checkRowsInDataGrid(15, ["name", "domains", "type", "subType", "status", "automation", "updatedAt"]);
            await expect(components.displayedRowsLabel).toContainText("1–15 of ");
        });
        await test.step("Select 10 items per page", async () => {
            await components.checkRowsInDataGrid(10, ["name", "domains", "type", "subType", "status", "automation", "updatedAt"]);
            await expect(components.displayedRowsLabel).toContainText("1–10 of ");
        });
        await test.step("Check Next Page and Previous Page buttons", async () => {
            await components.nextPageButton.click();
            await expect(components.displayedRowsLabel).toContainText("11–20 of ");
            await components.nextPageButton.click();
            await expect(components.displayedRowsLabel).toContainText("21–30 of ");
            await components.previousPageButton.click();
            await expect(components.displayedRowsLabel).toContainText("11–20 of ");
            await components.previousPageButton.click();
            await expect(components.displayedRowsLabel).toContainText("1–10 of ");
        });
    });

    //COPY TOPLIST - TO DO

    test('save Filters in the Toplist', async ({components, ToplistsPage, NewToplistPage}) => {

        await test.step("Open a toplist", async () => {
            await ToplistsPage.page.waitForTimeout(1000);
            await ToplistsPage.searchField.fill("[QA] Filter check Toplist");
            await components.dataGridCell("name", 1).dblclick();
            await NewToplistPage.advancedFiltersAccordion.click();
        });

        await test.step("Clear all of the filters and save", async () => {
            await components.clearCombobox(NewToplistPage.coinsCombobox);
            await components.clearCombobox(NewToplistPage.licensesCombobox);
            await components.clearCombobox(NewToplistPage.depositMethodsCombobox);
            await components.clearCombobox(NewToplistPage.casinoProductsCombobox);
            await components.clearCombobox(NewToplistPage.currenciesCombobox);
            await components.clearCombobox(NewToplistPage.sportsCombobox);
            await NewToplistPage.createButton.click();
            await ToplistsPage.page.waitForTimeout(1000);
        });

        await test.step("Open a toplist again", async () => {
            await components.dataGridCell("name", 1).dblclick();
            await NewToplistPage.advancedFiltersAccordion.click();
        });

        await test.step("Filters must be empty", async () => {
            await expect(NewToplistPage.coinsCombobox.getByRole("button").getByText("[QA] Coin 1")).not.toBeVisible();
            await expect(NewToplistPage.coinsCombobox.getByRole("button").getByText("[QA] Coin 2")).not.toBeVisible();
            await expect(NewToplistPage.licensesCombobox.getByRole("button").getByText("[QA] License 1")).not.toBeVisible();
            await expect(NewToplistPage.depositMethodsCombobox.getByRole("button").getByText("[QA] Deposit Method 1")).not.toBeVisible();
            await expect(NewToplistPage.casinoProductsCombobox.getByRole("button").getByText("[QA] Casino Product 1")).not.toBeVisible();
            await expect(NewToplistPage.currenciesCombobox.getByRole("button").getByText("[QA] Currency 1")).not.toBeVisible();
            await expect(NewToplistPage.sportsCombobox.getByRole("button").getByText("[QA] Sport 1")).not.toBeVisible();
        });
        await test.step("Populate all of the filters and save", async () => {
            await components.clickItemFromCombobox(NewToplistPage.coinsCombobox, ["[QA] Coin 1", "[QA] Coin 2"], false);
            //await components.clickItemFromCombobox(NewToplistPage.coinsCombobox, , false);
            await components.clickItemFromCombobox(NewToplistPage.licensesCombobox, ["[QA] License 1"]);
            await components.clickItemFromCombobox(NewToplistPage.depositMethodsCombobox, ["[QA] Deposit Method 1"]);
            await components.clickItemFromCombobox(NewToplistPage.casinoProductsCombobox, ["[QA] Casino Product 1"]);
            await components.clickItemFromCombobox(NewToplistPage.currenciesCombobox, ["[QA] Currency 1"]);
            await components.clickItemFromCombobox(NewToplistPage.sportsCombobox, ["[QA] Sport 1"]);
            await NewToplistPage.createButton.click();
            await ToplistsPage.page.waitForTimeout(1000);
        });

        await test.step("Check the saved filters", async () => {
            await components.dataGridCell("name", 1).dblclick();
            await NewToplistPage.advancedFiltersAccordion.click();
            await expect(NewToplistPage.coinsCombobox.getByRole("button").getByText("[QA] Coin 1")).toBeVisible();
            await expect(NewToplistPage.coinsCombobox.getByRole("button").getByText("[QA] Coin 2")).toBeVisible();
            await expect(NewToplistPage.licensesCombobox.getByRole("button").getByText("[QA] License 1")).toBeVisible();
            await expect(NewToplistPage.depositMethodsCombobox.getByRole("button").getByText("[QA] Deposit Method 1")).toBeVisible();
            await expect(NewToplistPage.casinoProductsCombobox.getByRole("button").getByText("[QA] Casino Product 1")).toBeVisible();
            await expect(NewToplistPage.currenciesCombobox.getByRole("button").getByText("[QA] Currency 1")).toBeVisible();
            await expect(NewToplistPage.sportsCombobox.getByRole("button").getByText("[QA] Sport 1")).toBeVisible();
        });
    });

});