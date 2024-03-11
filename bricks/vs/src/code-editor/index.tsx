import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { unwrapProvider } from "@next-core/utils/general";
import { wrapBrick } from "@next-core/react-element";
import { useCurrentTheme } from "@next-core/react-runtime";
import { FormItemElementBase } from "@next-shared/form";
import type { FormItem, FormItemProps } from "@next-bricks/form/form-item";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import { register as registerJavaScript } from "@next-core/monaco-contributions/javascript";
import { register as registerTypeScript } from "@next-core/monaco-contributions/typescript";
import { register as registerYaml } from "@next-core/monaco-contributions/yaml";
import { register as registerHtml } from "@next-core/monaco-contributions/html";
import yaml from "js-yaml";
import "@next-core/theme";
import { uniqueId, debounce } from "lodash";
import {
  EDITOR_SCROLLBAR_SIZE,
  EDITOR_PADDING_VERTICAL,
  EDITOR_LINE_HEIGHT,
  EDITOR_FONT_SIZE,
} from "./constants.js";
import { brickNextYAMLProviderCompletionItems } from "./utils/brickNextYaml.js";
import { Level } from "./utils/constants.js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VSWorkers } from "./workers/index.mjs";
import { setEditorId } from "./utils/editorId.js";
import type { EoTooltip, ToolTipProps } from "@next-bricks/basic/tooltip";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
import { K, NS, locales } from "./i18n.js";
import type { copyToClipboard as _copyToClipboard } from "@next-bricks/basic/data-providers/copy-to-clipboard";
import type { showNotification as _showNotification } from "@next-bricks/basic/data-providers/show-notification/show-notification";
import classNames from "classnames";
import "./index.css";

initializeReactI18n(NS, locales);

registerJavaScript(monaco);
registerTypeScript(monaco);
registerYaml(monaco, "brick_next_yaml");
registerHtml(monaco);

const { defineElement, property, event } = createDecorators();

const WrappedFormItem = wrapBrick<FormItem, FormItemProps>("eo-form-item");
const WrappedTooltip = wrapBrick<EoTooltip, ToolTipProps>("eo-tooltip");
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const copyToClipboard = unwrapProvider<typeof _copyToClipboard>(
  "basic.copy-to-clipboard"
);
const showNotification = unwrapProvider<typeof _showNotification>(
  "basic.show-notification"
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
  completers?: monaco.languages.CompletionItem[];
  advancedCompleters?: Record<
    string,
    { triggerCharacter: string; completers: monaco.languages.CompletionItem[] }
  >;
  markers?: Marker[];
  links?: string[];
  showExpandButton?: boolean;
  showCopyButton?: boolean;
  validateState?: string;
}

export interface Marker {
  token: string;
  level?: keyof typeof Level;
  message?: string;
  code?: {
    value: string;
    target: string;
  };
  params?: string[];
}

/**
 * 构件代码编辑器
 * @category form-input-advanced
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

  @property()
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

  @property({
    attribute: false,
  })
  accessor completers: monaco.languages.CompletionItem[] | undefined;

  @property({
    attribute: false,
  })
  accessor advancedCompleters:
    | Record<
        string,
        {
          triggerCharacter: string;
          completers: monaco.languages.CompletionItem[];
        }
      >
    | undefined;

  @property({ attribute: false })
  accessor markers: Marker[] | undefined;

  @property({ attribute: false })
  accessor links: string[] | undefined;

  /**
   * @default Infinity
   */
  @property({ type: Number })
  accessor maxLines: number | undefined;

  @property({ attribute: false })
  accessor height: string | number | undefined;

  @property()
  accessor message: string | undefined;

  /**
   * 是否展示展开按钮
   */
  @property({ type: Boolean })
  accessor showExpandButton: boolean | undefined;

  /**
   * 是否展示复制按钮
   * @default true
   */
  @property({ type: Boolean })
  accessor showCopyButton: boolean | undefined;

  @event({ type: "code.change" })
  accessor #codeChange!: EventEmitter<string>;

  @event({ type: "user.input" })
  accessor #userInput!: EventEmitter<string>;

  #handleChange = (
    value: string,
    parseValue: any,
    isFlush: boolean,
    isInit: boolean = false
  ) => {
    this.value = value;
    !isInit && this.getFormElement()?.formStore.onChange(this.name!, value);
    this.#codeChange.emit(value);
    if (!isFlush) {
      this.#userInput.emit(parseValue);
    }
  };

  @event({ type: "token.click" })
  accessor #tokenClickEvent!: EventEmitter<string>;

  #handleTokenClick = (word: string) => {
    this.#tokenClickEvent.emit(word);
  };

  #handleValidtor = (value: string) => {
    try {
      yaml.load(value);
    } catch {
      return "请填写正确的格式";
    }
    return "";
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
        helpBrick={this.helpBrick}
        labelBrick={this.labelBrick}
        notRender={this.notRender}
        validator={this.#handleValidtor}
      >
        <CodeEditorComponent
          value={this.value}
          language={this.language}
          readOnly={this.readOnly}
          theme={this.theme}
          automaticLayout={this.automaticLayout}
          minLines={this.minLines}
          maxLines={this.maxLines}
          height={this.height}
          completers={this.completers}
          advancedCompleters={this.advancedCompleters}
          markers={this.markers}
          links={this.links}
          showCopyButton={this.showCopyButton}
          showExpandButton={this.showExpandButton}
          validateState={this.validateState}
          onChange={this.#handleChange}
          onTokenClick={this.#handleTokenClick}
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
  completers,
  advancedCompleters,
  markers,
  readOnly,
  links,
  showExpandButton,
  showCopyButton = true,
  validateState,
  onChange,
  onTokenClick,
}: CodeEditorProps & {
  onChange(
    value: string,
    parseValue: any,
    isFlush: boolean,
    isInit: boolean
  ): void;
  onTokenClick(word: string): void;
}) {
  const value = _value ?? "";
  const language = _language ?? "plaintext";
  const theme = _theme ?? "auto";
  const minLines = _minLines ?? 3;
  const maxLines = _maxLines ?? Infinity;
  const height = _height ?? 500;
  const [expanded, setExpanded] = useState(false);
  const workerId = useMemo(() => uniqueId("worker"), []);

  const { t } = useTranslation(NS);

  const containerRef = useRef<HTMLDivElement>(null);
  const decorationsCollection =
    useRef<monaco.editor.IEditorDecorationsCollection>();
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
    if (language !== "brick_next_yaml") return;
    const workerInstance = VSWorkers.getInstance(workerId);
    const id = workerInstance.addEventListener("message", (message: any) => {
      const { token, data, init = false } = message.data;
      const model = editorRef.current!.getModel();
      if (!model) return;
      const originValue = model.getValue();

      switch (token) {
        case "parse_yaml": {
          const { value, tokens, markers } = data;

          decorationsCollection.current?.set(
            tokens.map((token: any) => ({
              range: new monaco.Range(
                token.startLineNumber,
                token.startColumn,
                token.endLineNumber,
                token.endColumn
              ),
              options: {
                inlineClassName: "highlight",
              },
            }))
          );
          monaco.editor.setModelMarkers(model, "brick_next_yaml", markers);
          onChange(originValue, value, false, init);
          break;
        }
        case "parse_yaml_error": {
          monaco.editor.setModelMarkers(model, "brick_next_yaml", []);
          decorationsCollection?.current?.set([]);
          onChange(originValue, undefined, false, init);
          break;
        }
      }
    });
    return () => {
      workerInstance.removeEventListener(id);
    };
  }, []);

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
    }
  }, [language]);

  useEffect(() => {
    if (language === "brick_next_yaml") {
      const provideCompletionItems = brickNextYAMLProviderCompletionItems(
        completers,
        advancedCompleters,
        workerId
      );
      const monacoProviderRef = monaco.languages.registerCompletionItemProvider(
        "brick_next_yaml",
        {
          provideCompletionItems,
          triggerCharacters: [".", ":", "<"],
        }
      );
      return () => {
        monacoProviderRef.dispose();
      };
    }
  }, [completers, advancedCompleters, language]);

  const parseYaml = useCallback(
    ({ init = false }: { init?: boolean }) => {
      if (language !== "brick_next_yaml" || !editorRef.current) return;
      const workerInstance = VSWorkers.getInstance(workerId);
      workerInstance.postMessage({
        token: "parse_yaml",
        data: {
          value,
          links,
          markers,
        },
        init,
      });
    },
    [language, value, links, markers, workerId]
  );

  const debounceParse = useMemo(() => debounce(parseYaml, 300), [parseYaml]);

  useEffect(() => {
    if (editorRef.current) {
      const currentModel = editorRef.current.getModel();
      if (currentModel && value !== currentModel.getValue()) {
        currentModel.setValue(value as string);
        debounceParse({
          init: true,
        });
      }
    }
  }, [value, debounceParse]);

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
          const newHeight = entry.contentBoxSize
            ? entry.contentBoxSize[0].blockSize
            : entry.contentRect.height;
          if (newWidth !== size.current.width || expanded) {
            size.current.width = newWidth;
            editorRef.current?.layout({
              width: newWidth,
              height: expanded ? newHeight : size.current.height,
            });
          }
          break;
        }
      }
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [expanded]);

  useLayoutEffect(() => {
    if (automaticLayoutRef.current !== "fit-container") {
      return;
    }

    const container = getDOMContainer(containerRef.current);
    if (!container) {
      return;
    }
    // Manually layout the editor once the container resized.
    const observer = new ResizeObserver((): void => {
      setActualHeight(container.offsetHeight);
    });
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
    if (!editorRef.current) return;
    editorRef.current.updateOptions({
      readOnly,
    });
  }, [readOnly]);

  useEffect(() => {
    if (editorRef.current || !containerRef.current) {
      return;
    }
    const model = monaco.editor.createModel(value, language);
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
      fixedOverflowWidgets: true,
      lineNumbersMinChars: 3,
      suggest: {
        insertMode: "insert",
        preview: true,
      },
      readOnly: readOnly,
      quickSuggestions: { strings: true, other: true, comments: true },
    });

    decorationsCollection.current =
      editorRef.current.createDecorationsCollection();
  }, [value, language, readOnly]);

  useEffect(() => {
    const editor = editorRef.current;
    if (language === "brick_next_yaml" && editor) {
      const model = editor.getModel()!;
      const editorMouseDownEvent = editor.onMouseDown(function (e) {
        const decorations = decorationsCollection.current;
        (decorations?.getRanges?.() ?? []).forEach((range) => {
          const modKey = /Mac|iPod|iPhone|iPad/.test(navigator.platform)
            ? "metaKey"
            : "ctrlKey";
          if (
            range &&
            e.target.position &&
            e.event[modKey] &&
            range.containsPosition(e.target.position)
          ) {
            onTokenClick(model.getValueInRange(range));
          }
        });
      });

      const mouseOverEvent = editor.onMouseMove(function (e) {
        const decorations = decorationsCollection.current;
        if (!decorations) return;
        decorations.getRanges().forEach((range) => {
          const modKey = /Mac|iPod|iPhone|iPad/.test(navigator.platform)
            ? "metaKey"
            : "ctrlKey";
          if (
            range &&
            e.target.position &&
            e.event[modKey] &&
            range.containsPosition(e.target.position)
          ) {
            const newDecorations = decorations.getRanges().map((item) => ({
              range: item,
              options: {
                inlineClassName: range.equalsRange(item)
                  ? "highlight pointer"
                  : "highlight",
              },
            }));
            decorations.set(newDecorations);
          } else if (!e.event[modKey]) {
            const newDecorations = decorations.getRanges().map((item) => ({
              range: item,
              options: {
                inlineClassName: "highlight",
              },
            }));
            decorations.set(newDecorations);
          }
        });
      });

      debounceParse({
        init: true,
      });

      return () => {
        mouseOverEvent?.dispose();
        editorMouseDownEvent?.dispose();
      };
    }
  }, [language, onTokenClick, systemTheme, theme, debounceParse]);

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
      if (expanded) return;
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
  }, [maxLines, minLines, expanded]);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }
    const currentModel = editorRef.current.getModel()!;
    const listener = currentModel.onDidChangeContent(() => {
      setEditorId(workerId);
      if (["brick_next_yaml"].includes(language)) {
        debounceParse({
          init: false,
        });
      } else {
        onChange(currentModel.getValue(), undefined, false, false);
      }
    });
    return () => {
      listener.dispose();
    };
  }, [debounceParse, onChange, workerId, language]);

  useEffect(() => {
    if (expanded) {
      const fn = (e: KeyboardEvent): void => {
        if (e.key === "Escape" || e.key === "Esc") {
          window.removeEventListener("keydown", fn);
          setExpanded(false);
        }
      };
      window.addEventListener("keydown", fn);
      return () => {
        window.removeEventListener("keydown", fn);
      };
    }
  }, [expanded]);

  useEffect(() => {
    return () => {
      editorRef.current?.getModel()?.dispose();
      editorRef.current?.dispose();
    };
  }, []);

  const handleCopyIconClick = useCallback(() => {
    if (editorRef.current) {
      const currentModel = editorRef.current.getModel()!;
      copyToClipboard(currentModel.getValue())
        .then(() =>
          showNotification({ type: "success", message: t(K.COPY_SUCCESS) })
        )
        .catch(() =>
          showNotification({ type: "error", message: t(K.COPY_FAILED) })
        );
    }
  }, [t]);

  const handleExpandedClick = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);

  return (
    <div
      className={classNames("code-editor-wrapper", {
        expanded,
        error: validateState === "error",
      })}
    >
      <div
        ref={containerRef}
        style={{
          height: expanded ? "100%" : actualHeight,
          overflow: expanded ? "scroll" : "",
        }}
      />
      <div className="toolbar">
        {showCopyButton && (
          <WrappedTooltip content={t(K.COPY) as string}>
            <WrappedIcon
              className="copy-icon"
              icon="copy"
              lib="antd"
              theme="outlined"
              onClick={handleCopyIconClick}
            />
          </WrappedTooltip>
        )}
        {showExpandButton && (
          <WrappedTooltip
            content={(expanded ? t(K.COLLAPSE) : t(K.EXPAND)) as string}
          >
            <WrappedIcon
              className="expand-icon"
              icon={expanded ? "compress" : "expand"}
              lib="antd"
              theme="outlined"
              onClick={handleExpandedClick}
            />
          </WrappedTooltip>
        )}
      </div>
    </div>
  );
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
