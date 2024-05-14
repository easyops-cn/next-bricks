import React from "react";
import type { BasicDecoratorProps } from "../interfaces";
import { DecoratorArea } from "./DecoratorArea";
import { DecoratorText } from "./DecoratorText";

export function DecoratorComponent({
  cell,
  transform,
  readOnly,
  activeTarget,
  cells,
  onCellResizing,
  onCellResized,
  onSwitchActiveTarget,
  onDecoratorTextEditing,
  onDecoratorTextChange,
}: BasicDecoratorProps): JSX.Element | null {
  let SpecifiedComponent: (props: BasicDecoratorProps) => JSX.Element | null;

  switch (cell.decorator) {
    case "area":
      SpecifiedComponent = DecoratorArea;
      break;
    case "text":
      SpecifiedComponent = DecoratorText;
      break;
    // istanbul ignore next
    default:
      // eslint-disable-next-line no-console
      console.error(`Unknown decorator: ${cell.decorator}`);
      return null;
  }

  return (
    <SpecifiedComponent
      cell={cell}
      transform={transform}
      readOnly={readOnly}
      activeTarget={activeTarget}
      cells={cells}
      onCellResizing={onCellResizing}
      onCellResized={onCellResized}
      onSwitchActiveTarget={onSwitchActiveTarget}
      onDecoratorTextEditing={onDecoratorTextEditing}
      onDecoratorTextChange={onDecoratorTextChange}
    />
  );
}
