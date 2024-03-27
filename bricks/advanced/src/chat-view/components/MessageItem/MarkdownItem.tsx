import React from "react";
import { wrapBrick } from "@next-core/react-element";
import type {
  MarkdownEditor,
  MarkdownEditorProps,
} from "@next-bricks/markdown/markdown-editor";

interface MarkdownItemProps {
  text: string;
}

const WrappedMarkdownEditor = wrapBrick<MarkdownEditor, MarkdownEditorProps>(
  "eo-markdown-editor"
);

export function MarkdownItem({ text }: MarkdownItemProps) {
  const defaultStyle = {
    border: "none",
    background: "inherit",
  };

  return (
    <div className="markdown-item">
      <WrappedMarkdownEditor
        key={0}
        containerStyle={defaultStyle}
        readonly
        value={text}
      />
    </div>
  );
}
