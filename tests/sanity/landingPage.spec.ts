import config from '../../playwright.config';
import {test} from "../fixtures/fixtures";


test.describe(`LoadPortal - ${config.name} `,
    {tag: ['@dev']},
    () => {


        test.beforeEach(async ({LoginPage}) => {
            await LoginPage.navigateToNucleusPortal()
        });


        test(`Log into Nucleus Portal`, async ({LoginPage}) => {
            await test.step('`Login using Google credentials', async () => {  //to be replaced with a proper login method
                await LoginPage.login(process.env.DEV_USER, process.env.DEV_PASS)
               // await expect(adminDashboardPage.dashBoardIcon).toBeVisible()
            });
        });
    });