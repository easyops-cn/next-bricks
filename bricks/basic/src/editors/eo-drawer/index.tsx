import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
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
