import React, { useEffect } from "react";
import {
  defaultValueCtx,
  Editor,
  rootCtx,
  editorViewOptionsCtx,
} from "@milkdown/core";
import { EditorView } from "prosemirror-view";
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

// function hasURLProtocol(url: any) {
//   return (
//     url.startsWith("http://") ||
//     url.startsWith("https://") ||
//     url.startsWith("file://") ||
//     url.startsWith("data:") ||
//     url.startsWith("ts://?ts") ||
//     url.startsWith("ts:?ts")
//   );
// }

export function MarkdownDisplay({ value }: { value: string }): React.ReactNode {
  const nodeViewFactory = useNodeViewFactory();

  const handleClick = (view: EditorView, pos: number) => {
    const found = view.state.tr.doc.nodeAt(pos);

    if (found && found.marks.length > 0) {
      const mark = found.marks.find((m) => m.type.name === "link");
      const href = mark?.attrs.href;
      // let path: string;

      // if (hasURLProtocol(href)) {
      //   path = href;
      // } else {
      //   path = encodeURIComponent(href);
      // }

      window.open(href, "_blank");
    }
    return true;
  };

  const transformOpenAIToCodeBlock = (str: string) => {
    if (/<tool_call>(.+)<\/tool_call>/.test(str)) {
      return str.replace(
        /<tool_call>(.+)<\/tool_call>/,
        (_, $1) => `\n\`\`\`easy_cmd_tool_call\n${$1}\n\`\`\`\n`
      );
    }
    return str;
  };

  const { get } = useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.update(editorViewOptionsCtx, (prev: any) => ({
          ...prev,
          editable: () => false,
          handleClickOn: (view: EditorView, pos: number) =>
            handleClick(view, pos),
        }));
        const realValue = transformOpenAIToCodeBlock(value);
        realValue && ctx.set(defaultValueCtx, realValue);
        //拦截link的默认点击事件以支持通过新窗口弹出页面，如果后续有其他的定制化需求可以改用custom widget的方式写link widget
        const observer = new MutationObserver(() => {
          const links = Array.from(root.querySelectorAll("a"));
          links.forEach((link) => {
            link.onclick = () => false;
          });
        });
        observer.observe(root, {
          childList: true,
          subtree: true,
        });
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
      const realValue = transformOpenAIToCodeBlock(value);
      get()?.action(replaceAll(realValue));
    }
  }, [get, value]);

  return <Milkdown />;
}
