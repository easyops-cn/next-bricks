import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoCheckboxSchema } from "./eoCheckbox.schema";

function EoButtonComponentFactory(React: typeof _React) {
  return function EoButtonComponent(
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
        required: false,
        isGroup: false,
      });
    }, [form]);

    // TODO codeEditor模式的
    // React.useEffect(() => {
    //   const { onSubmit } = effects;
    //   form.addEffects("formEffect", () => {
    //     onSubmit((value, form) => {
    //       const transformValue = yaml.load(value.options);

    //       return transformValue;
    //     })
    //   })
    // }, [])

    // React.useEffect(() => {
    //   form.setInitialValues({
    //     options: `# - label: 开发\n#   value: dev\n# - label: 测\n#   value: test\n# - label: 预发布\n#   value: uat\n`
    //   })
    // }, [])

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoCheckboxSchema as any, advancedMode!),
      scope,
    });
  };
}

customEditors.define("eo-checkbox", EoButtonComponentFactory);
