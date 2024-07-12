import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoPopoverSchema } from "./eoPopover.schema";

function EoPopoverComponentFactory(React: typeof _React) {
  return function EoPopoverComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      scope,
    } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoPopoverSchema as any, advancedMode!),
      scope,
    });
  };
}

customEditors.define("eo-popover", EoPopoverComponentFactory);
