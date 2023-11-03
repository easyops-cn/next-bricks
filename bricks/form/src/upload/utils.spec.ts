import { describe, test, expect } from "@jest/globals";
import { acceptValidator, sizeValidator, FileSizeUnit } from "./utils.js";

describe("utils", () => {
  test("acceptValidator", () => {
    expect(
      acceptValidator(new File([""], "success.png", { type: "image/png" }))
    ).toBeTruthy();

    expect(
      acceptValidator(new File([""], "success.png", { type: "image/png" }), "*")
    ).toBeTruthy();
    expect(
      acceptValidator(
        new File([""], "success.png", { type: "image/png" }),
        "*/*"
      )
    ).toBeTruthy();

    expect(
      acceptValidator(
        new File([""], "success.png", { type: "image/png" }),
        ".png"
      )
    ).toBeTruthy();
    expect(
      acceptValidator(
        new File([""], "success.png", { type: "image/png" }),
        ".jpg"
      )
    ).toBeFalsy();

    expect(
      acceptValidator(
        new File([""], "success.png", { type: "image/png" }),
        "image/*"
      )
    ).toBeTruthy();
    expect(
      acceptValidator(
        new File([""], "success.png", { type: "image/png" }),
        "text/*"
      )
    ).toBeFalsy();

    expect(
      acceptValidator(
        new File([""], "success.png", { type: "image/png" }),
        "image/png"
      )
    ).toBeTruthy();
    expect(
      acceptValidator(
        new File([""], "success.png", { type: "image/png" }),
        "text/jpg"
      )
    ).toBeFalsy();
  });

  test("sizeValidator", async () => {
    const file = new File([""], "success.png", { type: "image/png" });
    Object.defineProperty(file, "size", {
      value: 3 * 1024 * 1024,
      configurable: true,
    });

    await expect(sizeValidator(file)).resolves.toBeInstanceOf(File);
    await expect(sizeValidator(file, 1024 * 1024 * 5)).resolves.toBeInstanceOf(
      File
    );
    await expect(
      sizeValidator(file, 1, FileSizeUnit.KB)
    ).rejects.toThrowError();
    await expect(
      sizeValidator(file, 0.1, FileSizeUnit.MB)
    ).rejects.toThrowError();
  });
});
