import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoTagSchema } from "./eoTag.schema";

function EoSpinComponentFactory(React: typeof _React) {
  return function EoTagComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      form,
      scope,
    } = props;

    React.useEffect(() => {
      form.setInitialValues({ checkable: false });
    }, [form]);

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoTagSchema, advancedMode),
      scope,
    });
  };
}
customEditors.define("eo-tag", EoSpinComponentFactory);
