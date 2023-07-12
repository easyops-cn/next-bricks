import { useNodeViewContext } from "@prosemirror-adapter/react";
import type { FC } from "react";
import React from "react";

const langs = [
  "text",
  "typescript",
  "javascript",
  "go",
  "python",
  "php",
  "html",
  "css",
  "json",
  "markdown",
];

export const CodeBlock: FC = () => {
  const { contentRef, node, setAttrs } = useNodeViewContext();
  return (
    <div className="codeBlockContainer">
      <div
        contentEditable="false"
        suppressContentEditableWarning
        style={{
          marginBottom: "0.5rem",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <select
          className="codeBlockSelect"
          value={node.attrs.language || "text"}
          onChange={(e) => {
            setAttrs({ language: e.target.value });
          }}
        >
          {langs.map((lang) => (
            <option value={lang} key={lang}>
              {lang}
            </option>
          ))}
        </select>

        <button
          className="codeBlockCopyBtn"
          onClick={(e) => {
            e.preventDefault();
            navigator.clipboard.writeText(node.textContent);
          }}
        >
          Copy
        </button>
      </div>
      <pre spellCheck={false}>
        <code ref={contentRef} />
      </pre>
    </div>
  );
};
