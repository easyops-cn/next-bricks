import React, { useEffect, useState } from "react";
import { CacheUseBrickItem } from "./CacheUseBrickItem";
import { describe, test, expect } from "@jest/globals";
import { render } from "@testing-library/react";

let mockRenderTime = 0;

const MockReactUseBrick = ({ data }: any) => {
  const [key, setKey] = useState<number>(mockRenderTime);

  useEffect(() => {
    mockRenderTime++;
    setKey(mockRenderTime);
  }, [data]);

  return <div>{key}</div>;
};

jest.mock("@next-core/react-runtime", () => ({
  ReactUseMultipleBricks: ({ data }: any) => {
    return <MockReactUseBrick data={data} />;
  },
}));

describe("CacheUseBrickItem", () => {
  test("should work", () => {
    const useBrickConf = {
      brick: "div",
    };

    const data = {
      basic: "Hello",
      reference: {},
    };

    const { rerender } = render(
      <CacheUseBrickItem useBrick={useBrickConf} data={data} />
    );

    expect(mockRenderTime).toBe(1);

    // data not change, should not re-render
    rerender(<CacheUseBrickItem useBrick={useBrickConf} data={data} />);

    expect(mockRenderTime).toBe(1);

    // new reference with basic-type, should re-render
    rerender(
      <CacheUseBrickItem
        useBrick={useBrickConf}
        data={{
          ...data,
          basic: "Change",
        }}
      />
    );

    expect(mockRenderTime).toBe(2);

    const newData: Record<string, any> = {
      basic: "Change",
      reference: {
        a: 1,
      },
    };

    // new reference should re-render
    rerender(<CacheUseBrickItem useBrick={useBrickConf} data={newData} />);

    expect(mockRenderTime).toBe(3);

    newData.reference.a = 2;

    // reference not change, should not re-render
    rerender(<CacheUseBrickItem useBrick={useBrickConf} data={newData} />);

    expect(mockRenderTime).toBe(3);

    // reference change, should re-render
    rerender(
      <CacheUseBrickItem
        useBrick={useBrickConf}
        data={{
          ...newData,
          reference: {
            a: "change",
          },
        }}
      />
    );

    expect(mockRenderTime).toBe(4);

    // NOTE: should never add new property
    // newData.list = [{ a: 1 }];
    // rerender(<CacheUseBrickItem useBrick={useBrickConf} data={newData} />);
    // expect(mockRenderTime).toBe(5);
  });
});
