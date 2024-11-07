import {test} from "../fixtures/fixtures";
import {expect} from "@playwright/test";
import config from "../../playwright.config";


test.describe(`HOME subpage - ${config.name} `, {tag: ['@dev']}, () => {

    test.beforeEach(async ({HomePage}) => {
        await HomePage.page.goto(`https://${config.baseUrl}`);
    });

    test('check the title', async ({HomePage}) => {
        expect(await HomePage.page.title()).toBe('Nucleus Portal');
    });

    test('verify that the expected menu items are displayed and clickable', async ({menuComponent}) => {
        await menuComponent.checkMenuItems()
       // await menuComponent.checkDataPointItems()
    });

    test('check the welcome banner', async ({HomePage}) => {
        await HomePage.checkWelcomeBanner("Hello Nucleus");
    });
});