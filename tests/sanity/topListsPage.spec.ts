import {test} from "../fixtures/fixtures";
import {expect} from "@playwright/test";
import config from "../../playwright.config";

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
       // await menuComponent.checkDataPointItems();
    });

    test('check the alert banner', async ({components}) => {
        await components.checkAlertBanner("Please select a filter to view the Toplists");
    });

    test('check comboBoxes', async ({components}) => {
        await test.step("Product combobox", async () => {
            const productComboboxItems: string[] = [
                "Select an option",
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

        await test.step("subVertical combobox", async () => {
            const subVerticalComboboxItems: string[] = [
                "Select an option",
                "Default",
                "Casino",
                "Gambling",
                "Sport"
            ]
            await components.checkCombobox(components.subVerticalCombobox, subVerticalComboboxItems);
        });
    });

    test('check the data grid', async ({components}) => {
        await test.step("Data grid table to be visible", async () => {
            await components.clickItemFromCombobox(components.productCombobox, "ccn.com");
            await expect(components.dataGrid).toBeVisible();
        })
    });

    test('check the search by Country', async ({components}) => {
        await test.step("`QA Toplist` must be visible when selecting `Cyprus` on ccn.com", async () => {
            await components.clickItemFromCombobox(components.productCombobox, "ccn.com");
            await components.clickItemFromCombobox(components.countriesCombobox, "Cyprus");
            await expect(components.dataGridCell("name", 1)).toContainText("QA Toplist");
            await expect(components.dataGridCell("domains", 1)).toContainText("ccn.com");
            await expect(components.dataGridCell("type", 1)).toContainText("Casinos");
            await expect(components.dataGridCell("subType", 1)).toContainText("Default");
            await expect(components.dataGridCell("status", 1)).toContainText("Published");
            await expect(components.dataGridCell("updatedAt", 1)).toContainText("/2024,");
        })
    });

    test('pagination and Data Grid items', async ({components}) => {
        test.skip(process.env.TEST_ENV === 'stage', 'Not enough Toplists in staging env to test pagination');

        await components.clickItemFromCombobox(components.productCombobox, "ccn.com");
        await components.clickItemFromCombobox(components.countriesCombobox, "Select an option");
        await test.step("Select 25 items per page", async () => {
            await components.checkRowsInDataGrid(25);
            await expect(components.displayedRowsLabel).toContainText("1–25 of ");
        });
        await test.step("Select 15 items per page", async () => {
            await components.checkRowsInDataGrid(15);
            await expect(components.displayedRowsLabel).toContainText("1–15 of ");
        });
        await test.step("Select 10 items per page", async () => {
            await components.checkRowsInDataGrid(10);
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

    test('new Toplist', async ({components}) => {
        await components.newButton.click();
    });

});