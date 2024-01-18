import { describe, test, expect } from "@jest/globals";
import { adjustLineLabels } from "./adjustLineLabels";
import type { RenderedLineLabel } from "../interfaces";

describe("adjustLineLabels", () => {
  test("direction 0 and 4", () => {
    const lineLabels = [
      {
        id: "line-1-start",
        position: [200, 100],
        placement: "start",
        angle: Math.PI / 8,
        size: [50, 20],
      },
      {
        id: "line-1-end",
        position: [200, 100],
        placement: "end",
        angle: Math.PI / 8,
        size: [50, 20],
      },
    ] as RenderedLineLabel[];
    const label1Start = document.createElement("span");
    const label1End = document.createElement("span");
    const refRepository = new Map([
      ["line-1-start", label1Start],
      ["line-1-end", label1End],
    ]);
    adjustLineLabels(lineLabels, refRepository);

    expect(label1Start.style.transform).toMatch(
      /^translate\(0,22.55[\d]+px\)$/
    );
    expect(label1End.style.transform).toMatch(
      /^translate\(-100%,calc\(-22.55[\d]+px - 100%\)\)$/
    );
  });

  test("direction 1 and 5", () => {
    const lineLabels = [
      {
        id: "line-1-start",
        position: [200, 100],
        placement: "start",
        angle: (Math.PI / 8) * 3,
        size: [50, 20],
      },
      {
        id: "line-1-end",
        position: [200, 100],
        placement: "end",
        angle: (Math.PI / 8) * 3,
        size: [50, 20],
      },
    ] as RenderedLineLabel[];
    const label1Start = document.createElement("span");
    const label1End = document.createElement("span");
    const refRepository = new Map([
      ["line-1-start", label1Start],
      ["line-1-end", label1End],
    ]);
    adjustLineLabels(lineLabels, refRepository);

    expect(label1Start.style.transform).toMatch(
      /^translate\(10.13[\d]+px,0\)$/
    );
    expect(label1End.style.transform).toMatch(
      /^translate\(calc\(-10.13[\d]+px - 100%\),-100%\)$/
    );
  });

  test("direction 2 and 6", () => {
    const lineLabels = [
      {
        id: "line-1-start",
        position: [200, 100],
        placement: "start",
        angle: (Math.PI / 8) * 5,
        size: [50, 20],
      },
      {
        id: "line-1-end",
        position: [200, 100],
        placement: "end",
        angle: (Math.PI / 8) * 5,
        size: [50, 20],
      },
    ] as RenderedLineLabel[];
    const label1Start = document.createElement("span");
    const label1End = document.createElement("span");
    const refRepository = new Map([
      ["line-1-start", label1Start],
      ["line-1-end", label1End],
    ]);
    adjustLineLabels(lineLabels, refRepository);

    expect(label1Start.style.transform).toMatch(
      /^translate\(calc\(-10.13[\d]+px - 100%\),0\)$/
    );
    expect(label1End.style.transform).toMatch(
      /^translate\(10.13[\d]+px,-100%\)$/
    );
  });

  test("direction 3 and 7", () => {
    const lineLabels = [
      {
        id: "line-1-start",
        position: [200, 100],
        placement: "start",
        angle: -Math.PI / 8,
      },
      {
        id: "line-1-end",
        position: [200, 100],
        placement: "end",
        angle: -Math.PI / 8,
      },
    ] as RenderedLineLabel[];
    const label1Start = document.createElement("span");
    const label1End = document.createElement("span");
    const refRepository = new Map([
      ["line-1-start", label1Start],
      ["line-1-end", label1End],
    ]);
    adjustLineLabels(lineLabels, refRepository);

    expect(label1Start.style.transform).toMatch(
      /^translate\(0,calc\(-1.84[\d]+px - 100%\)\)$/
    );
    expect(label1End.style.transform).toMatch(
      /^translate\(-100%,1.84[\d]+px\)$/
    );
  });

  test("center and no label", () => {
    const lineLabels = [
      {
        id: "line-1-start",
        position: [200, 100],
        placement: "start",
        angle: (Math.PI / 8) * 7,
        size: [50, 20],
      },
      {
        id: "line-1-center",
        position: [200, 100],
        placement: "center",
        angle: (Math.PI / 8) * 7,
        size: [50, 20],
      },
    ] as RenderedLineLabel[];
    const label1Start = document.createElement("span");
    const label1Center = document.createElement("span");
    const refRepository = new Map([["line-1-center", label1Center]]);
    adjustLineLabels(lineLabels, refRepository);

    expect(label1Start.style.transform).toMatch("");
    expect(label1Center.style.transform).toMatch("");
  });
});
