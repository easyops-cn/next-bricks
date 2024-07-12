import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoSubmitButtonsSchema } from "./eoSubmitButton.schema";

function EoSubmitButtonsComponentFactory(React: typeof _React) {
  return function EoSubmitButtonsComponent(
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
      const { onSubmit } = effects;
      form.addEffects("formEffect", () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        onSubmit((value) => {
          if (!value.submitText) {
            return { ...value, submitText: "提交" };
          }
          return { ...value };
        });
      });
    }, []);

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(
        eoSubmitButtonsSchema as any,
        advancedMode!
      ),
      scope,
    });
  };
}

customEditors.define("eo-submit-buttons", EoSubmitButtonsComponentFactory);
