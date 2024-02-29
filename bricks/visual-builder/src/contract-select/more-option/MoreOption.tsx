import React, { useState } from "react";
import { K, NS, locales } from "../i18n.js";
import { initializeReactI18n, useTranslation } from "@next-core/i18n/react";
import { wrapBrick } from "@next-core/react-element";
import { GeneralIcon, GeneralIconProps } from "@next-bricks/icons/general-icon";
import {
  Input,
  InputEvents,
  InputEventsMap,
  InputProps,
} from "@next-bricks/form/input";

initializeReactI18n(NS, locales);
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedInput = wrapBrick<Input, InputProps, InputEvents, InputEventsMap>(
  "eo-input",
  {
    onChange: "change",
  }
);

export interface MoreOptionProps {
  slot?: string;
  itemsCount?: number;
  onBlur?(itemsCount: number): void;
}

export function MoreOption(props: MoreOptionProps): React.ReactElement {
  const { itemsCount = 20, onBlur } = props;
  const [count, setCount] = useState(itemsCount);
  const { t } = useTranslation(NS);
  const [edit, setEdit] = useState(false);

  const handleChange = (e: CustomEvent<string>): void => {
    setCount(Number(e.detail));
  };

  const handleClick = (): void => {
    setEdit(true);
  };

  const handleBlur = (): void => {
    setEdit(false);
    onBlur?.(count);
  };

  return (
    <div className="options-tips" slot={props.slot}>
      {t(K.CONTRACT_OPTIONS_TIPS_PREFIX)}{" "}
      {edit ? (
        <WrappedInput
          autoFocus={true}
          inputStyle={{ width: 65 }}
          value={String(count)}
          onBlur={handleBlur}
          onChange={handleChange as any}
        />
      ) : (
        <span>
          {count} <WrappedIcon icon="edit" lib="antd" onClick={handleClick} />
        </span>
      )}{" "}
      {t(K.CONTRACT_OPTIONS_TIPS_SUFFIX)}
    </div>
  );
}
