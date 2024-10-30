import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";

export interface DataModelField {
  name: string;
  dataDefinition: DataDefinition;
}

/**
 * E.g. 1, member completions, such as to complete the member by `step.|`:
 *
 * ```yaml
 * step:
 *   - firstStep
 *   - secondStep
 * ```
 *
 * E.g. 2, completions with trigger character, such as to complete `action: |`:
 *
 * ```yaml
 * action:
 *   triggerCharacter: ":"
 *   completers:
 *     - label: console.log
 *     - label: alert
 * ```
 */
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

export interface ExtraLib {
  filePath: string;
  content: string;
}

export type MixedCompleter = MembersCompleter;

export interface MembersCompleter {
  type: "members";
  members: Record<string, string[]>;
}
