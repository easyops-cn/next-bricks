import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { categoryContainerSchema } from "./categoryContainer.schema";

function CategoryContainerComponentFactory(React: typeof _React) {
  return function CategoryContainerComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      scope,
    } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(
        categoryContainerSchema as any,
        advancedMode!
      ),
      scope,
    });
  };
}

// container-brick.category-container
customEditors.define(
  "basic.category-container",
  CategoryContainerComponentFactory
);
