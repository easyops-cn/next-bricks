import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.js";
import { GeneralIcon } from "./index.js";

jest.mock("../antd-icon/index.js", () => ({
  WrappedAntdIcon(props: unknown) {
    return ` antd-icon:${JSON.stringify(props)}`;
  },
}));

jest.mock("../easyops-icon/index.js", () => ({
  WrappedEasyOpsIcon(props: unknown) {
    return ` easyops-icon:${JSON.stringify(props)}`;
  },
}));

jest.mock("../fa-icon/index.js", () => ({
  WrappedFaIcon(props: unknown) {
    return ` fa-icon:${JSON.stringify(props)}`;
  },
}));

describe("icons.general-icon", () => {
  test("basic usage", async () => {
    const element = document.createElement("icons.general-icon") as GeneralIcon;
    element.lib = "antd";
    element.icon = "branches";

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.textContent).toMatchInlineSnapshot(
      `"styles.shadow.css antd-icon:{"icon":"branches"}"`
    );

    element.lib = "easyops";
    element.icon = "account";
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(element.shadowRoot?.textContent).toMatchInlineSnapshot(
      `"styles.shadow.css easyops-icon:{"icon":"account"}"`
    );

    element.lib = "fa";
    element.icon = "user";
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(element.shadowRoot?.textContent).toMatchInlineSnapshot(
      `"styles.shadow.css fa-icon:{"icon":"user"}"`
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.textContent).toMatchInlineSnapshot(`""`);
  });
});
