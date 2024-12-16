import {APIResponse, TestInfo} from "@playwright/test";

export async function logResponse(response: APIResponse, context: TestInfo): Promise<void> {
    const responseBody = await response.body();
    await context.attach(`Response Body of ${response.url()}`, {
        contentType: 'application/json',
        body: responseBody.toString()
    });
   // console.log(responseBody.toString())
}