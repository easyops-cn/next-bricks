import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
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
