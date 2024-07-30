import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoAlertSchema } from "./eoAlert.schema";

function EoAlertComponentFactory(React: typeof _React) {
  return function EoAlertComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      scope,
    } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoAlertSchema, advancedMode),
      scope,
    });
  };
}

customEditors.define("eo-alert", EoAlertComponentFactory);
