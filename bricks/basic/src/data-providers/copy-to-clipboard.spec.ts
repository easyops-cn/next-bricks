import { describe, test, expect } from "@jest/globals";
import { copyToClipboard } from "./copy-to-clipboard.js";

const writeText = jest.fn();
const execCommand = jest.fn();

describe("copyToClipboard", () => {
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    navigator.clipboard = {
      writeText: writeText,
    };
    document.execCommand = execCommand;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("Clipboard API", async () => {
    writeText.mockResolvedValue(null);
    await copyToClipboard("something");
    expect(writeText).toHaveBeenCalledWith("something");
  });

  test("execCommand", async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    navigator.clipboard = undefined;

    await copyToClipboard("something");
    expect(execCommand).toHaveBeenCalledWith("copy");
  });
});
