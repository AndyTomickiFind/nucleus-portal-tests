import {test} from "../fixtures/fixtures";
import {expect} from "@playwright/test";
import config from "../../playwright.config";


test.describe(`TOPLISTS subpage - ${config.name} `, {tag: ['@dev']}, () => {

    test.beforeEach(async ({ToplistsPage, menuComponent}) => {
        await ToplistsPage.page.goto(`https://${config.baseUrl}`);
        await menuComponent.menubarItem_Toplists.click();
        await ToplistsPage.page.mouse.move(20,20) //get rid of the submenu popup
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

    test('check the alert banner', async ({ToplistsPage}) => {
        await ToplistsPage.checkAlertBanner("Please select a filter to view the Toplists");
    });
});