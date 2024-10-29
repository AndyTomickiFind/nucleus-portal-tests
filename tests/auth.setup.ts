import {test as setup} from '@playwright/test';
import * as path from "node:path";
import config from "../playwright.config";

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({page}) => {
    await page.goto(`https://${config.baseUrl}`);
    // await this.context.addCookies([{name: 'access_token', value: process.env.DEV_ACCESS_TOKEN, url: `https://${config.baseUrl}`}]);
    // await this.context.addCookies([{name: 'refresh_token', value: process.env.DEV_REFRESH_TOKEN, url: `https://${config.baseUrl}`}]);
    await page.click('button[tabindex="0"]');
    await page.fill('input[type="email"]', config.use.httpCredentials.username);
    await page.click('#identifierNext');
    await page.fill('input[type="password"]', config.use.httpCredentials.password);
    await page.click('#passwordNext');
    await page.waitForLoadState();
    await page.waitForSelector('//*[.="Hello Nucleus"]');
    await page.context().storageState({path: authFile});
});
