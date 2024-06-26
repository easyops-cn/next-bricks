import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { generalDrawerSchema } from "./generalDrawer.schema";

function GeneralDrawerComponentFactory(React: typeof _React) {
  return function GeneralDrawerComponent(
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
      });
    }, [form]);

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(generalDrawerSchema as any, advancedMode!),
      scope,
    });
  };
}
// basic-bricks.general-drawer
customEditors.define("basic.general-drawer", GeneralDrawerComponentFactory);
