import React, { forwardRef, useImperativeHandle } from "react";
import { describe, it, expect } from "@jest/globals";
import { render } from "@testing-library/react";
import { useMergeRefs } from "./useMergeRefs.js";

const RefComponent = forwardRef(function LegacyRefComponent(_, ref) {
  useImperativeHandle(ref, () => "refValue");
  return null;
});

describe("useMergeRefs", () => {
  it("should work", async () => {
    const refAsFunc = jest.fn();
    const refAsObj = { current: undefined };

    const Component = () => {
      const mergeRefs = useMergeRefs([refAsFunc, refAsObj, null, undefined]);

      return <RefComponent ref={mergeRefs} />;
    };

    const { unmount } = render(<Component />);

    expect(refAsFunc).toBeCalledTimes(1);
    expect(refAsFunc).lastCalledWith("refValue");
    expect(refAsObj.current).toBe("refValue");

    unmount();

    expect(refAsFunc).toBeCalledTimes(2);
    expect(refAsFunc).lastCalledWith(null);
    expect(refAsObj.current).toBe(null);
  });
});
