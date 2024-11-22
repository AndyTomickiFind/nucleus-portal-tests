
import { test, expect } from '@playwright/test';
import { logResponse } from '../../src/logger';
import config from "../../playwright.config";
import fs from "fs";

test(`[${config.name.toUpperCase()}] GET /api/v1/partners/{id}`, async ({ request }, testInfo) => {
    const testData = JSON.parse(fs.readFileSync(`tests/api/testData_${process.env.TEST_ENV}/partnersIds.json`, 'utf-8'));
    const response = await request.get(`https://${config.toplistServiceV1Uri}/api/v1/partners/${testData._id}`, {
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

    await logResponse(response, testInfo);

    expect(response.status()).toBe(200);
    //const fullExpectedResponse = JSON.parse(fs.readFileSync(`tests/api/expectedResponses_${process.env.TEST_ENV}/partnersDetails.json`, 'utf-8'))
    const responseBody = await response.json();
    //expect(responseBody).toMatchObject(fullExpectedResponse);

    expect(responseBody).toHaveProperty('partnerDetails');

    const partnerDetails = responseBody.partnerDetails;

    // Validate the top-level fields
    expect(partnerDetails).toHaveProperty('id');
    expect(partnerDetails).toHaveProperty('name');
    expect(partnerDetails).toHaveProperty('description');
    expect(partnerDetails).toHaveProperty('landingPageUrl');
    expect(partnerDetails).toHaveProperty('yearFounded');
    expect(partnerDetails).toHaveProperty('operatedBy');
    expect(partnerDetails).toHaveProperty('bonuses');
    expect(partnerDetails).toHaveProperty('rating');
    expect(partnerDetails).toHaveProperty('homepageImageDesktop');
    expect(partnerDetails).toHaveProperty('homepageImageMobile');
    expect(partnerDetails).toHaveProperty('logo');
    expect(partnerDetails).toHaveProperty('prosCons');
    expect(partnerDetails).toHaveProperty('coins');

    // Validate types and formats
    expect(typeof partnerDetails.id).toBe('string');
    expect(typeof partnerDetails.name).toBe('string');
    expect(typeof partnerDetails.description).toBe('string');
    expect(partnerDetails.landingPageUrl).toMatch(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i);
    expect(typeof partnerDetails.yearFounded).toBe('number');
    expect(Array.isArray(partnerDetails.operatedBy)).toBeTruthy();
    expect(Array.isArray(partnerDetails.bonuses)).toBeTruthy();
    expect(typeof partnerDetails.rating).toBe('number');
    expect(partnerDetails.homepageImageDesktop).toHaveProperty('url');
    expect(partnerDetails.homepageImageMobile).toHaveProperty('url');
    expect(partnerDetails.logo).toHaveProperty('url');

    // Validate pros and cons
    expect(partnerDetails.prosCons).toHaveProperty('pros');
    expect(partnerDetails.prosCons).toHaveProperty('cons');
    expect(Array.isArray(partnerDetails.prosCons.pros)).toBeTruthy();
    expect(Array.isArray(partnerDetails.prosCons.cons)).toBeTruthy();

    partnerDetails.prosCons.pros.forEach(pro => {
        expect(pro).toHaveProperty('content');
        expect(pro).toHaveProperty('title');
        expect(pro).toHaveProperty('field');
        expect(pro).toHaveProperty('id');
    });

    partnerDetails.prosCons.cons.forEach(con => {
        expect(con).toHaveProperty('content');
        expect(con).toHaveProperty('title');
        expect(con).toHaveProperty('field');
        expect(con).toHaveProperty('id');
    });

    // Validate coins
    expect(Array.isArray(partnerDetails.coins)).toBeTruthy();
    partnerDetails.coins.forEach(coin => {
        expect(coin).toHaveProperty('id');
        expect(coin).toHaveProperty('name');
        expect(coin).toHaveProperty('logo');
        expect(coin).toHaveProperty('shortname');
        expect(typeof coin.id).toBe('string');
        expect(typeof coin.name).toBe('string');
        expect(typeof coin.logo).toBe('string');
        expect(typeof coin.shortname).toBe('string');
    });
});
