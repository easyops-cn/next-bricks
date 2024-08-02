import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { EoTimePickerSchema } from "./eoTimePicker.schema";

function EoTimePickerComponentFactory(React: typeof _React) {
  return function EoTimePickerComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const { SchemaFieldComponent, formilySchemaFormatter, scope } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(EoTimePickerSchema as any),
      scope,
    });
  };
}

customEditors.define("eo-time-picker", EoTimePickerComponentFactory);
