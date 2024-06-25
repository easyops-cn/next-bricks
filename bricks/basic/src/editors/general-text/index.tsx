import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { generalTextSchema } from "./generalText.schema";

function GeneralTextComponentFactory(React: typeof _React) {
  return function GeneralTextComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      scope,
    } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(generalTextSchema as any, advancedMode!),
      scope,
    });
  };
}

// basic-bricks.general-text
customEditors.define("basic.general-text", GeneralTextComponentFactory);
