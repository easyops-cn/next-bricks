import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoSwitchSchema } from "./eoSwitch.schema";

function EoSwitchComponentFactory(React: typeof _React) {
  return function EoSwitchComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      scope,
    } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoSwitchSchema as any, advancedMode!),
      scope,
    });
  };
}

customEditors.define("eo-switch", EoSwitchComponentFactory);
