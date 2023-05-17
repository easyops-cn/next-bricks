import React from "react";
import { describe, test, expect } from "@jest/globals";
import { render } from "@testing-library/react";
import { DefineLinearGradient } from "./DefineLinearGradient.js";

describe("DefineLinearGradient", () => {
  test("should render top-to-bottom by default", () => {
    const { container } = render(
      <DefineLinearGradient startColor="red" endColor="blue" />
    );
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="gradients"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            height="0"
            width="0"
          >
            <defs>
              <lineargradient
                id="linear-gradient"
                x1="0"
                x2="0"
                y1="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stop-color="red"
                />
                <stop
                  offset="100%"
                  stop-color="blue"
                />
              </lineargradient>
            </defs>
          </svg>
        </div>
      </div>
    `);
  });

  test("should render in given direction", () => {
    const { container } = render(
      <DefineLinearGradient
        startColor="purple"
        endColor="pink"
        gradientDirection="left-to-right"
      />
    );
    expect(container).toMatchInlineSnapshot(`
      <div>
        <div
          class="gradients"
        >
          <svg
            aria-hidden="true"
            focusable="false"
            height="0"
            width="0"
          >
            <defs>
              <lineargradient
                id="linear-gradient"
                x1="0"
                x2="1"
                y1="0"
                y2="0"
              >
                <stop
                  offset="0%"
                  stop-color="purple"
                />
                <stop
                  offset="100%"
                  stop-color="pink"
                />
              </lineargradient>
            </defs>
          </svg>
        </div>
      </div>
    `);
  });

  test("should render nothing if no colors", () => {
    const { container } = render(<DefineLinearGradient />);
    expect(container.childNodes.length).toBe(0);
  });
});
