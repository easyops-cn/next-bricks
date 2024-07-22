import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoEasyViewSchema } from "./eoEasyView.schema";

function EoEasyViewComponentFactory(React: typeof _React) {
  return function EoEasyViewComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      scope,
    } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoEasyViewSchema, advancedMode),
      scope,
    });
  };
}

customEditors.define("eo-easy-view", EoEasyViewComponentFactory);
