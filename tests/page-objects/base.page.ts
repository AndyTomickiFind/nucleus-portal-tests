import {
    BrowserContext,
    Locator,
    Page,
    PlaywrightTestArgs,
    PlaywrightTestOptions, PlaywrightWorkerArgs, PlaywrightWorkerOptions,
    test,
    TestInfo, TestType
} from "@playwright/test";
import config from "../../playwright.config";


export abstract class BasePage {
    readonly context: BrowserContext
    readonly aiArgs: {
        page: Page;
        test: TestType<PlaywrightTestArgs & PlaywrightTestOptions, PlaywrightWorkerArgs & PlaywrightWorkerOptions>;
    };

    protected constructor(readonly page: Page, context: BrowserContext) {
        this.page = page;
        this.context = context;
        this.aiArgs = { page, test };
    }

    async navigateTo(url: string) {
        await test.step(`Navigate to ${url} `, async () => {
            // abort requests to analytics and other unnecessary services
            await this.context.route(/(analytics|cloudflareinsights|omappapi|amplitude|hotjar)/, route => route.abort());
            // Set headers for Cloudflare bypass
            // await this.page.setExtraHTTPHeaders({
            //     'x-tooling-bypass-auth': process.env.BYPASS_AUTH
            // });
            await this.page.goto(url);
            await this.page.waitForLoadState();
        });
    }

    async takeAndAttachScreenshot(name: string, path: string, testInfo: TestInfo, locator?: Locator) {
        await test.step("Take screenshot", async () => {
            let screenshot: Buffer;
            if (locator) {
                screenshot = await locator.screenshot({ path: path, timeout: 3000 });
            } else {
                screenshot = await this.page.screenshot({ path: path, timeout: 3000 });
            }
            await testInfo.attach(name, { body: screenshot, contentType: "image/png" });
        });
    }
}