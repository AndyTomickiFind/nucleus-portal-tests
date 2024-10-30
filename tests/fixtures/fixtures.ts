import { test as base } from '@playwright/test';
import {HomePage} from "../page-objects/home.page";
import {MenuComponent} from "../page-objects/components/menuComponent";



export const test = base.extend<{
    HomePage: HomePage,
    menuComponent: MenuComponent,
}>({
    HomePage: async ({ page, context }, use, testInfo) => {
        await use(new HomePage(page, context, testInfo));
    },
    menuComponent: async ({ page, context }, use, testInfo) => {
        await use(new MenuComponent(page, context, testInfo));
    },
});