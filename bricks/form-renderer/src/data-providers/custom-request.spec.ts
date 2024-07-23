import { describe, test, expect } from "@jest/globals";
import { customRequest } from "./custom-request.js";
import { http } from "@next-core/http";

jest.mock("@next-core/http");

describe("customRequest", () => {
  test("should work", async () => {
    const mockHttp = jest.spyOn(http, "request");
    await customRequest("api/cmdb", { method: "GET" });
    expect(mockHttp.mock.calls[0][0]).toEqual(
      "api/gateway/logic.gateway_serviceapi/cmdb"
    );
  });

  test("should work with full url", async () => {
    const mockHttp = jest.spyOn(http, "request");
    await customRequest("https://devops.dev.com/api/cmdb", { method: "GET" });
    expect(mockHttp.mock.calls[0][0]).toEqual(
      "https://devops.dev.com/api/cmdb"
    );
  });
});
