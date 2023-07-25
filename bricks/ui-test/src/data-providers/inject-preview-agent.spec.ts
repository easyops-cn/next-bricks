import { describe, test, expect } from "@jest/globals";
import { injectPreviewAgent } from "./inject-preview-agent.js";

describe("injectPreviewAgent", () => {
  test("should work", async () => {
    expect(await injectPreviewAgent()).toBe(undefined);
  });
});
