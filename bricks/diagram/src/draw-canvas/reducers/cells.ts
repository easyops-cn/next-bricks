import type { Reducer } from "react";
import type { DrawCanvasAction } from "./interfaces";
import type { Cell, NodeCell } from "../interfaces";
import { isNodeCell } from "../processors/asserts";
import { SYMBOL_FOR_SIZE_INITIALIZED } from "../constants";

export const cells: Reducer<Cell[], DrawCanvasAction> = (state, action) => {
  switch (action.type) {
    case "drop-node":
      return insertCellAfter(
        state,
        action.payload,
        (cell) => !(cell.type === "decorator" && cell.decorator === "text")
      );
    case "drop-decorator": {
      if (action.payload.decorator === "text") {
        return [...state, action.payload];
      }
      return insertCellAfter(
        state,
        action.payload,
        (cell) => cell.type === "decorator" && cell.decorator === "area"
      );
    }
    case "add-nodes": {
      const index =
        state.findLastIndex(
          (cell) => !(cell.type === "decorator" && cell.decorator === "text")
        ) + 1;
      return [
        ...state.slice(0, index),
        ...action.payload,
        ...state.slice(index),
      ];
    }
    case "add-edge":
      // Add the edge to just next to the previous last edge or area decorator.
      // If not found, append to the start.
      return insertCellAfter(
        state,
        action.payload,
        (cell) =>
          cell.type === "edge" ||
          (cell.type === "decorator" && cell.decorator === "area")
      );
    case "move-cells": {
      let matched = false;
      const newState = state.map((cell) => {
        const newCell = action.payload.find(
          (move) => cell.type === move.type && cell.id === move.id
        );
        if (newCell) {
          matched = true;
          return {
            ...cell,
            view: { ...(cell as NodeCell).view, x: newCell.x, y: newCell.y },
          };
        }
        return cell;
      });
      return matched ? newState : state;
    }
    case "resize-cell": {
      const { type, id, width, height } = action.payload;
      const index = state.findIndex(
        (cell) => cell.type === type && cell.id === id
      );
      if (index !== -1) {
        const node = state[index] as NodeCell;
        return [
          ...state.slice(0, index),
          { ...node, view: { ...node.view, width, height } },
          ...state.slice(index + 1),
        ];
      }
      return state;
    }
    case "update-cells":
      return action.payload;
    case "update-node-size":
      return state.map((cell) =>
        isNodeCell(cell) && cell.id === action.payload.id
          ? {
              ...cell,
              [SYMBOL_FOR_SIZE_INITIALIZED]: true,
              view: action.payload.size
                ? {
                    ...cell.view,
                    width: action.payload.size[0],
                    height: action.payload.size[1],
                  }
                : cell.view,
            }
          : cell
      );
  }
  return state;
};

function insertCellAfter(
  cells: Cell[],
  newCell: Cell,
  after: (cell: Cell) => boolean
) {
  const index = cells.findLastIndex(after) + 1;
  return [...cells.slice(0, index), newCell, ...cells.slice(index)];
}
