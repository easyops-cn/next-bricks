import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FormItem, IFormItemProps } from "@formily/antd-v5";
import { wrapBrick } from "@next-core/react-element";
import { GeneralIcon, GeneralIconProps } from "@next-bricks/icons/general-icon";
import {
  useExpressionScope,
  useField,
  useFieldSchema,
  useForm,
  useFormEffects,
} from "@formily/react";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { EoTooltip, ToolTipProps } from "@next-bricks/basic/src/tooltip";
import classNames from "classnames";
import { isObject } from "lodash";
import { onFieldInitialValueChange } from "@formily/core";
import { isEvaluable } from "@next-core/cook";
import yaml from "js-yaml";

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedToolTip = wrapBrick<EoTooltip, ToolTipProps>("eo-tooltip");

type Mode = "normal" | "advanced";

interface AdvancedFormItemProps extends IFormItemProps {
  children: React.ReactElement;
  formEffect?: () => void;
}

export function AdvancedFormItem(props: AdvancedFormItemProps) {
  const form = useForm();
  const field = useField();
  const schema = useFieldSchema();
  const scope = useExpressionScope();
  const [mode, setMode] = useState<Mode>(
    (field.component as any)?.[0] === "CodeEditor" ? "advanced" : "normal"
  );
  const isAdvanced = useMemo(() => mode === "advanced", [mode]);
  const fieldOriginComponentRef = useRef<any>([]);

  const handleModeCheck = useCallback(() => {
    const fieldOriginComponent = fieldOriginComponentRef.current;
    const updateMode = isAdvanced ? "normal" : "advanced";
    const isAdvancedMode = updateMode === "advanced";
    setMode(updateMode);
    field.setComponent(
      isAdvancedMode ? "CodeEditor" : fieldOriginComponent[0],
      {
        ...(isAdvancedMode
          ? { ...(scope ?? {}), lineNumbers: "off", glyphMargin: false }
          : fieldOriginComponent[1]),
      }
    );

    const value = form.getValuesIn(field.props.name);
    if (isAdvancedMode && isObject(value)) {
      form.setInitialValues({
        [field.props.name as string]: yaml.safeDump(value),
      });
    } else if (!isAdvancedMode && value && typeof value === "string") {
      let newValue: any;
      try {
        newValue = yaml.load(value);
      } catch {
        newValue = null;
      }
      form.setInitialValues(
        {
          [field.props.name as string]: newValue,
        },
        "overwrite"
      );
    }
  }, [form, field, isAdvanced, scope]);

  useFormEffects(() => {
    onFieldInitialValueChange(field.props.name, ({ value }) => {
      if (typeof value === "string" && isEvaluable(value)) {
        setMode("advanced");

        field.setComponent("CodeEditor", {
          ...(scope ?? {}),
          lineNumbers: "off",
          glyphMargin: false,
        });
      }
    });
  });

  useEffect(() => {
    fieldOriginComponentRef.current = [
      schema["x-component"],
      schema["x-component-props"],
    ];
  }, [schema]);

  return (
    <div className="advanced-form-item">
      <FormItem
        {...{
          ...props,
          layout: isAdvanced ? null : props.layout || "vertical",
        }}
      >
        {props.children}
      </FormItem>
      <div className="advanced-mode-check-wrapper">
        <WrappedToolTip
          content={mode === "normal" ? "使用表达式" : "关闭表达式"}
        >
          <WrappedIcon
            className={classNames({
              isActive: isAdvanced,
            })}
            lib="fa"
            icon="code"
            onClick={handleModeCheck}
          />
        </WrappedToolTip>
      </div>
    </div>
  );
}
