import React, { useCallback, useEffect, useState } from "react";
import { wrapBrick } from "@next-core/react-element";
import { CodeEditor, CodeEditorProps } from "@next-bricks/vs/code-editor";
import yaml from "js-yaml";
import { isEmpty } from "lodash";

interface CodeEditorComponentProps extends CodeEditorProps {
  onChange?: (value?: any) => void;
  tokenClick?: (value?: any) => void;
  scope: any;
}

interface CodeEditorEvents {
  "code.change"?: (value?: any) => void;
  "token.click"?: (value?: any) => void;
}

interface CodeEditorEventsMapping {
  onChange: "code.change";
  tokenClick: "token.click";
}

const WrappedCodeEditor = wrapBrick<
  CodeEditor,
  CodeEditorProps,
  CodeEditorEvents,
  CodeEditorEventsMapping
>("vs.code-editor", {
  onChange: "code.change",
  tokenClick: "token.click",
});

export function CodeEditorComponent(
  props: CodeEditorComponentProps
): React.ReactElement {
  const [initValue, setInitValue] = useState<string>();
  const [value, setValue] = useState<string>();

  const handleChange = useCallback(
    (event: any) => {
      setValue(event.detail ? event.detail : undefined);
      const value = event.detail ? yaml.safeLoad(event.detail) : undefined;
      props?.onChange?.(value);
    },
    [props]
  );

  useEffect(() => {
    if (props.value && !initValue) {
      let value = props.value as any;
      if (value && typeof value !== "string") {
        if (isEmpty(value)) {
          value = "";
        } else {
          value = yaml.safeDump(
            Array.isArray(value)
              ? value
              : {
                  ...value,
                  style: isEmpty(value.style) ? undefined : value.style,
                },
            {
              skipInvalid: true,
            }
          );
        }
      }

      setInitValue(value);
    }
  }, [props.value, initValue]);

  return (
    <WrappedCodeEditor
      minLines={props.minLines ?? 1}
      automaticLayout="fit-content"
      language={"brick_next_yaml"}
      theme={"vs-dark"}
      {...props}
      value={value ?? initValue}
      onChange={handleChange}
    />
  );
}
