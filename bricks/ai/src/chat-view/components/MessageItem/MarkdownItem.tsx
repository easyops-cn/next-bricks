import React from "react";
import {
  defaultValueCtx,
  Editor,
  rootCtx,
  editorViewOptionsCtx,
} from "@milkdown/core";
import { Milkdown, useEditor, MilkdownProvider } from "@milkdown/react";
import { commonmark } from "@milkdown/preset-commonmark";
import { nord } from "@milkdown/theme-nord";
import { gfm } from "@milkdown/preset-gfm";
import { prism } from "@milkdown/plugin-prism";

export function MarkdownItem({ text }: { text: string }) {
  return (
    <div className="markdown-item">
      <MilkdownProvider>
        <MarkdownDisplay value={text} />
      </MilkdownProvider>
    </div>
  );
}

export function MarkdownDisplay({ value }: { value: string }): React.ReactNode {
  useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.update(editorViewOptionsCtx, (prev: any) => ({
          ...prev,
          editable: () => false,
        }));
        value && ctx.set(defaultValueCtx, value);
      })
      .config(nord)
      .use(prism)
      .use(gfm)
      .use(commonmark);
  }, []);

  return <Milkdown />;
}
