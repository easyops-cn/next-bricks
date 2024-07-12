import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoTextSchema } from "./eoText.schema";

function EoTextComponentFactory(React: typeof _React) {
  return function EoTextComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      scope,
    } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoTextSchema, advancedMode),
      scope,
    });
  };
}

customEditors.define("eo-text", EoTextComponentFactory);
