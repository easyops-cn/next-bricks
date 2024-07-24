import React, { useEffect, useMemo, useState } from "react";
import { ColorPicker } from "antd";
import { ColorPickerProps } from "antd/lib/color-picker";
import {
  palettePresets,
  systemPresetColorsMap,
  transformCssVariablesToColor,
  trasnformColorToCssVariables,
  allPresets,
} from "../../utils/colorTransform";
interface ColorPickerComponentProps extends Omit<ColorPickerProps, "onChange"> {
  onChange?: (value: string) => void;
}

export function ColorPickerComponent(
  props: ColorPickerComponentProps
): React.ReactElement {
  const [value, setValue] = useState<string>();
  const transformPresets = useMemo(() => allPresets, []);

  const handleChange = (color: string) => {
    props.onChange?.(
      trasnformColorToCssVariables(palettePresets, systemPresetColorsMap, color)
    ); // 转成颜色变量存储
  };

  useEffect(() => {
    if (props.value) {
      const value = transformCssVariablesToColor(
        palettePresets,
        systemPresetColorsMap,
        props.value as string
      );
      setValue(value);
    } else {
      setValue((props.value as string) ?? "");
    }
  }, [props.value]);

  return (
    <ColorPicker
      getPopupContainer={() => document.body}
      showText={(color) =>
        trasnformColorToCssVariables(
          palettePresets,
          systemPresetColorsMap,
          color.toHexString()
        )
      } // 转成颜色变量展示
      presets={transformPresets}
      {...props}
      value={value}
      onChange={(_, hex) => {
        handleChange(hex);
      }}
    />
  );
}
