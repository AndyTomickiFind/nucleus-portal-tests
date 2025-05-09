import { test as base } from '@playwright/test';
import {HomePage} from "../page-objects/home.page";
import {MenuComponent} from "../page-objects/components/menuComponent";
import {ToplistsPage} from "../page-objects/toplists.page";
import {components} from "../page-objects/components/components";
import {NewToplistPage} from "../page-objects/newToplist.page";
import {ShortReviewsPage} from "../page-objects/shortReviews.page";
import {DatapointsPage} from "../page-objects/datapoints.page";
import {CasinosPage} from "../page-objects/casinos.page";
import {ExchangesPage} from "../page-objects/exchanges.page";
import {ToplistsUI} from "../page-objects/toplists-ui.page";



export const test = base.extend<{
    HomePage: HomePage,
    ToplistsPage: ToplistsPage,
    menuComponent: MenuComponent,
    components: components,
    NewToplistPage: NewToplistPage,
    ShortReviewsPage: ShortReviewsPage,
    DatapointsPage: DatapointsPage,
    CasinosPage: CasinosPage,
    ExchangesPage: ExchangesPage,
    ToplistsUI: ToplistsUI,
}>({
    HomePage: async ({ page, context }, use, testInfo) => {
        await use(new HomePage(page, context, testInfo));
    },
    ToplistsPage: async ({ page, context }, use, testInfo) => {
        await use(new ToplistsPage(page, context, testInfo));
    },
    NewToplistPage: async ({ page, context }, use, testInfo) => {
        await use(new NewToplistPage(page, context, testInfo));
    },
    ShortReviewsPage: async ({ page, context }, use, testInfo) => {
        await use(new ShortReviewsPage(page, context, testInfo));
    },
    DatapointsPage: async ({ page, context }, use, testInfo) => {
        await use(new DatapointsPage(page, context, testInfo));
    },
    CasinosPage: async ({ page, context }, use, testInfo) => {
        await use(new CasinosPage(page, context, testInfo));
    },
    ExchangesPage: async ({ page, context }, use, testInfo) => {
        await use(new ExchangesPage(page, context, testInfo));
    },
    menuComponent: async ({ page, context }, use, testInfo) => {
        await use(new MenuComponent(page, context, testInfo));
    },
    components: async ({ page, context }, use, testInfo) => {
        await use(new components(page, context, testInfo));
    },
    ToplistsUI: async ({ page, context }, use, testInfo) => {
        await use(new ToplistsUI(page, context, testInfo));
    },
});