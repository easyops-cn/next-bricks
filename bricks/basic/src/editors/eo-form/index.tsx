import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoFormSchema } from "./eoForm.schema";

function EoFormComponentFactory(React: typeof _React) {
  return function EoFormComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      scope,
    } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoFormSchema as any, advancedMode!),
      scope,
    });
  };
}

customEditors.define("eo-form", EoFormComponentFactory);
