import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoTabListSchema } from "./eoTabList.schema";

function EoTabListComponentFactory(React: typeof _React) {
  return function EoTabListComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      scope,
    } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoTabListSchema as any, advancedMode!),
      scope,
    });
  };
}

customEditors.define("eo-tab-list", EoTabListComponentFactory);
