import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { brickTagSchema } from "./brickTag.schema";

function BrickTagComponentFactory(React: typeof _React) {
  return function BrickTagComponent(
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
        componentType: "Tag",
        multipleCheck: true,
        closable: false,
      });
    }, [form]);

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(brickTagSchema as any, advancedMode!),
      scope,
    });
  };
}
// presentational-bricks.brick-tag
customEditors.define("basic.brick-tag", BrickTagComponentFactory);
