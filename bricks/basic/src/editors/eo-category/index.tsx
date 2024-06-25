import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { eoCategorySchema } from "./eoCategory.schema";

function EoCategoryComponentFactory(React: typeof _React) {
  return function EoCategoryComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      scope,
    } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoCategorySchema as any, advancedMode!),
      scope,
    });
  };
}

customEditors.define("eo-category", EoCategoryComponentFactory);
