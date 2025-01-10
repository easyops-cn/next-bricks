import React, { createRef } from "react";
import { describe, test, expect } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import {
  useResizeObserver,
  type ResizeObserveProps,
} from "./index.js";
import { type ResizeCallback } from "./resizeObserverUtil.js";
import { act } from "react";

let resizeCallback: ResizeCallback;

jest.mock("./resizeObserverUtil", () => ({
  observe: (element: Element, callback: ResizeCallback) => {
    resizeCallback = callback;
  },
  unobserve: (element: Element, callback: ResizeCallback) => {
    resizeCallback = null;
  },
}));

const triggerResize = ({
  clientWidth,
  clientHeight,
}: {
  clientWidth: number;
  clientHeight: number;
}): void => {
  resizeCallback?.({
    target: { clientWidth, clientHeight },
  } as ResizeObserverEntry);
};

const Component = (
  props: ResizeObserveProps<HTMLDivElement>
): React.ReactElement => {
  const [ref, { clientWidth, clientHeight }] = useResizeObserver<HTMLDivElement>(props);

  return (
    <div>
      <div ref={ref}>ref</div>
      <div data-testid="text">{`clientWidth: ${clientWidth}, clientHeight: ${clientHeight}`}</div>
    </div>
  );
};

describe("useResizeObserve", () => {
  test("should update entry for element on change", async () => {
    const onResize = jest.fn();

    render(<Component onResize={onResize} />);
    expect(screen.getByTestId("text").textContent).toBe("clientWidth: 0, clientHeight: 0");

    act(() => {
      triggerResize({
        clientWidth: 50,
        clientHeight: 100,
      });
    });
    expect(screen.getByTestId("text").textContent).toBe(
      "clientWidth: 50, clientHeight: 100"
    );
    expect(onResize).lastCalledWith({ target: { clientWidth: 50, clientHeight: 100 } });
    expect(onResize).toBeCalledTimes(1);

    // trigger the same size
    act(() => {
      triggerResize({
        clientWidth: 50,
        clientHeight: 100,
      });
    });
    expect(onResize).toBeCalledTimes(1);
  });

  test("targetRef should work", async () => {
    const onResize = jest.fn();

    render(<Component targetRef={createRef()} onResize={onResize} />);

    act(() => {
      triggerResize({
        clientWidth: 50,
        clientHeight: 100,
      });
    });
    expect(screen.getByTestId("text").textContent).toBe(
      "clientWidth: 50, clientHeight: 100"
    );
    expect(onResize).lastCalledWith({ target: { clientWidth: 50, clientHeight: 100 } });

    act(() => {
      triggerResize({
        clientWidth: 40,
        clientHeight: 100,
      });
    });
    expect(screen.getByTestId("text").textContent).toBe(
      "clientWidth: 40, clientHeight: 100"
    );
    expect(onResize).lastCalledWith({ target: { clientWidth: 40, clientHeight: 100 } });
  });

  test("boundary situation should work", async () => {
    render(<Component />);

    act(() => {
      triggerResize({} as any);
    });
    expect(screen.getByTestId("text").textContent).toBe("clientWidth: 0, clientHeight: 0");
  });
});
