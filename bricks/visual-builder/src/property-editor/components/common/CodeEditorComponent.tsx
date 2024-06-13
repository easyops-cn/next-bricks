import React from "react";
import { wrapBrick } from "@next-core/react-element";
import { CodeEditor, CodeEditorProps } from "@next-bricks/vs/code-editor";

interface CodeEditorComponentProps extends CodeEditorProps {
  onChange?: (value?: any) => void;
  tokenClick?: (value?: any) => void;
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
  return (
    <WrappedCodeEditor
      minLines={5}
      automaticLayout="fit-content"
      language={"brick_next_yaml"}
      theme={"vs-dark"}
      links={["CTX"]}
      {...props}
    />
  );
}
