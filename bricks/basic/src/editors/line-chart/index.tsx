import type _React from "react";
import { customEditors } from "@next-core/runtime";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { EditorComponentProps } from "@next-bricks/visual-builder/property-editor";
import { lineChartSchema } from "./lineChart.schema";
import { get, isNil, omit } from "lodash";
import yaml from "js-yaml";

const computeNilObject = (value: any, key: string) => {
  return isNil(value) ? {} : { [key]: value };
};

const transformNormal2Advanced = (rawValue: any) => {
  const res = {
    ...omit(rawValue, [
      "doubleYaxis",
      "leftYField",
      "legends",
      "position",
      "unit",
      "precision",
      "shape",
      "max",
      "min",
      "rightYFieldUnit",
      "rightYFieldPrecision",
      "rightYFieldShape",
      "rightYFieldMax",
      "rightYFieldMin",
      "timeType",
      "thresholds",
      "xRange",
      "marker",
      "interactions",
    ]),
    ...(rawValue.doubleYaxis
      ? {
          yField: rawValue.leftYField,
          rightYField: rawValue.rightYField,
        }
      : {
          yField: rawValue.yField,
        }),
    legends:
      rawValue.legends && rawValue.position
        ? {
            position: rawValue.position,
          }
        : rawValue.legends,
    ...(rawValue.unit ||
    !isNil(rawValue.precision) ||
    rawValue.shape ||
    !isNil(rawValue.max) ||
    !isNil(rawValue.min) ||
    rawValue.timeType
      ? {
          axis: {
            yAxis: {
              ...computeNilObject(rawValue.unit, "unit"),
              ...computeNilObject(rawValue.precision, "precision"),
              ...computeNilObject(rawValue.shape, "shape"),
              ...computeNilObject(rawValue.max, "max"),
              ...computeNilObject(rawValue.min, "min"),
            },
            ...(rawValue.doubleYaxis
              ? {
                  rightYAxis: {
                    ...computeNilObject(rawValue.rightYFieldUnit, "unit"),
                    ...computeNilObject(
                      rawValue.rightYFieldPrecision,
                      "precision"
                    ),
                    ...computeNilObject(rawValue.rightYFieldShape, "shape"),
                    ...computeNilObject(rawValue.rightYFieldMax, "max"),
                    ...computeNilObject(rawValue.rightYFieldMin, "min"),
                  },
                }
              : {}),
            ...(rawValue.timeType
              ? {
                  xAxis: {
                    type: "time",
                  },
                }
              : {}),
          },
        }
      : {}),
    ...(rawValue.thresholds
      ? {
          thresholds: yaml.safeLoad(rawValue.thresholds),
          usePublicThresholds: true,
        }
      : {}),
    ...(rawValue.xRange
      ? {
          xRange: yaml.safeLoad(rawValue.xRange),
        }
      : {}),
    ...(rawValue.marker
      ? {
          marker: yaml.safeLoad(rawValue.marker),
        }
      : {}),
    ...(rawValue.interactions
      ? {
          interactions: yaml.safeLoad(rawValue.interactions),
        }
      : {}),
  };
  return res;
};

const transformAdvanced2Normal = (rawValue: any) => {
  const doubleYaxis = !!get(rawValue, "rightYField");
  const res = {
    ...omit(rawValue, [
      "yField",
      "rightYField",
      "legends",
      "axis",
      "thresholds",
      "usePublicThresholds",
      "xRange",
      "marker",
      "interactions",
    ]),
    legends: !!rawValue.legends,
    position: get(rawValue, "legends.position"),
    doubleYaxis,
    ...(doubleYaxis
      ? {
          rightYField: null,
          rightYFieldMax: get(rawValue, "axis.rightYAxis.max"),
          rightYFieldMin: get(rawValue, "axis.rightYAxis.min"),
          rightYFieldPrecision: get(rawValue, "axis.rightYAxis.precision"),
          rightYFieldUnit: get(rawValue, "axis.rightYAxis.unit"),
          rightYFieldShape: get(rawValue, "axis.rightYAxis.shape"),
          leftYField: null,
        }
      : {}),
    max: get(rawValue, "axis.yAxis.max"),
    min: get(rawValue, "axis.yAxis.min"),
    shape: get(rawValue, "axis.yAxis.shape"),
    precision: get(rawValue, "axis.yAxis.precision"),
    unit: get(rawValue, "axis.yAxis.unit"),
    timeType: get(rawValue, "axis.xAxis.type") === "time",
    timeFormat: get(rawValue, "timeFormat"),
    // thresholds: yaml.safeDump(rawValue.thresholds),
    // xRange: yaml.safeDump(rawValue.xRange),
    // marker: yaml.safeDump(rawValue.marker),
    // interactions: yaml.safeDump(rawValue.interactions),
    thresholds: rawValue.thresholds,
    xRange: rawValue.xRange,
    marker: rawValue.marker,
    interactions: rawValue.interactions,
  };
  return res;
};

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
      effects,
    } = props;

    React.useEffect(() => {
      const { onFieldValueChange, onAdvancedChange, onSubmit } = effects;
      const { dataList } = scope;
      // 表单初始化
      form.setInitialValues({
        doubleYaxis: false,
        legends: true,
        timeType: false,
      });

      // 初始化data
      form.query("data").take((field: any) => {
        field.setComponentProps({
          options: dataList.map((item: any) => ({
            label: item?.name,
            value: item?.value,
          })),
        });
      });

      // 当data变化时
      form.addEffects("dataChange", () => {
        onFieldValueChange("data", (field: any) => {
          // 清除关联值
          form.deleteValuesIn("xField");
          form.deleteValuesIn("doubleYaxis");
          form.deleteValuesIn("leftYField");
          form.deleteValuesIn("rightYField");
          form.deleteValuesIn("yField");
          form.deleteValuesIn("groupField");

          // 修改关联值的options
          const { value } = field;
          const matchData = dataList.find((item: any) => item?.value === value);
          const matchDefinitionOptions = matchData?.definition?.map(
            (item: any) => ({ label: item?.name, value: item?.value })
          );
          form.query("xField").take((field: any) => {
            field.setComponentProps({
              options: matchDefinitionOptions,
            });
          });
          form.query("leftYField").take((field: any) => {
            field.setComponentProps({
              options: matchDefinitionOptions,
            });
          });
          form.query("rightYField").take((field: any) => {
            field.setComponentProps({
              options: matchDefinitionOptions,
            });
          });
          form.query("yField").take((field: any) => {
            field.setComponentProps({
              options: matchDefinitionOptions,
            });
          });
          form.query("groupField").take((field: any) => {
            field.setComponentProps({
              options: matchDefinitionOptions,
            });
          });
        });
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
      schema: formilySchemaFormatter(lineChartSchema as any, advancedMode!),
      scope,
    });
  };
}
// chart-v2.line-chart
customEditors.define("basic.line-chart", LineChartComponentFactory);
