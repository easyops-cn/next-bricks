import React from "react";
import { describe, test, expect } from "@jest/globals";
import { render } from "@testing-library/react";
import { ConnectLineComponent } from "./ConnectLineComponent";
import type { ConnectLineState } from "./interfaces";

describe("ConnectLineComponent", () => {
  test("not connecting", () => {
    const { asFragment } = render(
      <ConnectLineComponent
        connectLineState={null}
        connectLineTo={[0, 0]}
        markerPrefix="marker-"
      />
    );
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <svg
          class="connect-line"
          height="100%"
          width="100%"
        >
          <defs>
            <marker
              id="marker-connect-line"
              markerHeight="6"
              markerWidth="6"
              orient="auto-start-reverse"
              refX="5"
              refY="3"
              stroke-linejoin="round"
              viewBox="0 0 6 6"
            >
              <path
                d="M 0.5 0.5 L 5.5 3 L 0.5 5.5 z"
                stroke-width="1"
              />
            </marker>
          </defs>
          <path
            d=""
            fill="none"
          />
        </svg>
      </DocumentFragment>
    `);
  });

  test("connecting", () => {
    const connectLineState: ConnectLineState = {
      from: [100, 200],
      options: { arrow: true },
    };
    const { asFragment, container, rerender } = render(
      <ConnectLineComponent
        connectLineState={connectLineState}
        connectLineTo={[102, 203]}
        markerPrefix="marker-"
      />
    );

    // Move distance is less than 5px
    expect(
      container.querySelector("svg")?.classList.contains("connecting")
    ).toBe(false);
    rerender(
      <ConnectLineComponent
        connectLineState={connectLineState}
        connectLineTo={[104, 204]}
        markerPrefix="marker-"
      />
    );
    expect(
      container.querySelector("svg")?.classList.contains("connecting")
    ).toBe(true);

    // Move distance is greater than or equal to 5px
    expect(asFragment()).toMatchInlineSnapshot(`
      <DocumentFragment>
        <svg
          class="connect-line connecting"
          height="100%"
          width="100%"
        >
          <defs>
            <marker
              id="marker-connect-line"
              markerHeight="6"
              markerWidth="6"
              orient="auto-start-reverse"
              refX="5"
              refY="3"
              stroke-linejoin="round"
              viewBox="0 0 6 6"
            >
              <path
                d="M 0.5 0.5 L 5.5 3 L 0.5 5.5 z"
                stroke-width="1"
              />
            </marker>
          </defs>
          <path
            d="M100 200L104 204"
            fill="none"
            marker-end="url(#marker-connect-line)"
          />
        </svg>
      </DocumentFragment>
    `);
  });
});
