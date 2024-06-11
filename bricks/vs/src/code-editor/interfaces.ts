import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";

export interface DataModelField {
  name: string;
  dataDefinition: DataDefinition;
}

export type AdvancedCompleterMap = Record<
  string,
  {
    triggerCharacter: string;
    completers: monaco.languages.CompletionItem[];
  }
>;

export interface DataDefinition {
  name: string;
  type: string;
  fields?: DataDefinition[];
}

export interface PropertyTypeOption {
  label?: string;
  kind?: monaco.languages.CompletionItemKind;
  isArray?: boolean;
}

export interface ExtraLib {
  filePath: string;
  content: string;
}
