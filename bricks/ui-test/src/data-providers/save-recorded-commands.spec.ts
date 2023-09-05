import { describe, test, expect } from "@jest/globals";
import { saveRecordedCommands } from "./save-recorded-commands.js";
import { createNodes } from "./shared/createNodes.js";

jest.mock("./shared/createNodes.js");

describe("saveRecordedCommands", () => {
  test("should work", async () => {
    await saveRecordedCommands({
      steps: [
        {
          event: "click",
          target: {
            tag: "button",
            type: "id",
            value: "my-button",
          },
        },
        {
          event: "dblclick",
          target: {
            tag: "input",
            type: "testid",
            value: "my-input",
          },
        },
        {
          event: "type",
          target: {
            tag: "input",
            type: "testid",
            value: "my-input",
          },
          text: "ok{enter}",
        },
      ],
      parent: "p_0",
      initialSort: 1,
    });
    expect(createNodes).toBeCalledWith(
      [
        {
          type: "command",
          name: "get",
          params: ["#my-button"],
          children: [
            {
              type: "command",
              name: "click",
            },
          ],
        },
        {
          type: "command",
          name: "findByTestId",
          params: ["my-input"],
          children: [
            {
              type: "command",
              name: "dblclick",
            },
            {
              type: "command",
              name: "type",
              params: ["ok{enter}"],
            },
          ],
        },
      ],
      "p_0",
      1
    );
  });
});
