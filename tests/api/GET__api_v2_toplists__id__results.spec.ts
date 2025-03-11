import {expect, test} from '@playwright/test';
import {logResponse} from '../../src/logger';
import config from "../../playwright.config";
import fs from "fs";

test(`[${config.name.toUpperCase()}] GET /api/v2/toplists/{id}/results`, async ({request}, testInfo) => {

    const expectedFields = [
        'id',
        'name',
        'logo',
        'landingPageUrl',
        'finalRating',
        'licenses',
        'yearFounded',
        'TC',
        'casinoProducts',
        'numberCasinoGames',
        'languages',
        'supportLanguages',
        'playWithFiat',
        'homepageImageDesktop',
        'homepageImageMobile',
        'position'
    ];


    const testData = JSON.parse(fs.readFileSync(`tests/api/testData_${process.env.TEST_ENV}/toplistsIds.json`, 'utf-8'));
    const response = await request.get(`https://${config.toplistServiceV1Uri}/api/v2/toplists/${testData._id}/results`, {
        headers: {
            // Add headers if needed
        },
        params: {
            // Add query params if needed
        },
        data: {
            // Add body data if needed
        }
    });

    await logResponse(response, testInfo, "GET");


    expect(response.status()).toBe(200);
   // const fullExpectedResponse = JSON.parse(fs.readFileSync(`tests/api/expectedResponses_${process.env.TEST_ENV}/results_v2.json`, 'utf-8'))
    // expect(responseBody).toMatchObject(fullExpectedResponse);

    // Parse the response body as JSON
    const results = await response.json();
    const responseBody = results.sites;


    // Ensure responseBody is an array
    expect(Array.isArray(responseBody)).toBeTruthy();

    // Define a regex pattern for the "id" field
    const idPattern = /^[0-9a-fA-F]{24}$/;

    // Define a regex pattern for URLs
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;

    // Iterate over the items in the response to validate each one
    responseBody.forEach(item => {
        // Check the presence and type of each expected field
        expectedFields.forEach(field => {
            expect(item).toHaveProperty(field);
        });

        // Validate specific fields and types
        expect(item.id).toMatch(idPattern);
        expect(typeof item.name).toBe('string');
        expect(item.logo).toHaveProperty('url');
        expect(item.landingPageUrl).toMatch(urlPattern);
        expect(typeof item.finalRating).toBe('number');
        expect(Array.isArray(item.licenses)).toBeTruthy();
        item.licenses.forEach(license => {
            expect(typeof license).toBe('string');
        });
        expect(typeof item.yearFounded).toBe('number');
        expect(item.TC).toMatch(urlPattern);
        expect(Array.isArray(item.casinoProducts)).toBeTruthy();
        item.casinoProducts.forEach(product => {
            expect(typeof product).toBe('string');
        });
        expect(typeof item.numberCasinoGames).toBe('number');
        expect(Array.isArray(item.languages)).toBeTruthy();
        item.languages.forEach(language => {
            expect(typeof language).toBe('string');
        });
        expect(Array.isArray(item.supportLanguages)).toBeTruthy();
        item.supportLanguages.forEach(language => {
            expect(typeof language).toBe('string');
        });
        expect(Array.isArray(item.playWithFiat)).toBeTruthy();
        item.playWithFiat.forEach(currency => {
            expect(currency).toHaveProperty('id');
            expect(currency).toHaveProperty('name');
            expect(currency).toHaveProperty('image');
            expect(currency).toHaveProperty('iso');
            expect(currency.id).toMatch(idPattern);
            expect(typeof currency.name).toBe('string');
            expect(currency.image).toHaveProperty('url');
            expect(typeof currency.iso).toBe('string');
        });
        expect(item.homepageImageDesktop).toHaveProperty('url');
        expect(item.homepageImageMobile).toHaveProperty('url');
        expect(typeof item.position).toBe('number');
    });
});

test(`[${config.name.toUpperCase()}] Cryptogambling - GET /api/v2/toplists/{id}/results`,{
    annotation: {
        type: 'issue',
        description: 'https://findco.atlassian.net/browse/DEV-5314',
    },
}, async ({request}, testInfo) => {

    const expectedFields = [
        'id',
        'name',
        'logo',
        'landingPageUrl',
        'finalRating',
        'licenses',
        'yearFounded',
        'TC',
        'casinoProducts',
        'numberCasinoGames',
        'languages',
        'supportLanguages',
        'playWithFiat',
        'homepageImageDesktop',
        'homepageImageMobile',
        'position',
        'depositMethodsCrypto',
        'promoCode'
    ];

    const testData = JSON.parse(fs.readFileSync(`tests/api/testData_${process.env.TEST_ENV}/cryptogambling-toplistsIds.json`, 'utf-8'));
    const response = await request.get(`https://${config.toplistServiceV1Uri}/api/v2/toplists/${testData._id}/results`, {
        headers: {
            // Add headers if needed
        },
        params: {
            // Add query params if needed
        },
        data: {
            // Add body data if needed
        }
    });

    await logResponse(response, testInfo, "GET");

    expect(response.status()).toBe(200);

    // Parse the response body as JSON
    const results = await response.json();
    const responseBody = results.sites;


    // Ensure responseBody is an array
    expect(Array.isArray(responseBody)).toBeTruthy();

    // Define a regex pattern for the "id" field
    const idPattern = /^[0-9a-fA-F]{24}$/;

    // Define a regex pattern for URLs
    const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;


    // Iterate over the items in the response to validate each one
    responseBody.forEach(item => {
        // Check the presence and type of each expected field
        expectedFields.forEach(field => {
            expect(item).toHaveProperty(field);
        });

        // Validate specific fields and types
        expect(item.id).toMatch(idPattern);
        expect(typeof item.name).toBe('string');

        expect(item.logo).toHaveProperty('url');
        expect(item.landingPageUrl).toMatch(urlPattern);
        expect(typeof item.finalRating).toBe('number');
        expect(Array.isArray(item.licenses)).toBeTruthy();
        item.licenses.forEach(license => {
            expect(typeof license).toBe('string');
        });
        expect(typeof item.yearFounded).toBe('number');
        expect(item.TC).toMatch(urlPattern);
        expect(Array.isArray(item.casinoProducts)).toBeTruthy();
        item.casinoProducts.forEach(product => {
            expect(typeof product).toBe('string');
        });
        expect(typeof item.numberCasinoGames).toBe('number');
        expect(Array.isArray(item.languages)).toBeTruthy();
        item.languages.forEach(language => {
            expect(typeof language).toBe('string');
        });
        expect(Array.isArray(item.supportLanguages)).toBeTruthy();
        item.supportLanguages.forEach(language => {
            expect(typeof language).toBe('string');
        });
        expect(Array.isArray(item.playWithFiat)).toBeTruthy();
        item.playWithFiat.forEach(currency => {
            expect(currency).toHaveProperty('id');
            expect(currency).toHaveProperty('name');
            expect(currency).toHaveProperty('image');
            expect(currency).toHaveProperty('iso');
            expect(currency.id).toMatch(idPattern);
            expect(typeof currency.name).toBe('string');
            expect(currency.image).toHaveProperty('url');
            expect(typeof currency.iso).toBe('string');
        });

        expect(Array.isArray(item.depositMethodsCrypto)).toBeTruthy();
        item.depositMethodsCrypto.forEach(coin => {
            expect(coin).toHaveProperty('id');
            expect(coin).toHaveProperty('name');
            expect(coin).toHaveProperty('image');
            expect(coin).toHaveProperty('iso');

            expect(coin.id).toMatch(idPattern);
            expect(typeof coin.name).toBe('string');
            expect(coin.image).toHaveProperty('url');
            expect(typeof coin.iso).toBe('string');
        });

        // Filter items that have the "priority" field
        const itemsWithPriority = item.depositMethodsCrypto.filter(coin => Object.prototype.hasOwnProperty.call(coin, 'priority'));
        // Check that the filtered array is sorted by "priority" in descending order
        for (let i = 1; i < itemsWithPriority.length; i++) {
            expect(itemsWithPriority[i - 1].priority).toBeGreaterThanOrEqual(itemsWithPriority[i].priority);
        }

        expect(item.homepageImageDesktop).toHaveProperty('url');
        expect(item.homepageImageMobile).toHaveProperty('url');
        expect(typeof item.position).toBe('number');
    });
});

