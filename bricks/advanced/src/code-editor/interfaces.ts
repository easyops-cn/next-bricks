import { IMarker } from "react-ace";

export interface Error {
  err: Annotation[];
  hasError: boolean;
}

export interface ExtendedMarker extends IMarker {
  highlightType: HighlightTokenType;
  identifier: string;
}

export interface CodeEditorProps {
  placeholder?: string;
  label?: string;
  name?: string;
  value: string;
  disabled?: boolean;
  theme?: string;
  mode: string;
  readOnly?: boolean;
  showLineNumbers?: boolean;
  maxLines?: number | "Infinity";
  minLines: number;
  tabSize?: number;
  showGutter?: boolean;
  printMargin?: boolean;
  highlightActiveLine?: boolean;
  showExportButton?: boolean;
  showCopyButton?: boolean;
  showExpandButton?: boolean;
  exportFileName?: string;
  jsonSchema?: Record<string, any>;
  validateJsonSchemaMode?: "warning" | "error";
  schemaRef?: string;
  enableLiveAutocompletion?: boolean;
  customCompleters?:
    | string[]
    | {
        caption?: string;
        value: string;
        meta?: string;
        score?: number;
      }[];
  loadYamlInJsonMode?: boolean;
  showPrintMargin?: boolean;
  highlightTokens?: HighlightTokenSettings[];
  validateState?: string;
  onValidate?: (error: Annotation[]) => void;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onErrorChange?: (error: Error) => void;
  onClickHighlightToken?: (token: {
    type: HighlightTokenType;
    value: string;
  }) => void;
}

export interface HighlightTokenSettings {
  type: HighlightTokenType;
  clickable?: boolean;
  level?: "default" | "warn" | "error";
}

export type HighlightTokenType =
  | "storyboard-function"
  | "storyboard-context"
  | "storyboard-context-action"
  | "storyboard-state"
  | "storyboard-state-action"
  | "storyboard-tpl-var"
  | "storyboard-tag-name-as-target"
  | "storyboard-route-var"
  | "dashboard-DS";

export interface AceLanguageRules {
  [className: string]: AceLanguageRule[];
}

export interface AceLanguageRule {
  token?: string | string[] | AceTokenFunction;
  regex?: string | RegExp;
  next?: string;
  defaultToken?: string;
  consumeLineEnd?: boolean;
  onMatch?: (
    val?: string,
    state?: unknown,
    stack?: [string, number],
    line?: string
  ) => string;
}

export type AceTokenFunction = (value: string) => string;

export interface Annotation {

  row: number;

  column: number;

  text: string;

  type: string;
}
