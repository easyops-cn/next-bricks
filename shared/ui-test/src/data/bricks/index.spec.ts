import { brickCommandsConf } from "./index.js";

describe("brickCommandsConf", () => {
  it("should work", () => {
    expect(brickCommandsConf.length).toBeGreaterThan(0);
  });
});
