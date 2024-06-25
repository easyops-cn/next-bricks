import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { generalRadioSchema } from "./generalRadio.schema";

function GeneralRadioComponentFactory(React: typeof _React) {
  return function GeneralRadioComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      scope,
    } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(generalRadioSchema as any, advancedMode!),
      scope,
    });
  };
}

// forms.general-radio
customEditors.define("basic.general-radio", GeneralRadioComponentFactory);
