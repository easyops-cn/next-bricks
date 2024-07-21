import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoGridLayoutSchema } from "./eoGridLayout.schema";

function EoGridLayoutComponentFactory(React: typeof _React) {
  return function EoGridLayoutComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      scope,
      form,
    } = props;

    React.useEffect(() => {
      form.setInitialValues({
        showGridBorder: false,
      });
    }, [form]);

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoGridLayoutSchema, advancedMode),
      scope,
    });
  };
}

customEditors.define("eo-grid-layout", EoGridLayoutComponentFactory);
