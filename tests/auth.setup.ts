import {test as setup} from '@playwright/test';
import * as path from "node:path";
import config from "../playwright.config";
import {getOTP} from "./totpGenerator";

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({page}) => {
    await page.setExtraHTTPHeaders({
        "x-tooling-bypass-auth": process.env.BYPASS_AUTH,
    });

    await page.goto(`https://${config.baseUrl}/login`);
    await page.locator('//button').click(); //login with Google button
    await page.fill('input[type="email"]', config.use.httpCredentials.username);
    await page.click('#identifierNext');

    const passwordInput = page.locator('input[type="password"]').first();

    await passwordInput.fill(config.use.httpCredentials.password);
    await page.click('#passwordNext');
    await page.waitForLoadState();
    await page.locator("//span[.='Try another way']").click();
    await page.locator("//div[.='Get a verification code from the Google Authenticator app']").first().click();
    const otp = await getOTP();
    await page.getByLabel("Enter code").fill(otp);
    await page.getByLabel("Enter code").press("Enter");

    await page.waitForLoadState();
    await page.waitForSelector('//*[.="Hello Nucleus"]');
    await page.context().storageState({path: authFile});

});
