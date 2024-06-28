import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { eoInputSchema } from "./eoInput.schema";

function EoInputComponentFactory(React: typeof _React) {
  return function EoInputComponent(
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
        type: "text",
        required: false,
        pattern: "",
      });
    }, [form]);

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoInputSchema as any, advancedMode!),
      scope,
    });
  };
}

customEditors.define("eo-input", EoInputComponentFactory);
