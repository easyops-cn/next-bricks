import React, { useCallback, useEffect, useState } from "react";
import { Input } from "@formily/antd-v5";
import { InputProps } from "antd";

type InputWithUnitComponentProps = InputProps & {
  onChange: (value: string) => void;
};

export function InputWithUnitComponent(props: InputWithUnitComponentProps) {
  const [transformValue, setTransfromValue] = useState<string>();
  const handleChange = useCallback(
    (value: string) => {
      props.onChange(value ? `${value}${props.suffix as string}` : undefined);
    },
    [props]
  );

  useEffect(() => {
    const realValue = ((props.value as string) ?? "").replace(
      props.suffix as string,
      ""
    );
    setTransfromValue(realValue);
  }, [props.suffix, props.value]);

  return (
    <Input
      {...props}
      value={transformValue}
      onChange={(e) => handleChange(e.target.value)}
    />
  );
}
