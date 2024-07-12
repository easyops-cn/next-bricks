import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoSearchSchema } from "./eoSearch.schema";

function EoSearchComponentFactory(React: typeof _React) {
  return function EoSearchComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      scope,
    } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoSearchSchema as any, advancedMode!),
      scope,
    });
  };
}

customEditors.define("eo-search", EoSearchComponentFactory);
