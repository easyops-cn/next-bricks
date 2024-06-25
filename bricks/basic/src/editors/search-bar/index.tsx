import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { searchBarSchema } from "./searchBar.schema";

function SearchBarComponentFactory(React: typeof _React) {
  return function SearchBarComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      scope,
    } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(searchBarSchema as any, advancedMode!),
      scope,
    });
  };
}
// container-brick.search-bar
customEditors.define("basic.search-bar", SearchBarComponentFactory);
