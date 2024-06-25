import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { popoverContainerSchema } from "./popoverContainer.schema";

function PopoverContainerComponentFactory(React: typeof _React) {
  return function PopoverContainerComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      scope,
    } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(
        popoverContainerSchema as any,
        advancedMode!
      ),
      scope,
    });
  };
}
// basic-bricks.popover-container
customEditors.define(
  "basic.popover-container",
  PopoverContainerComponentFactory
);
