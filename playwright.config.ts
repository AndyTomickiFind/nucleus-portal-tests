import { devices, PlaywrightTestConfig } from '@playwright/test';

// get the environment type from command line. If none, set it to prod
const environment = process.env.TEST_ENV || 'dev';

interface TestConfig extends PlaywrightTestConfig {
  baseUrl?: string;
  backendUrl?: string;
}

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const defaultConfig: PlaywrightTestConfig = {

  /* Test files to run. By default, all files that match the pattern are run. */
  testDir: './tests',
  testMatch: '**/*.spec.ts',

  /* Timeout for each test in milliseconds. */
  timeout: 200000,

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
  retries: process.env.CI ? 1 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ?
    [ /* Reporters on CI */
      ['json', {
        outputFolder: 'playwright-report/report',
        outputFile: `./playwright-report/results.json`
      }],
      ['html', { outputFolder: `playwright-report`, open: 'never' }],
      ['blob', { outputFile: `report.zip` }],
      ['github'],
      ['allure-playwright']
    ] :
    [ /* Reporters for local run */
      ['html', { outputFolder: `playwright-report`, open: 'never' }],
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
    headless: false,
    /* Video recording mode. */
    video: process.env.CI ? 'retain-on-failure' : 'on',
    /* Timeout for Playwright actions such as click, fill, etc. */
    actionTimeout: 8000
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'local-chrome',
      use: {
        ...devices['Desktop Chrome'],
        viewport: {
          width: 1920,
          height: 1080
        },
        launchOptions: {
          slowMo: 0
        }
      },
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
  baseUrl: 'portal.nucleusmvp.com/login',
  backendUrl: '',
  name: `prod`,
  expect: {
    timeout: 4000
  }
};
// set config for dev
const devConfig: TestConfig = {
  baseUrl: 'portal.dev.nucleusmvp.com/login',
  backendUrl: '',
  name: `dev`,
  expect: {
    timeout: 4000
  }
};
// set config for stage
const stageConfig: TestConfig = {
  baseUrl: `portal.staging.nucleusmvp.com/login`,
  backendUrl: '',
  name: `stage`,
  expect: {
    timeout: 4000
  },
  use: {
    ...defaultConfig.use,
    httpCredentials: {
      username: process.env.DEV_USER,
      password: process.env.DEV_PASS,
    }
  }
};


// config object with default configuration and environment specific configuration
const config: TestConfig = {
  ...defaultConfig,
  ...(environment.toLowerCase() === 'prod'
    ? prodConfig
    : environment === 'dev'
      ? devConfig
      : environment.toLowerCase() === 'stage'
        ? stageConfig
        : {}),
};

export default config;