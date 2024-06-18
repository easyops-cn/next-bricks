import React, { createElement } from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { eoButtonSchema } from "./eoButton.schema";

function EoButtonComponent(props: EditorComponentProps): React.ReactElement {
  const { SchemaFieldComponent, formilySchemaFormatter, advancedMode, scope } =
    props;

  return createElement(SchemaFieldComponent, {
    schema: formilySchemaFormatter(eoButtonSchema as any, advancedMode!),
    scope,
  });
}

customEditors.define("eo-button-editor", EoButtonComponent);