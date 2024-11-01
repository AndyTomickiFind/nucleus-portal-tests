import {expect, test as setup} from '@playwright/test';
import * as path from "node:path";
import config from "../playwright.config";

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({page}) => {
    await page.setExtraHTTPHeaders({
        "x-tooling-bypass-auth": process.env.BYPASS_AUTH,
    });
    await page.goto(`https://${config.baseUrl}/login`);
  //  await page.context().addCookies([{name: 'access_token', value: process.env.DEV_ACCESS_TOKEN, url: `https://${config.baseUrl}`}]);
   // await page.context().addCookies([{name: 'refresh_token', value: process.env.DEV_REFRESH_TOKEN, url: `https://${config.baseUrl}`}]);
    await page.getByRole('button', {name: 'google logo Sign in with'}).click(); //login with Google button
    await page.fill('input[type="email"]', config.use.httpCredentials.username);
    await page.click('#identifierNext');

    console.log('Detecting capcha...');
    const passwordInput = page.locator('input[type="password"]');
    if (await page.locator('//img[@id="captchaimg"]').count() > 0) { // wait for captcha
        console.log('Captcha detected!');
        await expect(passwordInput).toBeVisible({timeout: 60_000})
        console.log('Captcha solved');
    }

    await passwordInput.fill(config.use.httpCredentials.password);
    await page.click('#passwordNext');

    await page.waitForLoadState();
    await page.waitForSelector('//*[.="Hello Nucleus"]');
    await page.context().storageState({path: authFile});

});
