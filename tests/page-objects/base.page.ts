import {
    BrowserContext,
    Locator,
    Page,
    PlaywrightTestArgs,
    PlaywrightTestOptions, PlaywrightWorkerArgs, PlaywrightWorkerOptions,
    test,
    TestInfo, TestType
} from "@playwright/test";

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