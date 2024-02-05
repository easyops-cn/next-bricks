import { describe, test } from "@jest/globals";
import { captureSnapshot } from "./capture-snapshot.js";
jest.mock("html2canvas", () => ({
  __esModule: true,
  default: jest.fn().mockResolvedValue({
    toDataURL: jest.fn(),
  }),
}));
describe("captureSnapshot", () => {
  test("fileType is image", async () => {
    await captureSnapshot({
      fileType: "image",
      name: "image",
    });
  });
});
