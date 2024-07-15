import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoModalSchema } from "./eoModal.schema";

function EoModalComponentFactory(React: typeof _React) {
  return function EoModalComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      scope,
    } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoModalSchema as any, advancedMode!),
      scope,
    });
  };
}

customEditors.define("eo-modal", EoModalComponentFactory);
