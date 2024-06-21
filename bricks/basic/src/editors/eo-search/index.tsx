import React, { createElement } from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { eoSearchSchema } from "./eoSearch.schema";

function EoSearchComponent(props: EditorComponentProps): React.ReactElement {
  const { SchemaFieldComponent, formilySchemaFormatter, advancedMode, scope } =
    props;

  return createElement(SchemaFieldComponent, {
    schema: formilySchemaFormatter(eoSearchSchema as any, advancedMode!),
    scope,
  });
}

customEditors.define("eo-search-editor", EoSearchComponent);
