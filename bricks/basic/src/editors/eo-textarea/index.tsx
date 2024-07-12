import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoTextareaSchema } from "./eoTextarea.schema";

function EoTextareaComponentFactory(React: typeof _React) {
  return function EoTextareaComponent(
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
        required: false,
        pattern: "",
        autoSize: false,
      });
    }, [form]);

    React.useEffect(() => {
      const { onSubmit } = effects;
      form.addEffects("formEffect", () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onSubmit((value) => {
          if (value.minRows || value.maxRows) {
            const { minRows, maxRows, ...newValue } = value;
            return { ...newValue, autoSize: { minRows, maxRows } };
          }
          if (!value.minRows && !value.maxRows) {
            const { autoSize, ...newValue } = value;
            return { ...newValue, autoSize };
          }
          return { ...value };
        });
      });
    }, []);

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoTextareaSchema as any, advancedMode!),
      scope,
    });
  };
}

customEditors.define("eo-textarea", EoTextareaComponentFactory);
