import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoFlexLayoutSchema } from "./eoFlexLayout.schema";
import { get, omit } from "lodash";

const transformNormal2Advanced = (rawValue: any) => {
  const res = {
    ...omit(rawValue, ["flexWrap"]),
    ...(rawValue.flexWrap
      ? {
          flexWrap: "wrap",
        }
      : {
          flexWrap: "nowrap",
        }),
  };
  return res;
};

const transformAdvanced2Normal = (rawValue: any) => {
  const isNoWrap =
    !get(rawValue, "flexWrap") || get(rawValue, "flexWrap") === "nowrap";
  const res = {
    ...omit(rawValue, ["flexWrap"]),
    ...(isNoWrap
      ? {
          flexWrap: false,
        }
      : {
          flexWrap: true,
        }),
  };
  return res;
};

function EoFlexLayoutComponentFactory(React: typeof _React) {
  return function EoFlexLayoutComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      advancedMode,
      scope,
      effects,
      form,
    } = props;

    React.useEffect(() => {
      const { onAdvancedChange, onSubmit } = effects;

      form.setInitialValues({
        flexWrap: false,
      });

      // 监听模式切换
      form.addEffects("onAdvancedChange", () => {
        onAdvancedChange((advancedMode: boolean, form: any) => {
          const rawValue = form.getState()?.values ?? {};
          return advancedMode
            ? transformNormal2Advanced(rawValue)
            : transformAdvanced2Normal(rawValue);
        });
      });

      // 监听表单提交
      form.addEffects("onSubmit", () => {
        onSubmit((value: any) => {
          return transformNormal2Advanced(value);
        });
      });
    }, [form]);

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoFlexLayoutSchema, advancedMode),
      scope,
    });
  };
}

customEditors.define("eo-flex-layout", EoFlexLayoutComponentFactory);
