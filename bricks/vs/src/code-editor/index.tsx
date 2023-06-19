import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { wrapBrick } from "@next-core/react-element";
import { useCurrentTheme } from "@next-core/react-runtime";
import { FormItemElementBase } from "@next-shared/form";
import type { FormItem, FormItemProps } from "@next-bricks/form/form-item";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import { register as registerJavaScript } from "@next-core/monaco-contributions/javascript";
import { register as registerTypeScript } from "@next-core/monaco-contributions/typescript";
import { register as registerYaml } from "@next-core/monaco-contributions/yaml";
import { register as registerHtml } from "@next-core/monaco-contributions/html";
import "@next-core/theme";
import {
  EDITOR_SCROLLBAR_SIZE,
  EDITOR_PADDING_VERTICAL,
  EDITOR_LINE_HEIGHT,
  EDITOR_FONT_SIZE,
} from "./constants.js";

registerJavaScript();
registerTypeScript();
registerYaml("brick_next_yaml");
registerHtml();

// --- NOTE: uncomment these lines below to enable i18n for your brick ---
// import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
// import { K, NS, locales } from "./i18n.js";
// initializeReactI18n(NS, locales);

const { defineElement, property, event } = createDecorators();

const WrappedFormItem = wrapBrick<FormItem, FormItemProps>(
  "form.general-form-item"
);

export interface CodeEditorProps {
  name?: string;
  label?: string;
  value?: string;
  language?: string;
  theme?: string;
  required?: boolean;
  readOnly?: boolean;
  automaticLayout?: "fit-container" | "fit-content" | "none";
  minLines?: number;
  maxLines?: number;
  height?: string | number;
}

/**
 * 构件 code-editor
 */
export
@defineElement("vs.code-editor", {
  // There are a few issues for monaco-editor with shadow DOM.
  // So we use light DOM for now.
  // See https://github.com/microsoft/monaco-editor/issues?q=is%3Aissue+is%3Aopen+shadow+dom
  shadowOptions: false,
})
class CodeEditor extends FormItemElementBase implements CodeEditorProps {
  @property()
  accessor name: string | undefined;

  @property()
  accessor label: string | undefined;

  @property({ attribute: false })
  accessor value: string | undefined;

  /**
   * @default "plaintext"
   */
  @property()
  accessor language: string | undefined;

  /**
   * 主题，支持 `"auto" | "vs" | "vs-dark"`
   *
   * @default "auto"
   * @group ui
   */
  @property() accessor theme: string | undefined;

  @property({
    type: Boolean,
  })
  accessor required: boolean | undefined;

  @property({
    type: Boolean,
  })
  accessor readOnly: boolean | undefined;

  @property()
  accessor automaticLayout:
    | "fit-container"
    | "fit-content"
    | "none"
    | undefined;

  /**
   * @default 3
   */
  @property({ type: Number })
  accessor minLines: number | undefined;

  /**
   * @default Infinity
   */
  @property({ type: Number })
  accessor maxLines: number | undefined;

  @property({ attribute: false })
  accessor height: string | number | undefined;

  @event({ type: "code.change" })
  accessor #codeChange!: EventEmitter<string>;

  @event({ type: "user.input" })
  accessor #userInput!: EventEmitter<string>;

  #handleChange = (value: string, isFlush: boolean) => {
    this.#codeChange.emit(value);
    if (!isFlush) {
      this.#userInput.emit(value);
    }
  };

  connectedCallback(): void {
    // Don't override user's style settings.
    // istanbul ignore else
    if (!this.style.display) {
      this.style.display = "block";
    }
    super.connectedCallback();
  }

  render() {
    return (
      <WrappedFormItem
        curElement={this}
        formElement={this.getFormElement()}
        name={this.name}
        label={this.label}
        required={this.required}
      >
        <CodeEditorComponent
          value={this.value}
          language={this.language}
          theme={this.theme}
          automaticLayout={this.automaticLayout}
          minLines={this.minLines}
          maxLines={this.maxLines}
          height={this.height}
          onChange={this.#handleChange}
        />
      </WrappedFormItem>
    );
  }
}

export function CodeEditorComponent({
  value: _value,
  language: _language,
  theme: _theme,
  minLines: _minLines,
  maxLines: _maxLines,
  height: _height,
  automaticLayout,
  onChange,
}: CodeEditorProps & { onChange(value: string, isFlush: boolean): void }) {
  const value = _value ?? "";
  const language = _language ?? "plaintext";
  const theme = _theme ?? "auto";
  const minLines = _minLines ?? 3;
  const maxLines = _maxLines ?? Infinity;
  const height = _height ?? 500;

  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  const size = useRef<monaco.editor.IDimension>({
    width: 300,
    height: getContentHeightByCode(value, minLines, maxLines),
  });
  const [actualHeight, setActualHeight] = useState<string | number>();
  // `automaticLayout` should never change
  const automaticLayoutRef = useRef(automaticLayout);
  const systemTheme = useCurrentTheme();

  useEffect(() => {
    // Currently theme is configured globally.
    // See https://github.com/microsoft/monaco-editor/issues/338
    monaco.editor.setTheme(
      theme === "auto"
        ? systemTheme === "dark" || systemTheme === "dark-v2"
          ? "vs-dark"
          : "vs"
        : theme
    );
  }, [systemTheme, theme]);

  useEffect(() => {
    if (editorRef.current) {
      const currentModel = editorRef.current.getModel()!;
      monaco.editor.setModelLanguage(currentModel, language);
      currentModel.setValue(value);
    }
  }, [value, language]);

  useLayoutEffect(() => {
    if (automaticLayoutRef.current !== "fit-content" || !containerRef.current) {
      return;
    }

    size.current.width = containerRef.current.getBoundingClientRect().width;
    editorRef.current?.layout(size.current);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === containerRef.current) {
          const newWidth = entry.contentBoxSize
            ? entry.contentBoxSize[0].inlineSize
            : entry.contentRect.width;
          if (newWidth !== size.current.width) {
            size.current.width = newWidth;
            editorRef.current?.layout(size.current);
          }
          break;
        }
      }
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  useLayoutEffect(() => {
    if (automaticLayoutRef.current !== "fit-container") {
      return;
    }

    const container = getDOMContainer(containerRef.current);
    if (!container) {
      return;
    }
    // Manually layout the editor once the container resized.
    const handleResize = (): void => {
      setActualHeight(container.offsetHeight);
    };
    const observer = new ResizeObserver(handleResize);
    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (
      automaticLayoutRef.current !== "fit-container" &&
      automaticLayoutRef.current !== "fit-content"
    ) {
      setActualHeight(height);
    }
  }, [height]);

  useEffect(() => {
    if (editorRef.current || !containerRef.current) {
      return;
    }
    const model = monaco.editor.createModel(value, language ?? "yaml");
    editorRef.current = monaco.editor.create(containerRef.current, {
      model,
      minimap: {
        enabled: false,
      },
      scrollBeyondLastLine: false,
      tabSize: 2,
      insertSpaces: true,
      automaticLayout: automaticLayoutRef.current !== "fit-content",
      fontSize: EDITOR_FONT_SIZE,
      lineHeight: EDITOR_LINE_HEIGHT,
      scrollbar: {
        horizontalScrollbarSize: EDITOR_SCROLLBAR_SIZE,
        verticalScrollbarSize: EDITOR_SCROLLBAR_SIZE,
        horizontalSliderSize: 8,
        verticalSliderSize: 8,
        alwaysConsumeMouseWheel: false,
      },
      padding: {
        top: EDITOR_PADDING_VERTICAL,
        // When use `fit-content`, we always plus the height with the vertical padding.
        // Thus the possible x-scrollbar will not take extra space at the bottom.
        bottom:
          automaticLayoutRef.current == "fit-content"
            ? undefined
            : EDITOR_PADDING_VERTICAL,
      },
      overviewRulerBorder: false,
      mouseWheelScrollSensitivity: 0.5,
    });
  }, [value, language]);

  useEffect(() => {
    const editor = editorRef.current;
    if (
      !editor ||
      !containerRef.current ||
      automaticLayoutRef.current !== "fit-content"
    ) {
      return;
    }

    const listener = editor.onDidContentSizeChange((e) => {
      if (e.contentHeightChanged) {
        const newHeight = fixEditorHeightWithScrollBar(
          e.contentHeight,
          minLines,
          maxLines
        );
        if (newHeight !== size.current.height) {
          size.current.height = newHeight;
          editor.layout(size.current);
        }
      }
    });

    const newHeight = fixEditorHeightWithScrollBar(
      editor.getContentHeight(),
      minLines,
      maxLines
    );
    if (newHeight !== size.current.height) {
      size.current.height = newHeight;
      editor.layout(size.current);
    }

    return () => {
      listener.dispose();
    };
  }, [maxLines, minLines]);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }
    const currentModel = editorRef.current.getModel()!;
    const listener = currentModel.onDidChangeContent((e) => {
      onChange(currentModel.getValue(), e.isFlush);
    });
    return () => {
      listener.dispose();
    };
  }, [onChange]);

  useEffect(() => {
    return () => {
      editorRef.current?.getModel()?.dispose();
      editorRef.current?.dispose();
    };
  }, []);

  return <div ref={containerRef} style={{ height: actualHeight }} />;
}

function getContentHeightByCode(
  code: string,
  minLines: number,
  maxLines: number
): number {
  return getContentHeightByLines(
    Math.min(maxLines, Math.max(minLines, code.split("\n").length))
  );
}

function fixEditorHeightWithScrollBar(
  contentHeight: number,
  minLines: number,
  maxLines: number
): number {
  let fixedHeight = contentHeight;
  if ((contentHeight - EDITOR_PADDING_VERTICAL) % EDITOR_LINE_HEIGHT === 0) {
    fixedHeight = contentHeight + EDITOR_SCROLLBAR_SIZE;
  }
  return Math.min(
    getContentHeightByLines(maxLines),
    Math.max(fixedHeight, getContentHeightByLines(minLines))
  );
}

function getContentHeightByLines(lines: number): number {
  return (
    lines * EDITOR_LINE_HEIGHT + EDITOR_SCROLLBAR_SIZE + EDITOR_PADDING_VERTICAL
  );
}

/** Get the direct DOM container of `vs.code-editor` */
function getDOMContainer(element: HTMLElement | null) {
  let brick = element;
  while (brick) {
    const found = brick.tagName.toLowerCase() === "vs.code-editor";
    brick = brick.parentElement;
    if (found) {
      return brick;
    }
  }
}
