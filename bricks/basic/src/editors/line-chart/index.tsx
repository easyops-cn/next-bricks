import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { lineChartSchema } from "./lineChart.schema";

function LineChartComponentFactory(React: typeof _React) {
  return function LineChartComponent(
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
      // todo
    }, [form]);

    return React.createElement(SchemaFieldComponent, {
      schema: formilySchemaFormatter(lineChartSchema as any, advancedMode!),
      scope,
    });
  };
}
// chart-v2.line-chart
customEditors.define("basic.line-chart", LineChartComponentFactory);
