import React, { createElement } from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { eoCheckboxSchema } from "./eoCheckbox.schema";

function EoButtonComponent(props: EditorComponentProps): React.ReactElement {
  const { SchemaFieldComponent, formilySchemaFormatter, advancedMode } = props;

  return createElement(SchemaFieldComponent, {
    schema: formilySchemaFormatter(eoCheckboxSchema, advancedMode),
  });
}

customEditors.define("eo-checkbox-editor", EoButtonComponent);
