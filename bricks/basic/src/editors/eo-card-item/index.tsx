import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoCardItemSchema } from "./eoCardItem.schema";

function EoCardItemComponentFactory(React: typeof _React) {
  return function EoCardItemComponent(
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
        hasCover: false,
        hasHeader: false,
      });
    }, [form]);

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoCardItemSchema, advancedMode),
      scope,
    });
  };
}

customEditors.define("eo-card-item", EoCardItemComponentFactory);
