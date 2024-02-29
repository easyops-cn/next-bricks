import React, { useEffect, useMemo, useState } from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { wrapBrick } from "@next-core/react-element";
import { ReactUseMultipleBricks } from "@next-core/react-runtime";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import type {
  AutoComplete,
  AutoCompleteProps,
  AutoCompleteEvents,
  AutoCompleteEventsMap,
} from "@next-bricks/form/auto-complete";
import { debounce, isNil } from "lodash";
import { FormItemElementBase } from "@next-shared/form";
import { useContractList } from "./useContractList.js";
import { FormItem, FormItemProps } from "@next-bricks/form/form-item";
import { K, NS, locales } from "./i18n.js";
import { initializeReactI18n } from "@next-core/i18n/react";
import { i18n } from "@next-core/i18n";
import { MoreOption } from "./more-option/MoreOption";
import { UseSingleBrickConf } from "@next-core/types";

initializeReactI18n(NS, locales);

const { defineElement, property, event } = createDecorators();

const WrappedFormItem = wrapBrick<FormItem, FormItemProps>("eo-form-item");

const WrappedAutoComplete = wrapBrick<
  AutoComplete,
  AutoCompleteProps,
  AutoCompleteEvents,
  AutoCompleteEventsMap
>("eo-auto-complete", {
  onChange: "change",
});

/**
 * 契约选择构件
 */
export
@defineElement("visual-builder.contract-select", {
  styleTexts: [styleText],
})
class EoContractSelect extends FormItemElementBase {
  @property()
  accessor name: string | undefined;

  @property({
    type: Boolean,
  })
  accessor required: boolean | undefined;

  @property()
  accessor label: string | undefined;

  @property({
    attribute: false,
  })
  accessor value: any | undefined;

  @property({
    attribute: false,
  })
  accessor suffix:
    | { useBrick: UseSingleBrickConf | UseSingleBrickConf[] }
    | undefined;

  @event({ type: "change" })
  accessor #changeEvent: EventEmitter<string>;

  handleChange = (v: string) => {
    this.#changeEvent.emit(v);
  };

  render() {
    return (
      <WrappedFormItem
        curElement={this}
        formElement={this.getFormElement()}
        name={this.name}
        label={this.label}
        required={this.required}
        labelBrick={this.labelBrick}
        helpBrick={this.helpBrick}
        trigger="handleChange"
        validator={checkContractRule}
      >
        <EoContractSelectComponent
          value={this.value}
          suffix={this.suffix}
          validateState={this.validateState}
          onChange={this.handleChange}
        />
      </WrappedFormItem>
    );
  }
}

export interface EoContractSelectProps {
  value?: string;
  validateState?: string;
  placeholder?: string;
  inputStyle?: React.CSSProperties;
  suffix?: { useBrick: UseSingleBrickConf | UseSingleBrickConf[] };
  onChange?(value: string): void;
}

interface ProcessedContractField {
  name: string;
  version: string;
}

function splitContract(value = ""): ProcessedContractField {
  const [name, version] = value.split(":");
  return {
    name,
    version,
  };
}

function isContractApi(name: string): boolean {
  return /.*@.*:\d+\.\d+\.\d+/.test(name);
}

export function checkContractRule(value: any): string {
  if (!isNil(value) && !isContractApi(value)) {
    return i18n.t(`${NS}:${K.CONTRACT_VALIDATE_MESSAGE}`);
  }
  return "";
}

export function EoContractSelectComponent({
  value,
  inputStyle,
  validateState,
  suffix,
  onChange,
}: EoContractSelectProps) {
  const [q, setQ] = useState<string>();
  const [pageSize, setPageSize] = useState(20);
  const contractList = useContractList({ q, pageSize });
  const [mixedValue, setMixedValue] = useState(splitContract(value));
  const [versionOptions, setVersionOptions] = useState([]);

  useEffect(() => {
    setMixedValue(splitContract(value));
  }, [value]);

  const handlerSearch = useMemo(
    () =>
      debounce((value) => {
        setQ(value);
      }, 200),
    []
  );

  const handlerNameChange = (event: CustomEvent<string>): void => {
    const name = event.detail;
    //  直接 copy 契约全名
    if (isContractApi(name)) {
      setMixedValue(splitContract(name));
      onChange?.(name);
    } else {
      const versionList = contractList.find(
        (item) => item.fullContractName === name
      )?.version;

      const autofillVersion = versionList?.[0] ?? "";
      setVersionOptions(versionList);
      setMixedValue({
        name,
        version: autofillVersion,
      });
      onChange?.(`${name}:${autofillVersion}`);
    }
    handlerSearch(name);
  };

  const handleVersionChange = (event: CustomEvent<string>): void => {
    const version = event.detail;
    setMixedValue({
      name: mixedValue.name,
      version,
    });

    onChange?.(`${mixedValue.name}:${version}`);
  };

  return (
    <div className="contract-wrapper">
      <WrappedAutoComplete
        className="contract-selector"
        options={contractList?.map((item) => ({
          value: item.fullContractName,
          label: item.fullContractName,
        }))}
        value={mixedValue.name}
        inputStyle={inputStyle}
        validateState={validateState}
        onChange={handlerNameChange as any}
      >
        <MoreOption
          onBlur={(pageSize) => setPageSize(pageSize)}
          slot="options-toolbar"
        />
      </WrappedAutoComplete>
      <WrappedAutoComplete
        className="version-selector"
        value={mixedValue.version}
        validateState={validateState}
        options={versionOptions?.map((v) => ({ value: v, label: v }))}
        onChange={handleVersionChange as any}
      ></WrappedAutoComplete>
      {suffix.useBrick ? (
        <ReactUseMultipleBricks {...suffix}></ReactUseMultipleBricks>
      ) : null}
    </div>
  );
}
