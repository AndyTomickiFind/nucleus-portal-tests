import { test as base } from '@playwright/test';
import { LoginPage } from "../page-objects/login.page";
import {HomePage} from "../page-objects/home.page";
import {HeaderComponent} from "../page-objects/components/headerComponent";



export const test = base.extend<{
    LoginPage: LoginPage,
    HomePage: HomePage,
    headerComponent: HeaderComponent,
}>({
    LoginPage: async ({ page, context }, use, testInfo) => {
        await use(new LoginPage(page, context, testInfo));
    },
    HomePage: async ({ page, context }, use, testInfo) => {
        await use(new HomePage(page, context, testInfo));
    },
    headerComponent: async ({ page, context }, use, testInfo) => {
        await use(new HeaderComponent(page, context, testInfo));
    },
});