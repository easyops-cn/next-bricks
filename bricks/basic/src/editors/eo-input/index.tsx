import React, { createElement } from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { eoInputSchema } from "./eoInput.schema";

function EoInputComponent(props: EditorComponentProps): React.ReactElement {
  const { SchemaFieldComponent, formilySchemaFormatter, advancedMode } = props;

  return createElement(SchemaFieldComponent, {
    schema: formilySchemaFormatter(eoInputSchema, advancedMode),
  });
}

customEditors.define("eo-input-editor", EoInputComponent);
