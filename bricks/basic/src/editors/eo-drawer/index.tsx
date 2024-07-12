import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoDrawerSchema } from "./eoDrawer.schema";

function EoDrawerComponentFactory(React: typeof _React) {
  return function EoDrawerComponent(
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
        mask: true,
        placement: "right",
      });
    }, [form]);

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoDrawerSchema as any, advancedMode!),
      scope,
    });
  };
}

customEditors.define("eo-drawer", EoDrawerComponentFactory);
