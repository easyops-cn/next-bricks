import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { tplPageModuleSchema } from "./tplPageModule.schema";

function TplBasePageModuleComponentFactory(React: typeof _React) {
  return function TplBasePageModuleComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const { SchemaFieldComponent, formilySchemaFormatter, scope } = props;

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(tplPageModuleSchema as any),
      scope,
    });
  };
}

customEditors.define(
  "base-layout.tpl-base-page-module",
  TplBasePageModuleComponentFactory
);
