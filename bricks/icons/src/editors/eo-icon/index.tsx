import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { eoIconSchema } from "./eoIcon.schema";
import { pick } from "lodash";

function EoIconComponentFactory(React: typeof _React) {
  return function EoIconComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      scope,
      form,
      effects,
    } = props;

    React.useEffect(() => {
      const { onSubmit, onAdvancedChange } = effects;

      form.addEffects("submit", () => {
        onAdvancedChange((advancedMode: boolean, form: any) => {
          const rawValue = form.getState()?.values ?? {};
          if (advancedMode) {
            return {
              ...(rawValue?.icon ?? {}),
            };
          } else {
            return {
              icon: pick(rawValue["#advanced_form"], [
                "lib",
                "theme",
                "icon",
                "category",
                "prefix",
                "color",
              ]),
            };
          }
        });
        onSubmit((value: any) => {
          return {
            ...(value?.icon ?? {}),
            ...value,
          };
        });
      });
    }, [form, effects]);

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoIconSchema as any),
      scope,
    });
  };
}

customEditors.define("eo-icon", EoIconComponentFactory);
