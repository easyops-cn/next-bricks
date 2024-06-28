import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@formily/antd-v5";
import { useField, useForm } from "@formily/react";
import {
  createEffectHook,
  Form,
  onFormInitialValuesChange,
} from "@formily/core";
import { ADVANCED_CHANGE_KEY } from "../../index.js";

interface InputWithUrlComponentProps {
  onChange: (value: string) => void;
  value: string;
  name: string;
  advancedMode?: boolean;
  transform: {
    url: string;
    href: string;
  };
}

export function InputWithUrlComponent(props: InputWithUrlComponentProps) {
  const [mode, setMode] = useState<boolean>(true);
  const form = useForm();
  const field = useField();
  const { url, href } = props.transform ?? { url: "url", href: "href" };

  const onAdvancedChangeEffect = useMemo(
    () =>
      createEffectHook(
        ADVANCED_CHANGE_KEY,
        (advancedMode, form) => (listener) => {
          listener(advancedMode, form);
        }
      ),
    []
  );

  const handleModeClick = useCallback(() => {
    const realMode = !mode;
    setMode(realMode);

    form.setValues({ [realMode ? url : href]: props.value });
    form.deleteValuesIn(realMode ? href : url);
  }, [mode, form, url, props.value, href]);

  const handleChange = useCallback(
    (event: CustomEvent<string>) => {
      props.onChange(event.detail);

      form.setValues({ [mode ? url : href]: event.detail });
    },
    [props, form, mode, url, href]
  );

  const suffixText = useMemo(() => `${mode ? "内链" : "外链"}`, [mode]);

  const computedLink = useCallback(
    (form: Form) => {
      const { values } = form.getState();
      const fieldName = field.props.name;

      form.setValuesIn(fieldName, values[url] ?? values[href]);

      setMode(!values[href]);
    },
    [field.props.name, href, url]
  );

  useEffect(() => {
    form.addEffects("onAdvancedChange", () => {
      onFormInitialValuesChange(computedLink),
        onAdvancedChangeEffect((advancedMode: boolean, form: Form) => {
          const fieldName = field.props.name;
          if (advancedMode) {
            form.deleteValuesIn(fieldName);
          }
        });
    });
  }, [form, field, onAdvancedChangeEffect, computedLink]);

  useEffect(() => {
    computedLink(form);
  }, []);

  return (
    <Input
      {...props}
      suffix={
        <div
          style={{ cursor: "pointer" }}
          slot="suffix"
          onClick={handleModeClick}
        >
          {suffixText}
        </div>
      }
      onChange={handleChange as any}
    />
  );
}
