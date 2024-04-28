import React, { useEffect } from "react";
import {
  defaultValueCtx,
  Editor,
  rootCtx,
  editorViewOptionsCtx,
} from "@milkdown/core";
import { Milkdown, useEditor, MilkdownProvider } from "@milkdown/react";
import { commonmark, codeBlockSchema } from "@milkdown/preset-commonmark";
import { nord } from "@milkdown/theme-nord";
import { gfm } from "@milkdown/preset-gfm";
import { prism } from "@milkdown/plugin-prism";
import { $view, replaceAll } from "@milkdown/utils";
import {
  ProsemirrorAdapterProvider,
  useNodeViewFactory,
} from "@prosemirror-adapter/react";
import { CodeBlock } from "./CodeBlock/index.js";

export function MarkdownItem({ text }: { text: string }) {
  return (
    <div className="markdown-item">
      <MilkdownProvider>
        <ProsemirrorAdapterProvider>
          <MarkdownDisplay value={text} />
        </ProsemirrorAdapterProvider>
      </MilkdownProvider>
    </div>
  );
}

export function MarkdownDisplay({ value }: { value: string }): React.ReactNode {
  const nodeViewFactory = useNodeViewFactory();

  const { get } = useEditor((root) => {
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
      .use(commonmark)
      .use(
        $view(codeBlockSchema.node, () =>
          nodeViewFactory({ component: CodeBlock })
        )
      );
  }, []);

  useEffect(() => {
    if (value !== undefined) {
      get()?.action(replaceAll(value));
    }
  }, [get, value]);

  return <Milkdown />;
}
