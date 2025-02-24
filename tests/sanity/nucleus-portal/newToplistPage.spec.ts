import {test} from "../../fixtures/fixtures";
import {expect} from "@playwright/test";
import config from "../../../playwright.config";


test.describe(`NEW TOPLIST subpage - ${config.name} `, {tag: [`@${config.name}`]}, () => {

    test.beforeEach(async ({NewToplistPage}) => {
        await NewToplistPage.page.goto(`https://${config.baseUrl}/toplists/new`);
    });

    test('check the title', async ({NewToplistPage}) => {
        expect(await NewToplistPage.page.title()).toBe('Nucleus Portal');
    });

    test('verify that the expected menu items are displayed and clickable', async ({menuComponent}) => {
        await menuComponent.checkMenuItems();
        await menuComponent.checkDataPointItems();
    });

    test('check all elements', async ({NewToplistPage, components}) => {

        await NewToplistPage.checkNewToplistHeader("New Toplist");
        await test.step("Check horizontal dividers", async () => {
            const dividerLabels: string[] = [
                "General",
                "Casinos Filters",
                "Overrides",
                "Default Results",
            ];
            await components.checkDividers(dividerLabels);
        });


        await test.step("Check the rest of the elements", async () => {
            await expect(NewToplistPage.nameField).toContainText("Name *");
            await expect(NewToplistPage.verticalCombobox).toContainText("Casinos");
            await expect(NewToplistPage.subVerticalCombobox).toContainText("Default");
            await expect(NewToplistPage.placementsCountInputBox).toBeEditable();
            await expect(NewToplistPage.descriptionInputField).toContainText("Description");
            await expect(NewToplistPage.appliesToProductCombobox).toContainText("Applies to Product *");
            await expect(NewToplistPage.coinsCombobox).toBeEditable();
            await expect(NewToplistPage.advancedFiltersAccordion).toContainText("Advanced filters");
            await expect(NewToplistPage.addOverrideButton).toBeVisible();

            await NewToplistPage.checkToplistsResults("default", 10);

            await expect(NewToplistPage.cancelButton).toHaveText("Cancel");
            await expect(NewToplistPage.createButton).toHaveText("Create");
        });

        await test.step("Check Casinos Filters", async () => {
            await NewToplistPage.advancedFiltersAccordion.click();
            await components.checkDividers(["Promotions"]);
            await components.checkCombobox(NewToplistPage.casinoProductsCombobox, ["Live Dealer", "Roulette", "Lotteries", "Dice"]);
            await components.checkCombobox(NewToplistPage.licensesCombobox, ["Malta", "Panama", "Sweden", "Not Disclosed"]);
            //await components.checkCombobox(NewToplistPage.softwareProvidersCombobox, ["1Spin4Win", "3Dice", "7777 Gaming", "5Men"]);
            await components.checkCombobox(NewToplistPage.currenciesCombobox, ["[QA] RoboCurrency 01", "[QA] RoboCurrency 02"]);  //PROD-1172
            await components.checkCombobox(NewToplistPage.depositMethodsCombobox, ["1Sol", "1inch"]);
            await components.checkCombobox(NewToplistPage.sportsCombobox, ["Age of Empires", "Archery", "Angry Birds"]);
            await components.clickItemFromCombobox(NewToplistPage.appliesToProductCombobox, "ccn.com");
            await components.checkCombobox(NewToplistPage.promotionTypesCombobox, ["Free bet", "Welcome package", "Cashback", "Free spins", "First deposit"]);
            await NewToplistPage.anonymousPlayCheckbox.click();
            await NewToplistPage.provablyFairCheckbox.click();
        });


        // Button doesn't exist anymore
        // await test.step("Check New Deposit Method", async () => {
        //     await NewToplistPage.newDepositMethodButton.click();
        //     await components.checkDividers(["General", "Upload Logo"]);
        //
        //     await NewToplistPage.newDepositMethodCancelButton.click({trial: true});
        //     await NewToplistPage.newDepositMethodCancelButton.click();
        // });

        await test.step("Check Override modal", async () => {
            await NewToplistPage.addOverrideButton.click();

            const dividerLabels: string[] = [
                "General",
                "Results"
            ];
            await components.checkDividers(dividerLabels);

            const appliesToCountriesComboboxItems: string[] = [
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
            await components.checkCombobox(NewToplistPage.appliesToCountriesCombobox, appliesToCountriesComboboxItems);
            await NewToplistPage.checkToplistsResults("override", 10);

            await NewToplistPage.saveOverrideListButton.click({trial: true});
            await NewToplistPage.cancelOverrideListButton.click();
        });

        //wip
        // await test.step("---", async () => {
        //     await NewToplistPage.advancedFiltersAccordion.click();
        //
        // });
    });
});