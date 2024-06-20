import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { eoTagSchema } from "./eoTag.schema";

function EoSpinComponentFactory(React: typeof _React) {
  return function EoTagComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const { SchemaFieldComponent, formilySchemaFormatter, advancedMode, form } =
      props;

    React.useEffect(() => {
      form.setInitialValues({ checkable: false });
    }, [form]);

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoTagSchema, advancedMode),
    });
  };
}
customEditors.define("eo-tag", EoSpinComponentFactory);
