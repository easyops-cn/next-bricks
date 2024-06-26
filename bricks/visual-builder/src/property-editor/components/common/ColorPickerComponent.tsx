import React, { useEffect, useState } from "react";
import { ColorPicker } from "antd";
import { ColorPickerProps } from "antd/lib/color-picker";
import {
  presets,
  transformCssVariablesToColor,
  trasnformColorToCssVariables,
} from "../../utils/colorTransform";
interface ColorPickerComponentProps extends Omit<ColorPickerProps, "onChange"> {
  onChange?: (value: string) => void;
}

export function ColorPickerComponent(
  props: ColorPickerComponentProps
): React.ReactElement {
  const [value, setValue] = useState<string>();

  const handleChange = (color: string) => {
    props.onChange?.(trasnformColorToCssVariables(presets, color));
  };

  useEffect(() => {
    if (props.value) {
      const value = transformCssVariablesToColor(
        presets,
        props.value as string
      );
      setValue(value);
    }
  }, [props.value]);

  return (
    <ColorPicker
      showText={true}
      presets={presets}
      {...props}
      value={value}
      onChange={(_, hex) => {
        handleChange(hex);
      }}
    />
  );
}
