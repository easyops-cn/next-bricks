import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoRadioSchema } from "./eoRadio.schema";

function EoRadioComponentFactory(React: typeof _React) {
  return function EoRadioComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      scope,
      form,
    } = props;

    React.useEffect(() => {
      form.setInitialValues({
        required: false,
      });
    }, [form]);

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoRadioSchema as any, advancedMode!),
      scope,
    });
  };
}

customEditors.define("eo-radio", EoRadioComponentFactory);
