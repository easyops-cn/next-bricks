import { describe, test, expect } from "@jest/globals";
import { getBrickCustomCommands } from "./get-brick-custom-commands.js";

describe("getBrickCustomCommands", () => {
  test("should work", async () => {
    expect((await getBrickCustomCommands()).length).toBeGreaterThan(0);
  });
});
