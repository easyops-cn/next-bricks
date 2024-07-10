import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { eoLinkSchema } from "./eoLink.schema";
import { omit } from "lodash";

function EoLinkComponentFactory(React: typeof _React) {
  return function EoLinkComponent(
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
      const { onSubmit } = effects;

      form.addEffects("submit", () => {
        onSubmit((value: any) => {
          return omit(value, ["link"]);
        });
      });
    }, [effects, form]);

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoLinkSchema as any),
      scope,
    });
  };
}

customEditors.define("eo-link", EoLinkComponentFactory);
