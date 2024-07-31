import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { tplPageLayoutSchema } from "./tplPageLayout.schema";

function TplPageLayoutComponentFactory(React: typeof _React) {
  return function TplPageLayoutComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const { SchemaFieldComponent, formilySchemaFormatter, scope } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(tplPageLayoutSchema as any),
      scope,
    });
  };
}

customEditors.define(
  "base-layout-v3.tpl-page-layout",
  TplPageLayoutComponentFactory
);
