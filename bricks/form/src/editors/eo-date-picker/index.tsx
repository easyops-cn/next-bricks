import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoDatePickerSchema } from "./eoDatePicker.schema";

function EoDatePickerComponentFactory(React: typeof _React) {
  return function EoDatePickerComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const { SchemaFieldComponent, formilySchemaFormatter, scope } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoDatePickerSchema as any),
      scope,
    });
  };
}

customEditors.define("eo-date-picker", EoDatePickerComponentFactory);
