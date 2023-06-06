import React from "react";
import { render, act, fireEvent } from "@testing-library/react";
import { DesktopDir } from "./DesktopDir.js";
import { NormalizedDesktopDir } from "../interfaces.js";
import * as context from "../DesktopDirContext.js";

const spyOnSetDesktopDir = jest.fn();
jest.spyOn(context, "useDesktopDirContext").mockReturnValue({
  setDesktopDir: spyOnSetDesktopDir,
});

interface MouseEventWithOffsets extends MouseEventInit {
  pageX?: number;
  pageY?: number;
  offsetX?: number;
  offsetY?: number;
  x?: number;
  y?: number;
}

class FakeMouseEvent extends MouseEvent {
  constructor(type: string, values: MouseEventWithOffsets) {
    const { pageX, pageY, offsetX, offsetY, x, y, ...mouseValues } = values;
    super(type, mouseValues);

    Object.assign(this, {
      offsetX: offsetX || 0,
      offsetY: offsetY || 0,
      pageX: pageX || 0,
      pageY: pageY || 0,
      x: x || 0,
      y: y || 0,
    });
  }
}

describe("DesktopDir", () => {
  it("should work", () => {
    const dir: NormalizedDesktopDir = {
      name: "hello",
      items: [
        {
          type: "app",
          id: "hello",
          app: {
            id: "hello",
            name: "world",
          } as any,
        },
      ],
    };
    const { container } = render(
      <DesktopDir name={dir.name} items={dir.items} />
    );
    expect(container.innerHTML).toMatchInlineSnapshot(
      `"<a class="dirLink" role="button"><img class="appIcon" src="default-app-icon.png"></a><span class="dirName">hello</span>"`
    );

    act(() => {
      fireEvent(
        container.querySelector("a") as HTMLElement,
        new FakeMouseEvent("click", {
          bubbles: true,
          clientX: 1,
          clientY: 2,
        })
      );
    });

    expect(spyOnSetDesktopDir).toBeCalledWith({
      dir,
      coordinates: {
        x: 1,
        y: 2,
      },
      activeIndex: -1,
    });
  });

  it("should render relative url icon", () => {
    const dir: NormalizedDesktopDir = {
      name: "hello",
      items: [
        {
          type: "app",
          id: "hello",
          app: {
            id: "hello",
            name: "world",
            icons: {
              large: "large.png",
            },
          } as any,
        },
      ],
    };
    const { container } = render(
      <DesktopDir name={dir.name} items={dir.items} />
    );
    expect(container).toMatchInlineSnapshot(`
      <div>
        <a
          class="dirLink"
          role="button"
        >
          <img
            class="appIcon"
            src="micro-apps/hello/large.png"
          />
        </a>
        <span
          class="dirName"
        >
          hello
        </span>
      </div>
    `);
  });

  it("should render absolute url icon", () => {
    const dir: NormalizedDesktopDir = {
      name: "hello",
      items: [
        {
          type: "app",
          id: "hello",
          app: {
            id: "hello",
            name: "world",
            icons: {
              large: "/large.png",
            },
          } as any,
        },
      ],
    };
    const { container } = render(
      <DesktopDir name={dir.name} items={dir.items} />
    );
    expect(container).toMatchInlineSnapshot(`
      <div>
        <a
          class="dirLink"
          role="button"
        >
          <img
            class="appIcon"
            src="/large.png"
          />
        </a>
        <span
          class="dirName"
        >
          hello
        </span>
      </div>
    `);
  });

  it("should render a custom item", () => {
    const dir: NormalizedDesktopDir = {
      name: "hello",
      items: [
        {
          type: "custom",
          id: "hello",
          name: "world",
          url: "/hello",
        },
      ],
    };
    const { container } = render(
      <DesktopDir name={dir.name} items={dir.items} />
    );
    expect(container).toMatchInlineSnapshot(`
      <div>
        <a
          class="dirLink"
          role="button"
        >
          <img
            class="appIcon"
            src="default-app-icon.png"
          />
        </a>
        <span
          class="dirName"
        >
          hello
        </span>
      </div>
    `);
  });
});
