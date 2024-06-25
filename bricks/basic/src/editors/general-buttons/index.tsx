import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { generalButtonsSchema } from "./generalButtons.schema";

function GeneralButtonsComponentFactory(React: typeof _React) {
  return function GeneralButtonsComponent(
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
        generalButtonsSchema as any,
        advancedMode!
      ),
      scope,
    });
  };
}

// forms.general-buttons
customEditors.define("basic.general-buttons", GeneralButtonsComponentFactory);
