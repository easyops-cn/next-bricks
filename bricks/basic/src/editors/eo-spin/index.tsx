import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoSpinSchema } from "./eoSpin.schema";

function EoSpinComponentFactory(React: typeof _React) {
  return function EoSpinComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      scope,
    } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoSpinSchema, advancedMode!),
      scope,
    });
  };
}

customEditors.define("eo-spin", EoSpinComponentFactory);
