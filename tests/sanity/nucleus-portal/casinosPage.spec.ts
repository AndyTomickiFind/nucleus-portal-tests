import {test} from "../../fixtures/fixtures";
import {expect} from "@playwright/test";
import config from "../../../playwright.config";

const DROPDOWNS = [
    'details-header',
    'logo-header',
    'settings-header',
    'homepage-header',
    'reviewBy-header',
    'teaser-header',
    'prosCons',
    'legal-header',
    'extras',
];

const TABS = ['General Information', 'Datapoints', 'Affiliate Links', 'Bonuses'];

async function navigateToCasinos(CasinosPage, menuComponent) {
    await menuComponent.menubarItem_Partners.click();
    await menuComponent.subPartnersMenuItem_Casinos.click();
    await CasinosPage.page.waitForLoadState();
}

async function getCasinos(request): Promise<string[]> {
    const response = await request.get(`https://${config.nucleusPortalServiceUri}/api/v1/casinos`, {
        params: {size: 10000},
        headers: {
            Authorization: `${config.nucleusPortalToken}`,
            "Content-Type": "application/json",
        },
    });
    expect.soft([401, 403], "User is not authorized to access this resource").not.toContain(response.status());
    expect(response.status(), "There is an issue receiving the response from:" + response.url()).toBe(200);

    const data = await response.json();
    return data.items.map((item) => item.name);
}

async function checkDropdowns(components) {
    for (const dropdown of DROPDOWNS) {
        await test.step(`Clicking on "${dropdown}"`, async () => {
            await components.openDropdown(dropdown);
            await expect.soft(components.dropdownHeader(dropdown)).toBeVisible();
        });
    }
}

async function checkTabs(CasinosPage) {
    for (const tab of TABS) {
        await CasinosPage.getTabLocator(tab).click();
    }
}

test.describe(`PARTNERS/CASINOS subpage - ${config.name} `, {tag: [`@${config.name}`]}, () => {
    test.beforeEach(async ({CasinosPage, menuComponent}) => {
        await CasinosPage.page.goto(`https://${config.baseUrl}`);
        await navigateToCasinos(CasinosPage, menuComponent);
    });

    test("Check the title and url", async ({CasinosPage}) => {
        await CasinosPage.page.waitForURL("**/partners/casinos");
        expect(await CasinosPage.page.title()).toBe("Nucleus Portal");
        expect(CasinosPage.page.url()).toBe(`https://${config.baseUrl}/partners/casinos`);
    });

    test("Verify that the expected menu items are displayed and clickable", async ({menuComponent}) => {
        await menuComponent.checkMenuItems();
        await menuComponent.checkDataPointItems();
    });

    test("Check the data grid", async ({components}) => {
        await test.step("Data grid table to be visible", async () => {
            await expect(components.dataGrid).toBeVisible();
        });
    });

    test("Check Random Casinos and a Specific Casino", async ({request, components, CasinosPage, menuComponent}) => {
        const allCasinos = await getCasinos(request);
        const randomCasinos: string[] = ["Casino used by ROBOTS - do not edit", ...allCasinos.slice(0, Math.min(5, allCasinos.length))];

        for (const casinoName of randomCasinos) {
            await test.step(`Testing Casino "${casinoName}"`, async () => {
                await test.step("Search for the Casino", async () => {
                    await navigateToCasinos(CasinosPage, menuComponent);
                    await CasinosPage.filterByCasinoName(casinoName);
                    await expect.soft(components.dataGridCell("name", 1)).toBeVisible();
                    await expect.soft(components.dataGridCell("createdAt", 1)).toBeVisible();
                    await expect.soft(components.dataGridCell("updatedAt", 1)).toBeVisible();
                });

                await test.step("Open the Casino", async () => {
                    for (let attempt = 0; attempt < 5; attempt++) {
                        try {
                            await components.dblClickDataGridRow(1);
                            await CasinosPage.page.waitForLoadState("domcontentloaded");
                            await expect.soft(CasinosPage.topHeader).toContainText("Update Casino");
                            break;
                        } catch (error) {
                            console.warn(`Opening casino: attempt ${attempt + 1} failed. Retrying...`);
                            if (attempt === 4) throw error;
                            await new Promise((resolve) => setTimeout(resolve, 1000));
                        }
                    }
                });

                await checkDropdowns(components);
                await checkTabs(CasinosPage);

                await test.step("Check No Bonus toggle button", async () => {
                    await CasinosPage.getTabLocator("Bonuses").click();
                    await CasinosPage.firstDomainButton.click();

                    if (await CasinosPage.noBonusToggle.isChecked()) {
                        await CasinosPage.noBonusToggle.click();
                    }
                    await components.checkAlertBanner("Welcome offer value will be returned in the toplist results for");
                    await CasinosPage.noBonusToggle.click();
                    await components.checkAlertBanner(
                        "Please note that you cannot edit offers or packages if the domain has no bonus. If you save this form, any existing offers and packages for this domain will be removed."
                    );
                });
            });
        }
    });

    test("Pagination and Data Grid items", async ({components}) => {
        for (const {rows, label} of [
            {rows: 25, label: "1–25 of "},
            {rows: 15, label: "1–15 of "},
            {rows: 10, label: "1–10 of "},
        ]) {
            await test.step(`Select ${rows} items per page`, async () => {
                await components.checkRowsInDataGrid(rows, ["name", "createdAt", "updatedAt"]);
                await expect(components.displayedRowsLabel).toContainText(label);
            });
        }

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
});