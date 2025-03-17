import {test} from "../../fixtures/fixtures";
import {expect} from "@playwright/test";
import config from "../../../playwright.config";
import {timeDifference} from "../../common/helpers";

test.describe(`PARTNERS/EXCHANGES subpage - ${config.name}`, {tag: [`@${config.name}`]}, () => {

    test.beforeEach(async ({ExchangesPage, menuComponent}) => {
        await ExchangesPage.page.goto(`https://${config.baseUrl}`);
        await menuComponent.menubarItem_Partners.click();
        await menuComponent.subPartnersMenuItem_Exchanges.click();
        await ExchangesPage.page.waitForLoadState();
    });

    test('Check the title and url', async ({ExchangesPage}) => {
        await ExchangesPage.page.waitForURL('**/partners/exchanges');
        expect(await ExchangesPage.page.title()).toBe('Nucleus Portal');
        expect(ExchangesPage.page.url()).toBe(`https://${config.baseUrl}/partners/exchanges`);
    });

    test('Verify that the expected menu items are displayed and clickable', async ({menuComponent}) => {
        await menuComponent.checkMenuItems();
        await menuComponent.checkDataPointItems();
    });

    test('Check the data grid', async ({components}) => {
        await test.step("Data grid table to be visible", async () => {
            await expect(components.dataGrid).toBeVisible();
        });
    });

    test('Check Random Exchanges and a Specific Exchange', async ({
                                                                      request,
                                                                      components,
                                                                      ExchangesPage,
                                                                      menuComponent
                                                                  }) => {
        async function getExchanges(): Promise<string[]> {
            const response = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/exchanges`, {
                params: {size: 10000},
                headers: {
                    "Authorization": `${config.nucleusPortalToken}`,
                    "Content-Type": "application/json"
                }
            });

            expect.soft([401, 403], "User is not authorized to access this resource").not.toContain(response.status());
            expect(response.status(), "There is an issue receiving the response from:" + response.url()).toBe(200);

            const data = await response.json();
            return data.items.map((item) => item.name);
        }

        // Randomly select 5 exchanges
        const randomExchanges: string[] = await (async () => {
            const allExchanges = (await getExchanges()).filter(exchange => !exchange.toLowerCase().includes("do not edit")); // Exclude exchanges with "do not edit" in the name
            const selectedExchanges = new Set<string>();
            while (selectedExchanges.size < 5 && allExchanges.length > selectedExchanges.size) {
                const randomExchange = allExchanges[Math.floor(Math.random() * allExchanges.length)];
                if (!selectedExchanges.has(randomExchange)) {
                    selectedExchanges.add(randomExchange);
                }
            }
            return [...Array.from(selectedExchanges)];
        })();

        for (const exchangeName of randomExchanges) {
            await test.step(`Testing Exchange "${exchangeName}"`, async () => {
                await test.step("Search for the Exchange", async () => {
                    await menuComponent.menubarItem_Partners.click();
                    await menuComponent.subPartnersMenuItem_Exchanges.click();
                    await ExchangesPage.filterByExchangeName(exchangeName);
                    await expect.soft(components.dataGridCell("name", 1)).toBeVisible();
                    await expect.soft(components.dataGridCell("createdAt", 1)).toBeVisible();
                    await expect.soft(components.dataGridCell("updatedAt", 1)).toBeVisible();
                });

                await ExchangesPage.openExchange(exchangeName);

                await test.step("Check all accordion dropdowns", async () => {
                    const dropdowns = [
                        'details-header',
                        'images-header',
                        'scores-header',
                        'reviewBy-header',
                        'insurance-header',
                        'prosCons-header',
                        'fees-header',
                        'extras-header',
                    ];
                    for (const dropdown of dropdowns) {
                        await components.openDropdown(dropdown);
                        await expect.soft(components.dropdownHeader(dropdown)).toBeVisible();
                    }
                });

                await test.step("Check the Tabs", async () => {
                    const tabs = ['General Information', 'Datapoints', 'Affiliate Links'];
                    for (const tab of tabs) {
                        const tabLocator = ExchangesPage.getTabLocator(tab);
                        await tabLocator.click();
                    }
                });
            });
        }
    });

    test('Pagination and Data Grid items', async ({components}) => {
        await test.step("Select 25 items per page", async () => {
            await components.checkRowsInDataGrid(25, ["name", "createdAt", "updatedAt"]);
            await expect(components.displayedRowsLabel).toContainText("1–25 of ");
        });
        await test.step("Select 15 items per page", async () => {
            await components.checkRowsInDataGrid(15, ["name", "createdAt", "updatedAt"]);
            await expect(components.displayedRowsLabel).toContainText("1–15 of ");
        });
        await test.step("Select 10 items per page", async () => {
            await components.checkRowsInDataGrid(10, ["name", "createdAt", "updatedAt"]);
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

    test('Update/edit a Specific Exchange', async ({components, ExchangesPage, menuComponent}) => {
        const exchangeName = `[QA] 3 Exchange used by ROBOTS - do not edit`;
        await test.step(`Updating Exchange "${exchangeName}"`, async () => {

            await menuComponent.menubarItem_Partners.click();
            await menuComponent.subPartnersMenuItem_Exchanges.click();
            await ExchangesPage.openExchange(exchangeName);

            const date: Date = new Date();
            await ExchangesPage.exchangeNameField.fill(exchangeName + " - " + date.toISOString());

            await ExchangesPage.saveButton.click();

            await ExchangesPage.page.waitForTimeout(2000);
            await menuComponent.menubarItem_Partners.click();
            await menuComponent.subPartnersMenuItem_Exchanges.click();
            await ExchangesPage.filterByExchangeName(exchangeName);
            await expect(components.dataGridCell("name", 1)).toContainText(exchangeName + " - " + date.toISOString());
            const actualUpdateTime = await components.dataGridCell("updatedAt", 1).innerText();
            const timedate = new Date();
            const expectedUpdateTime = timedate.toLocaleString();
            expect(timeDifference(expectedUpdateTime, actualUpdateTime), `Actual [${actualUpdateTime}] and expected [${expectedUpdateTime}] update time should not differ by more than 30 seconds`).toBeLessThan(30000);
        });
    });

    test('Check Validation Messages', {
        annotation: {
            type: 'issue',
            description: 'https://findco.atlassian.net/browse/DEV-5499, https://findco.atlassian.net/browse/DEV-5800',
        },
    }, async ({ExchangesPage, menuComponent}) => {
        const exchangeName = `[QA] Exchange used by ROBOTS - do not edit`;
        await menuComponent.menubarItem_Partners.click();
        await menuComponent.subPartnersMenuItem_Exchanges.click();
        await ExchangesPage.openExchange(exchangeName);

        await ExchangesPage.getTabLocator("DATAPOINTS").click();

        const fieldsToClear = ["Products", "Coins", "Crypto Pairs", "Currencies", "Site Languages", "Support Languages", "Contact Methods", "Deposit Methods", "Deposit Currencies", "Withdrawal Methods", "Licenses", "Support Issues", "Security Methods", "Community Socials", "Order Types", "Educational Resources", "Registration Steps"];
        for (const field of fieldsToClear) {
            await ExchangesPage.exchangeDatapointsClearField(field);
        }

        await ExchangesPage.saveButton.click();

        const optionalFields: string[] = ["products", "coins", "crypto-pairs", "currencies", "site-languages", "support-languages", "contact-methods", "deposit-methods", "deposit-currencies", "withdrawal-methods", "licenses", "support-issues", "security-methods", "community-socials", "order-types", "educational-resources", "registration-steps"];
        for (const field of optionalFields) {
            const isVisible = await ExchangesPage.exchangeDatapointsValidationLabel(field).isVisible();
            expect.soft(isVisible, `${field} field validation should only appear if necessary`).toBe(false);
        }
    });


    test('Exchange Allowed/Excluded Countries', {
        annotation: {
            type: 'issue',
            description: 'https://findco.atlassian.net/browse/DEV-5850, https://findco.atlassian.net/browse/DEV-5849',
        },
    }, async ({components, ExchangesPage, menuComponent}) => {

        const exchangeName = `[QA] 4 Exchange used by ROBOTS - do not edit`;
        await test.step(`Updating Exchange "${exchangeName}"`, async () => {
            await menuComponent.menubarItem_Partners.click();
            await menuComponent.subPartnersMenuItem_Exchanges.click();
            await ExchangesPage.openExchange(exchangeName);

            await test.step("Check Allowed/Excluded Countries fields", async () => {
                await components.openDropdown("details-header");
                await ExchangesPage.page.waitForTimeout(300);
                await expect(ExchangesPage.allowedCountriesField).toBeVisible();
                await expect(ExchangesPage.excludedCountriesField).toBeVisible();
                await expect(ExchangesPage.allowedCountriesSelecAllButton).toBeVisible();
                await expect(ExchangesPage.excludedCountriesSelecAllButton).toBeVisible();


                // Select all buttons
                await ExchangesPage.allowedCountriesSelecAllButton.click();
                await expect(ExchangesPage.allowedCountriesField).toContainText("Allowed CountriesAO - AngolaAQ - AntarcticaAR - ArgentinaAW - ArubaAU - AustraliaBD - BangladeshBY - BelarusBZ - BelizeBA - Bosnia and HerzegovinaBW - BotswanaBV - Bouvet IslandIO - British Indian Ocean TerritoryKH - CambodiaCA - CanadaCN - ChinaKM - ComorosCD - Congo, the Democratic Republic of theCU - CubaCW - CuraçaoCZ - Czech RepublicDJ - DjiboutiEC - EcuadorET - EthiopiaFJ - FijiGM - GambiaGE - GeorgiaGI - GibraltarGR - GreeceKI - KiribatiXK - KosovoKW - KuwaitKG - KyrgyzstanLS - LesothoMW - MalawiML - MaliMT - MaltaMH - Marshall IslandsYT - MayotteMC - MonacoMA - MoroccoMM - MyanmarNP - NepalAN - Netherlands AntillesNE - NigerNF - Norfolk IslandPY - ParaguayPE - PeruPR - Puerto RicoSH - Saint Helena, Ascension and Tristan da CunhaMF - Saint Martin (French part)SL - Sierra LeoneGS - South Georgia and the South Sandwich IslandsKR - South KoreaSD - SudanSR - SurinameSE - SwedenSY - Syrian Arab RepublicTZ - Tanzania, United Republic ofTH - ThailandTO - TongaTC - Turks and Caicos IslandsUG - UgandaAE - United Arab EmiratesUM - United States Minor Outlying IslandsUZ - UzbekistanVN - VietnamEH - Western SaharaZW - ZimbabweAF - AfghanistanDZ - AlgeriaAS - American SamoaAM - ArmeniaBB - BarbadosBM - BermudaBQ - Bonaire, Sint Eustatius and SabaBF - Burkina FasoKY - Cayman IslandsTD - ChadCL - ChileEG - EgyptGQ - Equatorial GuineaER - EritreaFK - Falkland Islands (Malvinas)FO - Faroe IslandsTF - French Southern TerritoriesGA - GabonGH - GhanaGD - GrenadaGG - GuernseyGW - Guinea-BissauGY - GuyanaHT - HaitiHU - HungaryID - IndonesiaIR - Iran, Islamic Republic ofIQ - IraqJM - JamaicaJE - JerseyJO - JordanLA - Lao People's Democratic RepublicLR - LiberiaLT - LithuaniaMK - Macedonia, the former Yugoslav Republic ofMV - MaldivesMR - MauritaniaMX - MexicoFM - Micronesia, Federated States ofMZ - MozambiqueNL - NetherlandsNC - New CaledoniaNU - NiueNO - NorwayPK - PakistanPW - PalauPL - PolandRU - RussiaBL - Saint BarthélemyKN - Saint Kitts and NevisWS - SamoaSN - SenegalSK - SlovakiaSI - SloveniaSO - SomaliaSS - South SudanLK - Sri LankaCH - SwitzerlandTT - Trinidad and TobagoTN - TunisiaTR - TurkeyUA - UkraineGB - United KingdomUS - United StatesUY - UruguayVU - VanuatuAI - AnguillaAG - Antigua and BarbudaBO - BoliviaBN - BruneiBG - BulgariaCM - CameroonCO - ColombiaCG - CongoDK - DenmarkDO - Dominican RepublicEE - EstoniaFI - FinlandGF - French GuianaPF - French PolynesiaGP - GuadeloupeVA - Holy See (Vatican City State)HK - Hong KongIE - IrelandIT - ItalyLB - LebanonLY - LibyaMG - MadagascarMD - Moldova, Republic ofME - MontenegroMS - MontserratNR - NauruNG - NigeriaOM - OmanPA - PanamaPG - Papua New GuineaLC - Saint LuciaPM - Saint Pierre and MiquelonSM - San MarinoST - Sao Tome and PrincipeSA - Saudi ArabiaRS - SerbiaSC - SeychellesZA - South AfricaES - SpainTW - TaiwanTJ - TajikistanTG - TogoTK - TokelauVI - Virgin Islands, U.S.WF - Wallis and FutunaYE - YemenZM - ZambiaAX - Åland IslandsAL - AlbaniaAD - AndorraAT - AustriaAZ - AzerbaijanBS - BahamasBH - BahrainBE - BelgiumBJ - BeninBT - BhutanBR - BrazilBI - BurundiCV - Cape VerdeCF - Central African RepublicCX - Christmas IslandCC - Cocos (Keeling) IslandsCK - Cook IslandsCR - Costa RicaHR - CroatiaCY - CyprusDM - DominicaSV - El SalvadorFR - FranceDE - GermanyGL - GreenlandGU - GuamGT - GuatemalaGN - GuineaHM - Heard Island and McDonald IslandsHN - HondurasIS - IcelandIN - IndiaIM - Isle of ManIL - IsraelCI - Ivory CoastJP - JapanKZ - KazakhstanKE - KenyaKP - Korea, Democratic People's Republic ofLV - LatviaLI - LiechtensteinLU - LuxembourgMO - MacaoMY - MalaysiaMQ - MartiniqueMU - MauritiusMN - MongoliaNA - NamibiaNZ - New ZealandNI - NicaraguaMP - Northern Mariana IslandsPS - Palestinian Territory, OccupiedPH - PhilippinesPN - PitcairnPT - PortugalQA - QatarRE - RéunionRO - RomaniaRW - RwandaVC - Saint Vincent & the GrenadinesSG - SingaporeSX - Sint Maarten (Dutch part)SB - Solomon IslandsSJ - Svalbard and Jan MayenSZ - SwazilandTL - Timor-LesteTM - TurkmenistanTV - TuvaluVE - VenezuelaVG - Virgin Islands, BritishAllowed Countries");
                await ExchangesPage.excludedCountriesSelecAllButton.click();
                await expect(ExchangesPage.excludedCountriesField).toContainText("Excluded CountriesAO - AngolaAQ - AntarcticaAR - ArgentinaAW - ArubaAU - AustraliaBD - BangladeshBY - BelarusBZ - BelizeBA - Bosnia and HerzegovinaBW - BotswanaBV - Bouvet IslandIO - British Indian Ocean TerritoryKH - CambodiaCA - CanadaCN - ChinaKM - ComorosCD - Congo, the Democratic Republic of theCU - CubaCW - CuraçaoCZ - Czech RepublicDJ - DjiboutiEC - EcuadorET - EthiopiaFJ - FijiGM - GambiaGE - GeorgiaGI - GibraltarGR - GreeceKI - KiribatiXK - KosovoKW - KuwaitKG - KyrgyzstanLS - LesothoMW - MalawiML - MaliMT - MaltaMH - Marshall IslandsYT - MayotteMC - MonacoMA - MoroccoMM - MyanmarNP - NepalAN - Netherlands AntillesNE - NigerNF - Norfolk IslandPY - ParaguayPE - PeruPR - Puerto RicoSH - Saint Helena, Ascension and Tristan da CunhaMF - Saint Martin (French part)SL - Sierra LeoneGS - South Georgia and the South Sandwich IslandsKR - South KoreaSD - SudanSR - SurinameSE - SwedenSY - Syrian Arab RepublicTZ - Tanzania, United Republic ofTH - ThailandTO - TongaTC - Turks and Caicos IslandsUG - UgandaAE - United Arab EmiratesUM - United States Minor Outlying IslandsUZ - UzbekistanVN - VietnamEH - Western SaharaZW - ZimbabweAF - AfghanistanDZ - AlgeriaAS - American SamoaAM - ArmeniaBB - BarbadosBM - BermudaBQ - Bonaire, Sint Eustatius and SabaBF - Burkina FasoKY - Cayman IslandsTD - ChadCL - ChileEG - EgyptGQ - Equatorial GuineaER - EritreaFK - Falkland Islands (Malvinas)FO - Faroe IslandsTF - French Southern TerritoriesGA - GabonGH - GhanaGD - GrenadaGG - GuernseyGW - Guinea-BissauGY - GuyanaHT - HaitiHU - HungaryID - IndonesiaIR - Iran, Islamic Republic ofIQ - IraqJM - JamaicaJE - JerseyJO - JordanLA - Lao People's Democratic RepublicLR - LiberiaLT - LithuaniaMK - Macedonia, the former Yugoslav Republic ofMV - MaldivesMR - MauritaniaMX - MexicoFM - Micronesia, Federated States ofMZ - MozambiqueNL - NetherlandsNC - New CaledoniaNU - NiueNO - NorwayPK - PakistanPW - PalauPL - PolandRU - RussiaBL - Saint BarthélemyKN - Saint Kitts and NevisWS - SamoaSN - SenegalSK - SlovakiaSI - SloveniaSO - SomaliaSS - South SudanLK - Sri LankaCH - SwitzerlandTT - Trinidad and TobagoTN - TunisiaTR - TurkeyUA - UkraineGB - United KingdomUS - United StatesUY - UruguayVU - VanuatuAI - AnguillaAG - Antigua and BarbudaBO - BoliviaBN - BruneiBG - BulgariaCM - CameroonCO - ColombiaCG - CongoDK - DenmarkDO - Dominican RepublicEE - EstoniaFI - FinlandGF - French GuianaPF - French PolynesiaGP - GuadeloupeVA - Holy See (Vatican City State)HK - Hong KongIE - IrelandIT - ItalyLB - LebanonLY - LibyaMG - MadagascarMD - Moldova, Republic ofME - MontenegroMS - MontserratNR - NauruNG - NigeriaOM - OmanPA - PanamaPG - Papua New GuineaLC - Saint LuciaPM - Saint Pierre and MiquelonSM - San MarinoST - Sao Tome and PrincipeSA - Saudi ArabiaRS - SerbiaSC - SeychellesZA - South AfricaES - SpainTW - TaiwanTJ - TajikistanTG - TogoTK - TokelauVI - Virgin Islands, U.S.WF - Wallis and FutunaYE - YemenZM - ZambiaAX - Åland IslandsAL - AlbaniaAD - AndorraAT - AustriaAZ - AzerbaijanBS - BahamasBH - BahrainBE - BelgiumBJ - BeninBT - BhutanBR - BrazilBI - BurundiCV - Cape VerdeCF - Central African RepublicCX - Christmas IslandCC - Cocos (Keeling) IslandsCK - Cook IslandsCR - Costa RicaHR - CroatiaCY - CyprusDM - DominicaSV - El SalvadorFR - FranceDE - GermanyGL - GreenlandGU - GuamGT - GuatemalaGN - GuineaHM - Heard Island and McDonald IslandsHN - HondurasIS - IcelandIN - IndiaIM - Isle of ManIL - IsraelCI - Ivory CoastJP - JapanKZ - KazakhstanKE - KenyaKP - Korea, Democratic People's Republic ofLV - LatviaLI - LiechtensteinLU - LuxembourgMO - MacaoMY - MalaysiaMQ - MartiniqueMU - MauritiusMN - MongoliaNA - NamibiaNZ - New ZealandNI - NicaraguaMP - Northern Mariana IslandsPS - Palestinian Territory, OccupiedPH - PhilippinesPN - PitcairnPT - PortugalQA - QatarRE - RéunionRO - RomaniaRW - RwandaVC - Saint Vincent & the GrenadinesSG - SingaporeSX - Sint Maarten (Dutch part)SB - Solomon IslandsSJ - Svalbard and Jan MayenSZ - SwazilandTL - Timor-LesteTM - TurkmenistanTV - TuvaluVE - VenezuelaVG - Virgin Islands, BritishExcluded Countries");

                await components.chipButtonCloseX("AO - Angola").click();
                await expect(ExchangesPage.allowedCountriesField).toContainText("AO - Angola");
                await expect(ExchangesPage.excludedCountriesField).not.toContainText("AO - Angola");
                await components.chipButtonCloseX("AO - Angola").click();
                await expect(ExchangesPage.excludedCountriesField).toContainText("AO - Angola");
                await expect(ExchangesPage.allowedCountriesField).not.toContainText("AO - Angola");
                await components.chipButtonCloseX("AO - Angola").click();

                await components.chipButtonCloseX("AR - Argentina").click();
                await expect(ExchangesPage.allowedCountriesField).toContainText("AR - Argentina");
                await expect(ExchangesPage.excludedCountriesField).not.toContainText("AR - Argentina");
                await components.chipButtonCloseX("AR - Argentina").click();
                await expect(ExchangesPage.excludedCountriesField).toContainText("AR - Argentina");
                await expect(ExchangesPage.allowedCountriesField).not.toContainText("AR - Argentina");
                await components.chipButtonCloseX("AR - Argentina").click();

            });

            await ExchangesPage.saveButton.click();
        });
    });

});