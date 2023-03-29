import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useMemo,
  useCallback,
} from "react";
import AceEditor, { IEditorProps } from "react-ace";
import { isEqual, isEmpty, uniqWith, isString, map } from "lodash";
import Ajv from "ajv";
import classNames from "classnames";
import yaml from "js-yaml";
import storyboardJsonSchema from "@next-core/types/storyboard.json";
import { getBrickNextMode } from "./custom-mode/BrickNextMode.js";
import { getBrickNextYamlMode } from "./custom-mode/BrickNextYamlMode.js";
import { getTerraformMode } from "./custom-mode/TerraformMode.js";
import { brickNextCompleters } from "./custom-mode/brickNextUtil.js";
import { CodeEditorProps, ExtendedMarker, Annotation } from "./interfaces.js";
import { getCommonExpressionLanguageYamlMode } from "./custom-mode/CommonExpressionLanguageYamlMode.js";
import { getCommonExpressionLanguageMode } from "./custom-mode/CommonExpressionLanguageMode.js";
import { CommonExpressionLanguageCompleter } from "./custom-mode/CommonExpressionLanguageRules.js";
import { getHighlightMarkers } from "./getHighlightMarkers.js";
import { getClickableMarker } from "./getClickableMarker.js";
import ResizeObserver from "resize-observer-polyfill";
import "./aceBuilds/index.js";

export function CodeEditorItem(
  props: CodeEditorProps,
  ref: any
): React.ReactElement {
  const [editor, setEditor] = useState<IEditorProps>();
  const [ajv, setAjv] = useState<any>();
  const [jsonSchema, setJsonSchema] = useState(props.jsonSchema);
  const brickNextError = useRef<Annotation[]>([]);
  const compileSchema = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tempOverrideMode, setTempOverrideMode] = useState<string>();

  useEffect(() => {
    let schemaValue = props.jsonSchema;
    if (
      ["brick_next", "brick_next_yaml"].includes(props.mode) &&
      !props.jsonSchema
    ) {
      schemaValue = storyboardJsonSchema;
    }
    if (!isEqual(schemaValue, jsonSchema)) {
      setJsonSchema(schemaValue);
    }
  }, [props.jsonSchema, props.mode]);

  const schemaLint = (data: any): Annotation[] => {
    let newAnnotations: Annotation[] = [];
    try {
      if (!compileSchema?.current) {
        ajv.compile(jsonSchema);
        compileSchema.current = true;
      }
      const valid = ajv.validate(props.schemaRef ?? jsonSchema, data);
      if (!valid) {
        if (!isEqual((brickNextError.current?.[0] as any)?.raw, ajv.errors)) {
          const position = (editor as IEditorProps).getCursorPosition();
          const errorMessage = uniqWith(
            ajv.errors,
            (o, v: any) => v.dataPtah === o.dataPtah && v.message === o.message
          )
            ?.map((e) => {
              const field =
                e.dataPath[0] === "." ? e.dataPath.slice(1) : e.dataPath;
              return `${field ? field + ": " : ""}${e.message}`;
            })
            .join("\n");
          newAnnotations = [
            {
              row: position.row,
              column: position.column,
              type: props.validateJsonSchemaMode,
              text: errorMessage,
              raw: ajv.errors,
            } as Annotation,
          ];
          brickNextError.current = newAnnotations;
        } else {
          newAnnotations = brickNextError.current ?? [];
        }
      } else {
        brickNextError.current = [];
      }
    } catch (e) {
      // do nothing
    }
    return newAnnotations;
  };

  const yamlLint = (): Annotation[] => {
    // ace 官方库缺少 yaml 语法校验，这里主动校验。等 https://github.com/ajaxorg/ace/pull/3979 合并后可去掉
    let yamlLintAnnotations: Annotation[] = [];
    let schemaAnnotations: Annotation[] = [];
    if (props.value) {
      try {
        const data = yaml.safeLoad(props.value, {
          schema: yaml.JSON_SCHEMA,
          json: true,
        });
        if (jsonSchema) {
          schemaAnnotations = schemaLint(data);
        }
      } catch (e: any) {
        const lastRow = (editor as IEditorProps).getLastVisibleRow();
        yamlLintAnnotations = [
          {
            row: e.mark?.line > lastRow ? lastRow : e.mark?.line,
            column: e.mark?.column,
            type: "error",
            text: e.reason,
            raw: e,
          } as Annotation,
        ];
      }
    }
    return [...yamlLintAnnotations, ...schemaAnnotations];
  };

  const localCompleter = useMemo(
    () => ({
      getCompletions(
        _editor: IEditorProps,
        _session: any,
        _pos: any,
        _prefix: string,
        callback: any
      ) {
        callback(
          null,
          map(props.customCompleters, (v) => {
            if (isString(v)) {
              return {
                caption: v,
                value: v,
              };
            } else {
              return v;
            }
          })
        );
      },
    }),
    [props.customCompleters]
  );

  useEffect(() => {
    if (editor && editor.completers && props.customCompleters?.length) {
      editor.completers.push(localCompleter);
    }

    return () => {
      if (editor && editor.completers) {
        const index = editor.completers.indexOf(localCompleter);
        if (index !== -1) {
          editor.completers.splice(index, 1);
        }
      }
    };
  }, [editor, localCompleter, props.customCompleters]);

  useEffect(() => {
    if (
      (props.mode === "yaml" ||
        props.mode === "brick_next_yaml" ||
        props.mode === "cel_yaml") &&
      editor
    ) {
      const newAnnotations = yamlLint();
      const oldAnnotations = editor?.getSession()?.getAnnotations();
      if (!isEqual(oldAnnotations, newAnnotations)) {
        editor.getSession()?.setAnnotations(newAnnotations);
      }
    }
  }, [props.value, props.mode]);

  useEffect(() => {
    if (
      props.mode &&
      ["brick_next", "brick_next_yaml", "cel_yaml", "json", "yaml"].includes(
        props.mode
      ) &&
      jsonSchema
    ) {
      const ajv = new Ajv({
        schemaId: "auto",
        $data: true,
      });
      setAjv(ajv);
    }
  }, [props.mode, jsonSchema]);

  useEffect(() => {
    // temporarily override mode to trigger onValidate, when jsonSchema updated
    if (editor && props.mode === "json") {
      setTempOverrideMode("text");
    }
  }, [jsonSchema]);

  useEffect(() => {
    if (tempOverrideMode) {
      setTempOverrideMode(undefined);
    }
  }, [tempOverrideMode]);

  const handleOnBlur = (): void => {
    props.onBlur && props.onBlur();
  };

  useEffect(() => {
    if (editor) {
      // Shallow Copy.When there are multiple editor instances on one page,react-ace will provide the same completers reference for different editor instances.
      if (editor.completers) {
        editor.completers = [...editor.completers];
      }
      if (props.mode === "brick_next_yaml") {
        const customMode = new (getBrickNextYamlMode())();
        editor.getSession()?.setMode(customMode);
        if (!editor.completers?.includes(brickNextCompleters[0])) {
          editor.completers?.push(...brickNextCompleters);
        }
      } else if (props.mode === "brick_next") {
        const customMode = new (getBrickNextMode())();
        editor.getSession()?.setMode(customMode);
        if (!editor.completers?.includes(brickNextCompleters[0])) {
          editor.completers?.push(...brickNextCompleters);
        }
      } else if (props.mode === "terraform") {
        const customMode = new (getTerraformMode())();
        editor.getSession()?.setMode(customMode);
      } else if (props.mode === "cel_yaml") {
        const customMode = new (getCommonExpressionLanguageYamlMode())();
        editor.getSession()?.setMode(customMode);
        if (
          !editor.completers?.includes(CommonExpressionLanguageCompleter[0])
        ) {
          editor.completers?.push(...CommonExpressionLanguageCompleter);
        }
      } else if (props.mode === "cel") {
        const customMode = new (getCommonExpressionLanguageMode())();
        editor.getSession()?.setMode(customMode);
        if (
          !editor.completers?.includes(CommonExpressionLanguageCompleter[0])
        ) {
          editor.completers?.push(...CommonExpressionLanguageCompleter);
        }
      }
    }
  }, [editor, props.mode]);

  const onLoad = (editorInstance: IEditorProps) => {
    setEditor(editorInstance);
  };

  const onValidate = (err: Annotation[]) => {
    let newAnnotations = err;
    if (
      ajv &&
      ["brick_next", "json"].includes(tempOverrideMode || props.mode) &&
      jsonSchema
    ) {
      let schemaAnnotations: Annotation[] = [];
      let data = props.value;
      try {
        data = JSON.parse(props.value);
        schemaAnnotations = schemaLint(data);
      } catch (e) {
        // do nothing
      }
      if (!isEmpty(schemaAnnotations) && !err?.includes(schemaAnnotations[0])) {
        newAnnotations = [...err, ...schemaAnnotations];
        (editor as IEditorProps).getSession()?.setAnnotations(newAnnotations);
      }
    }
    props.onValidate?.(newAnnotations);
  };

  const [markers, setMarkers] = useState<ExtendedMarker[]>();

  const findHighlightTokens = useCallback(() => {
    setMarkers(
      getHighlightMarkers({
        editor: editor as IEditorProps,
        markerClassMap: {
          default: "aceMarkerOfHighlight",
          warn: "aceMarkerOfWarn",
          error: "aceMarkerOfError",
        },
        highlightTokens: props.highlightTokens,
      })
    );
  }, [editor, props.highlightTokens]);

  const handleChange = useCallback(
    (value: string) => {
      props.onChange?.(value);
      schemaLint(value)
      findHighlightTokens();
    },
    [props.onChange, findHighlightTokens]
  );

  useEffect(() => {
    findHighlightTokens();
  }, [props.value, findHighlightTokens]);

  const markersRef = useRef<ExtendedMarker[]>();
  useEffect(() => {
    markersRef.current = markers;
  }, [markers]);

  useEffect(() => {
    const clickableTypes = props.highlightTokens
      ?.filter((item) => item.clickable)
      .map((item) => item.type);
    if (!editor || !clickableTypes?.length) {
      return;
    }
    const onMouseMove = (e: any): void => {
      editor.renderer.setCursorStyle(
        getClickableMarker(e, clickableTypes, markersRef.current)
          ? "pointer"
          : ""
      );
    };
    const onMouseOut = (): void => {
      editor.renderer.setCursorStyle("");
    };
    const onClick = (e: any): void => {
      const marker = getClickableMarker(e, clickableTypes, markersRef.current);
      if (marker) {
        // Prevent the default behavior of multi-selection.
        editor.session.selection.toSingleRange();
        props.onClickHighlightToken?.({
          type: marker.highlightType,
          value: marker.identifier,
        });
      }
    };
    editor.on("mousemove", onMouseMove);
    editor.on("mouseout", onMouseOut);
    editor.on("click", onClick);
    return () => {
      editor.off("mousemove", onMouseMove);
      editor.off("mouseout", onMouseOut);
      editor.off("click", onClick);
    };
  }, [editor, props.highlightTokens, props.onClickHighlightToken]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const resizeObserver = new ResizeObserver(() => {
      editor?.resize();
    });
    resizeObserver.observe(containerRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [editor]);

  const [expanded, setExpanded] = useState(false);
  // const [expandedLines, setExpandedLines] = useState(0);

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

  const renderEditor = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return <AceEditor
        ref={ref}
        onLoad={onLoad}
        className={classNames("aceContainer", {
          error: props.validateState === "error",
        })}
        name={props.name ?? "commands-editor"}
        placeholder={props.placeholder}
        style={{
          width: "100%",
        }}
        theme={props.theme || "monokai"}
        mode={
          (tempOverrideMode ||
            (props.mode === "brick_next" ||
            props.mode === "brick_next_yaml" ||
            props.mode === "cel_yaml" ||
            props.mode === "cel" ||
            props.mode === "terraform"
              ? "text"
              : props.mode)) ??
          "text"
        }
        value={props.value}
        setOptions={{
          readOnly: props.readOnly,
          showLineNumbers: props.showLineNumbers,
          tabSize: props.tabSize,
          printMargin: props.printMargin,
          highlightActiveLine: props.highlightActiveLine,
          enableLiveAutocompletion: props.enableLiveAutocompletion,
          showGutter: props.showGutter,
        }}
        minLines={props.minLines}
        maxLines={props.maxLines ?? 10}
        // Tips: Automatically scrolling cursor into view after selection change this will be disabled in the next version set editor.$blockScrolling = Infinity to disable this message
        editorProps={{
          $blockScrolling: Infinity,
        }}
        showPrintMargin={props.showPrintMargin}
        markers={markers}
        onChange={handleChange}
        onValidate={onValidate}
        onBlur={handleOnBlur}
      />
  }

  return (
    <div
      className={classNames("wrapper", {
        expanded,
      })}
      ref={containerRef}
    >
      { renderEditor() }
    </div>
  );
}

export const CodeEditorItemWrapper = forwardRef(CodeEditorItem);

