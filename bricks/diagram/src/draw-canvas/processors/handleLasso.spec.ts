import { describe, test, expect, jest } from "@jest/globals";
import { fireEvent } from "@testing-library/dom";
import { handleLasso } from "./handleLasso";
import type { PositionTuple } from "../../diagram/interfaces";

describe("handleLasso", () => {
  const onLassoing = jest.fn();
  const onLassoed = jest.fn();
  const methods = {
    onLassoing,
    onLassoed,
    transform: { k: 1, x: 0, y: 0 },
    offset: [0, 0] as PositionTuple,
  };

  test("lasso to bottom-right", () => {
    const mousedown = new MouseEvent("mousedown", { clientX: 10, clientY: 20 });
    handleLasso(mousedown, {
      ...methods,
    });

    fireEvent.mouseMove(document, { clientX: 11, clientY: 22 });
    expect(onLassoing).not.toBeCalled();

    fireEvent.mouseMove(document, { clientX: 25, clientY: 50 });
    expect(onLassoing).toBeCalledWith({ height: 30, width: 15, x: 10, y: 20 });

    fireEvent.mouseUp(document, { clientX: 26, clientY: 51 });
    expect(onLassoed).toBeCalledWith({ height: 31, width: 16, x: 10, y: 20 });
  });

  test("lasso to top-left", () => {
    const mousedown = new MouseEvent("mousedown", { clientX: 10, clientY: 20 });
    handleLasso(mousedown, {
      ...methods,
    });

    fireEvent.mouseMove(document, { clientX: 9, clientY: 18 });
    expect(onLassoing).not.toBeCalled();

    fireEvent.mouseMove(document, { clientX: 5, clientY: 10 });
    expect(onLassoing).toBeCalledWith({ height: 10, width: 5, x: 5, y: 10 });

    fireEvent.mouseUp(document, { clientX: 6, clientY: 11 });
    expect(onLassoed).toBeCalledWith({ height: 9, width: 4, x: 6, y: 11 });
  });

  test("lasso ignored", () => {
    const mousedown = new MouseEvent("mousedown", {
      clientX: 10,
      clientY: 20,
      ctrlKey: true,
    });
    handleLasso(mousedown, {
      ...methods,
    });

    fireEvent.mouseMove(document, { clientX: 5, clientY: 10 });
    expect(onLassoing).not.toBeCalled();
  });
});
