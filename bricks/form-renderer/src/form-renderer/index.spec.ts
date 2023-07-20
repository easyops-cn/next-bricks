import { describe, test, expect, jest } from "@jest/globals";
import { unstable_createRoot } from "@next-core/runtime";
import "./";
import { EoFormRenderer } from "./index.js";

jest.mock("@next-core/runtime");

(
  unstable_createRoot as jest.MockedFunction<typeof unstable_createRoot>
).mockImplementation((container) => ({
  async render(conf) {
    await Promise.resolve();
    const elements = ([] as any[])
      .concat(conf)
      .map((item) => document.createElement(item.brick));
    container.replaceChildren(...elements);
  },
  unmount() {
    container.replaceChildren();
  },
}));

describe("eo-form-renderer", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-form-renderer"
    ) as EoFormRenderer;
    element.formData = {
      formSchema: {
        instanceId: "5fe8d5e7af541",
      },
    };

    expect(element.childNodes.length).toBe(0);

    document.body.appendChild(element);
    await (global as any).flushPromises();

    expect(element.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <form-renderer.form-renderer />,
      ]
    `);

    document.body.removeChild(element);
    await (global as any).flushPromises();
    expect(element.childNodes.length).toBe(0);

    // Append back
    document.body.appendChild(element);
    await (global as any).flushPromises();
    expect(element.childNodes.length).toBe(1);
  });
});
