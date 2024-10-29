import config from '../../playwright.config';
import {test} from "../fixtures/fixtures";
import {expect} from "@playwright/test";


test.describe('HOME subpage - ${config.name} ', {tag: ['@dev']}, () => {

    test.beforeEach(async ({LoginPage}) => {
        await LoginPage.navigateToNucleusPortal();
        await test.step('Login using Google credentials', async () => {  //to be replaced with a proper login method [not via ui]
            await LoginPage.login(config.use.httpCredentials.username, config.use.httpCredentials.password);
        });
    });

    test('check the title', async ({HomePage}) => {
        expect(await HomePage.page.title()).toBe('Nucleus Portal');
    });

    test('verify that the expected menu items are displayed and clickable', async ({headerComponent}) => {
        const menuItems = [
            'HOME',
            'TOPLISTS',
            'SHORT REVIEWS',
            'PARTNERS',
            'DATABASE',
        ];
        await headerComponent.toHaveMenuItems(menuItems)
    });


    test('check the welcome banner', async ({HomePage}) => {
        await HomePage.checkWelcomeBanner("Hello Nucleus");
    });

});