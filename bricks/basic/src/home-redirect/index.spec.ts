import { describe, test, expect, jest } from "@jest/globals";
import { RuntimeApi_searchMicroAppStandalone } from "@next-api-sdk/micro-app-standalone-sdk";
import "./";
import type { HomeRedirect } from "./index.js";

jest.mock("@next-core/theme", () => ({}));
jest.mock("@next-api-sdk/micro-app-standalone-sdk");

const mockSearchMicroAppStandalone =
  RuntimeApi_searchMicroAppStandalone as jest.MockedFunction<
    typeof RuntimeApi_searchMicroAppStandalone
  >;
const location = window.location;
const consoleError = jest.spyOn(console, "error");

describe("basic.home-redirect", () => {
  beforeEach(() => {
    (window as any).location = location;
  });

  test("redirect to specific url", async () => {
    const element = document.createElement(
      "basic.home-redirect"
    ) as HomeRedirect;
    element.redirectUrl = "/test";

    delete (window as any).location;
    (window as any).location = {
      origin: location.origin,
      replace: jest.fn(),
      reload: jest.fn(),
      assign: jest.fn(),
    } as unknown as Location;

    document.body.appendChild(element);

    await (global as any).flushPromises();
    expect(window.location.replace).toHaveBeenCalledWith("test");

    document.body.removeChild(element);
  });

  test("redirect to specific app", async () => {
    const element = document.createElement(
      "basic.home-redirect"
    ) as HomeRedirect;
    element.appId = "search";

    mockSearchMicroAppStandalone.mockResolvedValueOnce({
      list: [
        {
          appId: "search",
          currentVersion: "1.0.1",
          installStatus: "ok",
          homepage: "/search",
        },
      ],
      total: 1,
    });

    delete (window as any).location;
    (window as any).location = {
      replace: jest.fn(),
    } as unknown as Location;

    document.body.appendChild(element);

    await (global as any).flushPromises();
    expect(window.location.replace).toHaveBeenCalledWith("search");

    document.body.removeChild(element);
  });

  test("redirect to unknown app", async () => {
    consoleError.mockReturnValueOnce();
    const element = document.createElement(
      "basic.home-redirect"
    ) as HomeRedirect;
    element.appId = "unknown";

    mockSearchMicroAppStandalone.mockResolvedValueOnce({
      list: [],
      total: 0,
    });

    delete (window as any).location;
    (window as any).location = {
      replace: jest.fn(),
    } as unknown as Location;

    document.body.appendChild(element);

    await (global as any).flushPromises();
    expect(window.location.replace).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledWith(
      "Redirect target not found, appId:",
      "unknown"
    );

    document.body.removeChild(element);

    expect(consoleError).toHaveBeenCalledTimes(1);
  });

  test("api failed", async () => {
    consoleError.mockReturnValueOnce();
    const element = document.createElement(
      "basic.home-redirect"
    ) as HomeRedirect;
    element.appId = "unknown";

    const error = new Error("oops");
    mockSearchMicroAppStandalone.mockRejectedValueOnce(error);

    delete (window as any).location;
    (window as any).location = {
      replace: jest.fn(),
    } as unknown as Location;

    document.body.appendChild(element);

    await (global as any).flushPromises();
    expect(window.location.replace).not.toHaveBeenCalled();
    expect(consoleError).toHaveBeenCalledWith(
      "Search micro app '%s' for redirect failed:",
      "unknown",
      error
    );

    document.body.removeChild(element);

    expect(consoleError).toHaveBeenCalledTimes(1);
  });

  test("no appId nor redirectUrl", async () => {
    consoleError.mockReturnValueOnce();
    const element = document.createElement(
      "basic.home-redirect"
    ) as HomeRedirect;

    delete (window as any).location;
    (window as any).location = {
      replace: jest.fn(),
    } as unknown as Location;

    document.body.appendChild(element);

    await (global as any).flushPromises();
    expect(window.location.replace).not.toHaveBeenCalled();

    document.body.removeChild(element);

    expect(consoleError).not.toHaveBeenCalled();
  });
});
