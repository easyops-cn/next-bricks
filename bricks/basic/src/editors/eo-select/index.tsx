import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoSelectSchema } from "./eoSelect.schema";

function EoSelectComponentFactory(React: typeof _React) {
  return function EoSelectComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      scope,
      form,
      effects,
    } = props;

    React.useEffect(() => {
      form.setInitialValues({
        mode: "",
        required: false,
      });
    }, [form]);

    React.useEffect(() => {
      const { onSubmit } = effects;
      form.addEffects("formEffect", () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onSubmit((value) => {
          if (value.fieldLabel || value.fieldValue) {
            const { fieldLabel, fieldValue, ...newValue } = value;
            return {
              ...newValue,
              fields: { label: fieldLabel, value: fieldValue },
            };
          }
          return { ...value };
        });
      });
    }, []);

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoSelectSchema as any, advancedMode!),
      scope,
    });
  };
}

customEditors.define("eo-select", EoSelectComponentFactory);
