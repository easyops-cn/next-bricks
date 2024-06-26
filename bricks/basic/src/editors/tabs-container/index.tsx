import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { tabsContainerSchema } from "./tabsContainer.schema";

function TabsContainerComponentFactory(React: typeof _React) {
  return function TabsContainerComponent(
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
        type: "normal",
      });
    }, [form]);

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(tabsContainerSchema as any, advancedMode!),
      scope,
    });
  };
}
// container-brick.tabs-container
customEditors.define("basic.tabs-container", TabsContainerComponentFactory);
