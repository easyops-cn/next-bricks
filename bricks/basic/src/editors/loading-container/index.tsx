import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { loadingContainerSchema } from "./loadingContainer.schema";

function LoadingContainerComponentFactory(React: typeof _React) {
  return function LoadingContainerComponent(
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
        loadingContainerSchema as any,
        advancedMode!
      ),
      scope,
    });
  };
}

// container-brick.loading-container
customEditors.define(
  "basic.loading-container",
  LoadingContainerComponentFactory
);
