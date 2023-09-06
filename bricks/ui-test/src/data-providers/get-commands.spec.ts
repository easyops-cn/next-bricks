import { describe, test, expect } from "@jest/globals";
import { getCommands } from "./get-commands.js";

describe("getCommands", () => {
  test("get all commands", async () => {
    const result = await getCommands();
    expect(result.length).toBeGreaterThan(10);
  });

  test("filter by category", async () => {
    const result = await getCommands({
      category: ["query"],
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((cmd) => cmd.category === "query"));
  });

  test("filter by chain", async () => {
    const result = await getCommands({
      chain: ["child", "dual"],
    });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((cmd) => cmd.chain !== "parent"));
  });

  test("filter by search (hit name)", async () => {
    const result = await getCommands({
      q: "Get",
    });
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "get",
        }),
      ]),
    );
  });

  test("filter by search (hit keywords)", async () => {
    const result = await getCommands({
      q: "test-id",
    });
    expect(result).toEqual([
      expect.objectContaining({
        name: "findByTestId",
      }),
      expect.objectContaining({
        name: "findAllByTestId",
      }),
    ]);
  });

  test("filter by category and chain", async () => {
    const result = await getCommands({
      category: ["action"],
      chain: ["parent", "dual"],
    });
    expect(result.length).toBeGreaterThan(0);
    expect(
      result.every((cmd) => cmd.category === "action" && cmd.chain !== "child"),
    );
  });
});
