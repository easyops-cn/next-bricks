import type _React from "react";
import { customEditors } from "@next-core/runtime";
import type { EditorComponentProps } from "@next-shared/property-editor";
import { eoButtonSchema } from "./eoDescriptions.schema";
import { omit } from "lodash";

function EoButtonComponentFactory(React: typeof _React) {
  return function EoButtonComponent(
    props: EditorComponentProps
  ): React.ReactElement {
    const {
      SchemaFieldComponent,
      formilySchemaFormatter,
      scope,
      form,
      effects,
    } = props;
    const dataListRef = React.useRef<any>();

    React.useEffect(() => {
      const { onSubmit } = effects;

      form.addEffects("submit", () => {
        onSubmit((value: any) => {
          return omit(value, ["link"]);
        });
      });
    }, [effects, form]);

    React.useEffect(() => {
      // 初始化data
      const { dataList = [] } = scope;
      dataListRef.current = dataList?.map((item: any) => ({
        ...item,
        label: item?.name,
        value: item?.value,
      }));
      form.query("dataSource").take((field: any) => {
        field.setComponentProps({
          options: dataListRef.current,
        });
      });
    }, [scope]);

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(eoButtonSchema as any),
      scope,
    });
  };
}

customEditors.define("eo-descriptions", EoButtonComponentFactory);
