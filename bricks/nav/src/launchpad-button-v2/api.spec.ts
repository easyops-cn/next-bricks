import { describe, test, expect } from "@jest/globals";
import { initializeI18n } from "@next-core/i18n";
import { LaunchpadApi_getLaunchpadInfo } from "@next-api-sdk/micro-app-standalone-sdk";
import {
  LaunchpadApi_createCollection,
  LaunchpadApi_deleteCollection,
  LaunchpadApi_listCollection,
} from "@next-api-sdk/user-service-sdk";
import { fetchLaunchpadInfo } from "./api.js";

jest.mock("@next-api-sdk/micro-app-standalone-sdk");
jest.mock("@next-api-sdk/user-service-sdk");

const getLaunchpadInfo = LaunchpadApi_getLaunchpadInfo as jest.Mock;

initializeI18n();

describe("fetchLaunchpadInfo", () => {
  test("", async () => {
    getLaunchpadInfo.mockResolvedValueOnce({
      storyboards: [
        {
          app: {
            name: "Hello",
            locales: {
              en: {
                name: "Hello",
              },
              zh: {
                name: "你好",
              },
            },
          },
        },
        {
          app: {
            name: "Oops",
          },
        },
      ],
    });
    const result = await fetchLaunchpadInfo();
    expect(result).toMatchInlineSnapshot(`
{
  "storyboards": [
    {
      "app": {
        "localeName": "Hello",
        "locales": {
          "en": {
            "name": "Hello",
          },
          "zh": {
            "name": "你好",
          },
        },
        "name": "Hello",
      },
    },
    {
      "app": {
        "localeName": "Oops",
        "name": "Oops",
      },
    },
  ],
}
`);
  });
});
