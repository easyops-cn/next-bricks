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

jest.mock("../fa-icon/index.js", () => {
  const React = jest.requireActual("react") as any;
  return {
    WrappedFaIcon(props: any) {
      const { icon, onIconFoundChange } = props;
      React.useEffect(() => {
        if (icon === "unknown") {
          onIconFoundChange?.(new CustomEvent("icon.found", { detail: false }));
        }
      }, [icon, onIconFoundChange]);
      return ` fa-icon:${JSON.stringify(props)}`;
    },
  };
});

jest.mock("../img-icon/index.js", () => ({
  WrappedEoImgIcon(props: unknown) {
    return ` img-icon:${JSON.stringify(props)}`;
  },
}));

jest.mock("../svg-icon/index.js", () => ({
  WrappedSvgIcon(props: unknown) {
    return ` svg-icon:${JSON.stringify(props)}`;
  },
}));

describe("eo-icon", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-icon") as GeneralIcon;
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

    element.imgSrc = "https://test.com/image.jpg";
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(element.shadowRoot?.innerHTML).toMatchInlineSnapshot(
      `"<style>styles.shadow.css</style> img-icon:{"imgSrc":"https://test.com/image.jpg"}"`
    );

    element.imgSrc = "https://test.com/image.svg";
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(element.shadowRoot?.innerHTML).toMatchInlineSnapshot(
      `"<style>styles.shadow.css</style> svg-icon:{"imgSrc":"https://test.com/image.svg"}"`
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.textContent).toMatchInlineSnapshot(`""`);
  });

  test("unknown icon with fallback", async () => {
    const element = document.createElement("eo-icon") as GeneralIcon;
    element.lib = "fa";
    element.icon = "unknown";
    element.fallback = {
      lib: "antd",
      icon: "x",
    };

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.textContent).toMatchInlineSnapshot(
      `"styles.shadow.css antd-icon:{"icon":"x"}"`
    );

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("unknown lib with fallback", async () => {
    const element = document.createElement("eo-icon") as GeneralIcon;
    element.lib = "oops" as any;
    element.icon = "any";
    element.fallback = {
      lib: "antd",
      icon: "x",
    };

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.textContent).toMatchInlineSnapshot(
      `"styles.shadow.css antd-icon:{"icon":"x"}"`
    );

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("unknown lib with svg fallback", async () => {
    const element = document.createElement("eo-icon") as GeneralIcon;
    element.lib = "oops" as any;
    element.icon = "any";
    element.fallback = {
      imgSrc: "https://test.com/image.svg",
    };

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.textContent).toMatchInlineSnapshot(
      `"styles.shadow.css svg-icon:{"imgSrc":"https://test.com/image.svg"}"`
    );

    act(() => {
      document.body.removeChild(element);
    });
  });

  test("unknown lib without fallback", async () => {
    const element = document.createElement("eo-icon") as GeneralIcon;
    element.lib = "oops" as any;
    element.icon = "any";

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.textContent).toMatchInlineSnapshot(
      `"styles.shadow.css"`
    );

    act(() => {
      document.body.removeChild(element);
    });
  });
});
