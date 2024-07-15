import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoSearchBarSchema } from "./eoSearchBar.schema";

function EoSearchBarComponentFactory(React: typeof _React) {
  return function EoSearchBarComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      scope,
    } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoSearchBarSchema, advancedMode!),
      scope,
    });
  };
}
customEditors.define("eo-search-bar", EoSearchBarComponentFactory);
