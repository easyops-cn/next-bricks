import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { eoSpinSchema } from "./eoSpin.schema";

function EoSpinComponentFactory(React: typeof _React) {
  return function EoSpinComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const { SchemaFieldComponent, formilySchemaFormatter, advancedMode } =
      props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoSpinSchema, advancedMode!),
    });
  };
}

customEditors.define("eo-spin", EoSpinComponentFactory);
