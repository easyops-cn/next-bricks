import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { eoRadioSchema } from "./eoRadio.schema";

function EoRadioComponentFactory(React: typeof _React) {
  return function EoRadioComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      scope,
    } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoRadioSchema as any, advancedMode!),
      scope,
    });
  };
}

customEditors.define("eo-radio", EoRadioComponentFactory);
