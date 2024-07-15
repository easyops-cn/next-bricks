import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoDividerSchema } from "./eoDivider.schema";

function EoDividerComponentFactory(React: typeof _React) {
  return function EoDividerComponent(
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
        type: "horizontal",
      });
    }, [form]);

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoDividerSchema as any, advancedMode!),
      scope,
    });
  };
}

customEditors.define("eo-divider", EoDividerComponentFactory);
