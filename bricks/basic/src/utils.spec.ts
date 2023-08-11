import { getRuntime } from "@next-core/runtime";
import { getNewUIStatus } from "./utils";

jest.mock("@next-core/runtime");

const featureFlagsFn = jest.fn().mockReturnValue({
  "support-ui-8.0-base-layout": true,
});
const currentRouteFn = jest.fn().mockReturnValue({
  bricks: [
    {
      brick: "base-layout.tpl-base-page-module",
    },
  ],
});
(getRuntime as jest.Mock).mockReturnValue({
  getFeatureFlags: featureFlagsFn,
  getCurrentRoute: currentRouteFn,
});

describe("utils", () => {
  it("getNewUIStatus with ui8.0", () => {
    const isShowNewUI = getNewUIStatus();
    expect(isShowNewUI).toBeTruthy();
  });

  it("should work with no route data", () => {
    currentRouteFn.mockReturnValueOnce(undefined);

    expect(getNewUIStatus()).toEqual(false);
  });

  it("getNewUIStatus with ui8.0 and isTplBasePage is true", () => {
    const isShowNewUI = getNewUIStatus(true);
    expect(isShowNewUI).toBeTruthy();
  });

  it("getNewUIStatus with ui6.0", () => {
    const featureFlagsFn = jest.fn().mockReturnValue({
      "support-ui-8.0-base-layout": false,
    });
    const currentRouteFn = jest.fn().mockReturnValue({
      bricks: [
        {
          brick: "basic-bricks.micro-view",
        },
      ],
    });
    (getRuntime as jest.Mock).mockReturnValue({
      getFeatureFlags: featureFlagsFn,
      getCurrentRoute: currentRouteFn,
    });
    const isShowNewUI = getNewUIStatus();
    expect(isShowNewUI).toBeFalsy();
  });

  it("should migrate v3", async () => {
    const featureFlagsFn = jest.fn().mockReturnValue({
      "support-ui-8.0-base-layout": false,
      "migrate-to-brick-next-v3": true,
    });
    const currentRouteFn = jest.fn().mockReturnValue({
      bricks: [
        {
          brick: "basic-bricks.micro-view",
        },
      ],
    });
    (getRuntime as jest.Mock).mockReturnValue({
      getFeatureFlags: featureFlagsFn,
      getCurrentRoute: currentRouteFn,
    });
    expect(getNewUIStatus()).toBeTruthy();
  });
});
