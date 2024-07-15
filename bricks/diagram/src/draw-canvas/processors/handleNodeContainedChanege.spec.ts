import { describe, test, expect } from "@jest/globals";
import { handleNodeContainedChanege } from "./handleNodeContainedChanege";
import { Cell } from "../interfaces";
import { MoveCellPayload } from "../reducers/interfaces";
describe("handleNodeContainedChanege", () => {
  const cells = [
    {
      type: "decorator",
      id: "container-1",
      decorator: "container",
      view: {
        x: 50,
        y: 400,
        width: 280,
        height: 120,
        direction: "top",
        text: " 上层服务",
      },
    },
    {
      type: "node",
      id: "Z",
      data: {
        name: "Node Z",
      },
      view: {
        x: 468,
        y: 315,
        width: 60,
        height: 60,
      },
    },
    {
      type: "node",
      id: "W",
      containerId: "container-1",
      data: {
        name: "Node W",
      },
      view: {
        x: 404,
        y: 430,
        width: 60,
        height: 60,
      },
    },
  ] as unknown as Cell[];
  const payloads = [
    {
      type: "node",
      id: "Z",
      x: 120.58634538152609,
      y: 433.5783132530121,
      width: 60,
      height: 60,
      containerCell: {
        type: "decorator",
        id: "container-1",
        decorator: "container",
        view: {
          x: 50,
          y: 400,
          width: 280,
          height: 120,
          direction: "top",
          text: " 上层服务",
        },
      },
    },
    {
      type: "node",
      id: "W",
      x: 56.58634538152609,
      y: 548.5783132530121,
      width: 60,
      height: 60,
    },
  ] as unknown as MoveCellPayload[];
  const onContainerContainerChange = jest.fn();
  test("Executing the onContainerContainerChange", () => {
    handleNodeContainedChanege(payloads, cells, onContainerContainerChange);
    expect(onContainerContainerChange).toHaveBeenCalled();
  });
  test("Not executing the onContainerContainerChange", () => {
    handleNodeContainedChanege(
      [
        {
          type: "node",
          id: "W",
          x: 77.3895582329317,
          y: 414.39759036144585,
          width: 60,
          height: 60,
          containerCell: {
            type: "decorator",
            id: "container-1",
            decorator: "container",
            view: {
              x: 50,
              y: 400,
              width: 280,
              height: 120,
              direction: "top",
              text: " 上层服务",
            },
          },
        },
      ],
      cells,
      onContainerContainerChange
    );
    expect(onContainerContainerChange).toHaveBeenCalledTimes(0);
  });
});
