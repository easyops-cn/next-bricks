import React from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import { FormItemElement } from "../../../form/src/form-item/FormItemElement.js";
import type {
  FormItem,
  FormItemProps,
} from "../../../form/src/form-item/index.jsx";
import styleText from "./markdown-editor.shadow.css";
import { defaultValueCtx, Editor, rootCtx } from "@milkdown/core";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { commonmark } from "@milkdown/preset-commonmark";
import { nord } from "@milkdown/theme-nord";
import { history } from "@milkdown/plugin-history";

const markdown = `# Milkdown React Commonmark

> You're scared of a world where you're needed.

This is a demo for using Milkdown with **React**.`;

const WrappedFormItem = wrapBrick<FormItem, FormItemProps>(
  "form.general-form-item"
);

const { defineElement, property, event } = createDecorators();

@defineElement("markdown.markdown-editor", {
  styleTexts: [styleText],
})

/**
 * @id markdown.markdown-editor
 * @name markdown.markdown-editor
 * @docKind brick
 * @description markdown编辑器
 * @author kehua
 * @noInheritDoc
 */
class MarkdownEditor extends FormItemElement {
  render() {
    return (
      <MilkdownProvider>
        <MarkdownEditorComponent />
      </MilkdownProvider>
    );
  }
}

export { MarkdownEditor };

export function MarkdownEditorComponent(props: any) {
  useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, markdown);
      })
      .config(nord)
      .use(commonmark)
      .use(history);
  }, []);
  return (
    <WrappedFormItem {...props}>
      <Milkdown />
    </WrappedFormItem>
  );
}
