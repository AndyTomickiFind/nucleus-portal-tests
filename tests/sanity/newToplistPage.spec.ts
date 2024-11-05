import {test} from "../fixtures/fixtures";
import {expect} from "@playwright/test";
import config from "../../playwright.config";


test.describe(`NEW TOPLIST subpage - ${config.name} `, {tag: ['@dev']}, () => {

    test.beforeEach(async ({NewToplistPage}) => {
        await NewToplistPage.page.goto(`https://${config.baseUrl}/toplists/new`);
    });

    test('check the title', async ({NewToplistPage}) => {
        expect(await NewToplistPage.page.title()).toBe('Nucleus Portal');
    });

    test('verify that the expected menu items are displayed and clickable', async ({menuComponent}) => {
        await menuComponent.checkMenuItems()
        await menuComponent.checkDataPointItems()
    });

    test('check all elements', async ({NewToplistPage, components}) => {
        await NewToplistPage.checkNewToplistHeader("New Toplist");

        const dividerLabels: string[] = [
            "General",
            "Casinos Filters",
            "Overrides",
            "Default Results",
        ];
        await components.checkDividers(dividerLabels);
    });
});