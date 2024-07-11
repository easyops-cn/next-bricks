import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { eoMiniActionsSchema } from "./eoMiniActions.schema";

function EoMiniActionsComponentFactory(React: typeof _React) {
  return function EoMiniActionComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const { SchemaFieldComponent, formilySchemaFormatter, scope } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoMiniActionsSchema as any),
      scope,
    });
  };
}

customEditors.define("eo-mini-actions", EoMiniActionsComponentFactory);
