import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { brickGeneralSearchSchema } from "./brickGeneralSearch.schema";

function BrickGeneralSearchComponentFactory(React: typeof _React) {
  return function BrickGeneralSearchComponent(
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
      form.setInitialValues({ searchTypeEnabled: false });
    }, [form]);

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(
        brickGeneralSearchSchema as any,
        advancedMode!
      ),
      scope,
    });
  };
}
// presentational-bricks.brick-general-search
customEditors.define(
  "basic.brick-general-search",
  BrickGeneralSearchComponentFactory
);
