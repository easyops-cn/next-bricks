import { describe, test, expect } from "@jest/globals";
import { getImage, imageValidator } from "./utils.js";

URL.createObjectURL = jest.fn().mockImplementation((file: File) => file.name);
URL.revokeObjectURL = jest.fn();

const LOAD_FAILURE_FLAG = ":LOAD_FAILURE_FLAG";
Object.defineProperty(global.Image.prototype, "src", {
  set(src) {
    if (src.endsWith(LOAD_FAILURE_FLAG)) {
      setTimeout(() => this.onerror(new Error("image load error")), 100);
    } else {
      setTimeout(() => this.onload(), 100);
    }
  },
});

const mockNaturalWidth = jest.fn().mockReturnValue(20);
Object.defineProperty(global.Image.prototype, "naturalWidth", {
  get() {
    return mockNaturalWidth();
  },
});

const mockNaturalHeight = jest.fn().mockReturnValue(50);
Object.defineProperty(global.Image.prototype, "naturalHeight", {
  get() {
    return mockNaturalHeight();
  },
});

describe("utils", () => {
  test("getImage", async () => {
    await expect(getImage("test-url")).resolves.toBeInstanceOf(Image);
    await expect(
      getImage("test-url" + LOAD_FAILURE_FLAG)
    ).rejects.toThrowError();

    await expect(
      getImage(new File([""], "success.png", { type: "image/png" }), true)
    ).resolves.toBeInstanceOf(Image);
    await expect(
      getImage(new File([""], "success.txt", { type: "text/plain" }))
    ).rejects.toThrowError();
  });

  test("imageValidator", async () => {
    await expect(
      imageValidator(new File([""], "success.png", { type: "image/png" }))
    ).resolves.toBeInstanceOf(File);

    await expect(
      imageValidator(new File([""], "success.png", { type: "image/png" }), {
        width: 50,
      })
    ).resolves.toBeInstanceOf(File);
    await expect(
      imageValidator(new File([""], "success.png", { type: "image/png" }), {
        height: 100,
      })
    ).resolves.toBeInstanceOf(File);

    await expect(
      imageValidator(new File([""], "success.png", { type: "image/png" }), {
        width: 10,
        height: 20,
      })
    ).rejects.toThrowError();
  });
});
