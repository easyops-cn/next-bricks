import React from "react";
import { act } from "react";
import { describe, test, expect } from "@jest/globals";
import { render, fireEvent } from "@testing-library/react";
import { ConnectLineComponent } from "./ConnectLineComponent";
import type { ConnectLineState } from "./interfaces";

describe("ConnectLineComponent", () => {
  const defaultTransform = { k: 1, x: 0, y: 0 };

  test("not connecting", () => {
    const onConnect = jest.fn();
    const { container } = render(
      <svg>
        <ConnectLineComponent
          connectLineState={null}
          transform={defaultTransform}
          markerEnd="marker-1"
          onConnect={onConnect}
        />
      </svg>
    );

    expect(
      container.querySelector("path")!.classList.contains("connecting")
    ).toBe(false);
  });

  test("connecting", () => {
    const onConnect = jest.fn();
    const connectLineState: ConnectLineState = {
      source: {
        type: "node",
        id: "node-1",
      } as any,
      from: [100, 200],
      offset: [30, 40],
    };
    const { container, rerender } = render(
      <svg>
        <ConnectLineComponent
          connectLineState={connectLineState}
          transform={defaultTransform}
          markerEnd="marker-1"
          onConnect={onConnect}
        />
      </svg>
    );

    rerender(
      <svg>
        <ConnectLineComponent
          connectLineState={connectLineState}
          transform={defaultTransform}
          markerEnd="marker-1"
          onConnect={onConnect}
        />
      </svg>
    );

    expect(
      container.querySelector("path")!.classList.contains("connecting")
    ).toBe(false);

    act(() => {
      fireEvent.mouseMove(document, {
        clientX: 140,
        clientY: 250,
      });
    });

    expect(
      container.querySelector("path")!.classList.contains("connecting")
    ).toBe(true);

    fireEvent.mouseDown(document);

    expect(onConnect).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(document, {
        clientX: 141,
        clientY: 251,
      });
    });
    expect(onConnect).toHaveBeenCalledWith(connectLineState, [111, 211]);
  });
});
