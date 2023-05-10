import { describe, test } from "@jest/globals";
import { drawLeadLineAndText } from "./utils.js";
import { datas } from "./index.spec.jsx";

describe("utils", () => {
  test("drawLeadLineAndText", () => {
    const dataPoints = [
      {
        x: 700,
        y: 140,
      },
      {
        x: 899.7218684219822,
        y: 285.10643118126103,
      },
      {
        x: 823.4349029814193,
        y: 519.8935688187389,
      },
      {
        x: 576.5650970185807,
        y: 519.893568818739,
      },
      {
        x: 500.27813157801774,
        y: 285.1064311812611,
      },
    ];
    const canvsaEle = document.createElement("canvas");
    const context = canvsaEle.getContext("2d");
    drawLeadLineAndText(
      context,
      [700, 350],
      210,
      [...dataPoints, ...dataPoints, ...dataPoints],
      datas
    );
  });
});
