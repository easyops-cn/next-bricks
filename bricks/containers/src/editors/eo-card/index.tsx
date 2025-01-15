import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoCardSchema } from "./eoCard.schema";

function EoCardComponentFactory(React: typeof _React) {
  return function EoCardComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const { SchemaFieldComponent, formilySchemaFormatter, scope } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoCardSchema as any),
      scope,
    });
  };
}

customEditors.define("eo-card", EoCardComponentFactory);
