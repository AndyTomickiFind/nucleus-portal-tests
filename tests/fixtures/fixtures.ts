import { test as base } from '@playwright/test';
import {HomePage} from "../page-objects/home.page";
import {HeaderComponent} from "../page-objects/components/headerComponent";



export const test = base.extend<{
    HomePage: HomePage,
    headerComponent: HeaderComponent,
}>({
    HomePage: async ({ page, context }, use, testInfo) => {
        await use(new HomePage(page, context, testInfo));
    },
    headerComponent: async ({ page, context }, use, testInfo) => {
        await use(new HeaderComponent(page, context, testInfo));
    },
});