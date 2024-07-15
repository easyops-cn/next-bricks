import React from "react";
import type { BasicDecoratorProps } from "../interfaces";
import { DecoratorArea } from "./DecoratorArea";
import { DecoratorText } from "./DecoratorText";
import { DecoratorContainer } from "./DecoratorContainer";

export function DecoratorComponent({
  cell,
  view,
  transform,
  readOnly,
  layout,
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
    case "container":
      SpecifiedComponent = DecoratorContainer;
      break;
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
      view={view}
      transform={transform}
      readOnly={readOnly}
      layout={layout}
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
