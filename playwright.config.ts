import {PlaywrightTestConfig} from '@playwright/test';
import * as dotenv from 'dotenv';
import {devices} from "playwright";

dotenv.config();

// Get the environment type from the command line. If none, set it to dev
const environment = process.env.TEST_ENV || 'dev';
const browser = 'msedge'; //firefox, chromium
const headless = true;
const runAuth = false;


interface TestConfig extends PlaywrightTestConfig {
    baseUrl?: string;
    toplistServiceV1Uri?: string;
    nucleusPortalServiceUri?: string;
    nucleusPortalToken?: string;
    defaultDomainId?: string;
    defaultPaymentTypeId?: string;
    staticPage?: { username?: string; password?: string };
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const defaultConfig: PlaywrightTestConfig = {

    /* Test files to run. By default, all files that match the pattern are run. */
    testDir: './tests',
    testMatch: '**/*.spec.ts',

    /* Timeout for each test in milliseconds. */
    timeout: 180_000,

    /* Ignore snapshots on CI to avoid bloating the build artifacts. */
    ignoreSnapshots: !process.env.CI,

    /* Global setup and teardown. See https://playwright.dev/docs/test-global-fixtures. */
    // globalSetup: require.resolve('./global.setup.ts'),
    // globalTeardown: require.resolve('./global.teardown.ts'),

    /* Run tests in files in parallel */
    fullyParallel: true,

    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,

    /* Retry configuration. See https://playwright.dev/docs/test-configuration#retry-failed-tests. */
    retries: process.env.CI ? 4 : 2,

    workers: process.env.CI ? 6 : 6,


    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: process.env.CI ?
        [ /* Reporters on CI */
            ['json', {
                outputFolder: 'playwright-report/report',
                outputFile: `./playwright-report/results.json`
            }],
            ['html', {outputFolder: `playwright-report`, open: 'never'}],
            ['blob', {outputFile: `report.zip`}],
            ['github'],
            ['allure-playwright']
        ] :
        [ /* Reporters for local run */
            ['html', {outputFolder: `playwright-report`, open: 'never'}],
            ['list'],
            ['allure-playwright']
        ],

    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: process.env.CI ? 'retain-on-failure' : 'on',
        /* Screenshot on failure. */
        screenshot: 'only-on-failure',
        /* Headless mode. */
        headless: headless,
        /* Video recording mode. */
        video: process.env.CI ? 'retain-on-failure' : 'on',
        /* Timeout for Playwright actions such as click, fill, etc. */
        actionTimeout: 8000,
        javaScriptEnabled: true,
    },

    /* Configure projects for major browsers */
    projects: [
        // Setup project
        {
            name: 'setup',
            testMatch: /.*\.setup\.ts/,
            use: {
                ...devices['Desktop ' + browser], channel: browser,
                viewport: {
                    width: 1600,
                    height: 800
                },
            },
        },

        {
            name: 'nucleus-portal-sanity',
            dependencies: runAuth ? ['setup'] : [],
            testMatch: 'sanity/nucleus-portal/*.spec.ts',
            use: {
                ...devices['Desktop ' + browser], channel: browser,
                storageState: 'playwright/.auth/user.json',
                viewport: {
                    width: 1600,
                    height: 800
                },
            },
        },
        {
            name: 'toplists-ui-sanity',
            dependencies: ['setup'],
            testMatch: 'sanity/toplists-ui/*.spec.ts',
            use: {
                ...devices['Desktop ' + browser], channel: browser,
                storageState: 'playwright/.auth/user.json',
                viewport: {
                    width: 1600,
                    height: 800
                },
            },
        },
        {
            name: 'api-toplist-service',
            testMatch: 'api/*.spec.ts',
        },
        {
            name: 'api-nucleus-portal',
            testMatch: 'api/nucleusPortalAPI/*.spec.ts',
        },
    ],

    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    // outputDir: 'test-results/',

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   port: 3000,
    // },
};


/* Environments */

// set config for prod
const prodConfig: TestConfig = {
    baseUrl: 'portal.nucleusmvp.com',
    toplistServiceV1Uri: '',
    name: `prod`,
    staticPage: {
        username: process.env.DEV_STATIC_PAGE_USER,
        password: process.env.DEV_STATIC_PAGE_PASSWORD,
    },
    expect: {
        timeout: 6000
    },
    use: {
        ...defaultConfig.use,
        httpCredentials: {
            username: process.env.PROD_USER,
            password: process.env.PROD_PASS,
        }
    }
};

// set config for dev
const devConfig: TestConfig = {
    baseUrl: 'portal.dev.nucleusmvp.com',
    toplistServiceV1Uri: 'dev.nucleusmvp.com',
    nucleusPortalServiceUri: 'portal-be.dev.nucleusmvp.com',
    nucleusPortalToken: process.env.DEV_NUCLEUS_PORTAL_TOKEN,
    defaultDomainId: process.env.DEV_DEFAULT_DOMAIN_ID,
    defaultPaymentTypeId: process.env.DEV_DEFAULT_PAYMENT_TYPE,
    staticPage: {
        username: process.env.DEV_STATIC_PAGE_USER,
        password: process.env.DEV_STATIC_PAGE_PASSWORD,
    },
    name: `dev`,
    expect: {
        timeout: 6000
    },
    use: {
        ...defaultConfig.use,
        httpCredentials: {
            username: process.env.DEV_USER,
            password: process.env.DEV_PASS,
        }
    }
};

// set config for staging
const stagingConfig: TestConfig = {
    baseUrl: `portal.staging.nucleusmvp.com`,
    toplistServiceV1Uri: 'staging.nucleusmvp.com',
    nucleusPortalServiceUri: 'portal-be.staging.nucleusmvp.com',
    nucleusPortalToken: process.env.STAGING_NUCLEUS_PORTAL_TOKEN,
    defaultDomainId: process.env.STAGING_DEFAULT_DOMAIN_ID,
    defaultPaymentTypeId: process.env.STAGING_DEFAULT_PAYMENT_TYPE,
    staticPage: {
        username: process.env.STAGING_STATIC_PAGE_USER,
        password: process.env.STAGING_STATIC_PAGE_PASSWORD,
    },
    name: `staging`,
    expect: {
        timeout: 6000
    },
    use: {
        ...defaultConfig.use,
        httpCredentials: {
            username: process.env.STAGING_USER,
            password: process.env.STAGING_PASS,
        },
    }

};


// config object with default configuration and environment-specific configuration
const config: TestConfig = {
    ...defaultConfig,
    ...(environment.toLowerCase() === 'prod'
        ? prodConfig
        : environment.toLowerCase() === 'dev'
            ? devConfig
            : environment.toLowerCase() === 'staging'
                ? stagingConfig
                : {}),
};

export default config;
