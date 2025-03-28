import {APIResponse, TestInfo} from "@playwright/test";

export async function logResponse(response: APIResponse, context: TestInfo, method?: string): Promise<void> {
    const responseBody = await response.body();
    await context.attach(`Response Body of ${method} ${response.url()} Status: ${response.status()}`, {
        contentType: 'application/json',
        body: responseBody.toString()
    });
}