import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import storyboardJsonSchema from "@next-core/types/storyboard.json";
import { EVALUATE_KEYWORD, brickNextKeywords } from "./constants.js";
import get from "lodash/get.js";
import { getEditorId } from "./editorId.js";
import { TokenConfig } from "../index.jsx";

const findKeys = (
  model: monaco.editor.ITextModel,
  range: monaco.Range | monaco.editor.IWordAtPosition,
  line: number
) => {
  const curLevelKeys: string[] = [];
  const keyList: string[] = [];
  let parentKey = "";
  let i = line;
  let startColumn = range.startColumn;
  while (i > 0) {
    const prefixLineWord = model.getValueInRange({
      startLineNumber: i,
      endLineNumber: i,
      startColumn: 0,
      endColumn: Infinity,
    });
    const matchWord = prefixLineWord.match(/^([\s|-]*)(\w+)(?=:)/);
    if (matchWord) {
      const [, wordspace, key] = matchWord;
      if (wordspace.length === range.startColumn - 1) {
        curLevelKeys.unshift(key);
      }
      if (wordspace.length < startColumn - 1) {
        !parentKey && (parentKey = key);
        startColumn = wordspace.length;
        keyList.unshift(key);
      }
    }
    i--;
  }
  return {
    curLevelKeys,
    keyList,
    parentKey,
  };
};

const getPrefixWord = (
  model: monaco.editor.ITextModel,
  position: monaco.Position,
  tokenConfig: TokenConfig
): {
  word: string | undefined;
  token: string;
} => {
  const word = model.getWordUntilPosition(position);
  const prefixToken = model.getValueInRange({
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: position.column - word.word.length - 1,
    endColumn: position.column - word.word.length,
  });
  const prefixWord = model.getWordAtPosition({
    ...position,
    column: position.column - word?.word?.length - 1,
  });
  let matchWord = prefixWord?.word;
  if (tokenConfig.showDSKey && prefixWord?.word === "DS") {
    const prefix = model.getWordAtPosition({
      ...position,
      column: prefixWord.startColumn - 1,
    });

    matchWord = `${prefix?.word}.${prefixWord.word}`;
  }
  return {
    word: matchWord,
    token: prefixToken,
  };
};

export const isInEvaluateBody = (
  model: monaco.editor.ITextModel,
  position: monaco.Position
): boolean => {
  const word = model.getWordUntilPosition(position);
  const prefixEvaluateOperator = model.findPreviousMatch(
    "<%",
    position,
    false,
    false,
    null,
    false
  );
  const suffixEvaluateOperator = model.findNextMatch(
    "%>",
    position,
    false,
    false,
    null,
    false
  );
  const isInEvaluateBody =
    prefixEvaluateOperator?.range.startLineNumber &&
    suffixEvaluateOperator?.range.startLineNumber &&
    prefixEvaluateOperator.range.startLineNumber <= position.lineNumber &&
    suffixEvaluateOperator.range.endLineNumber >= position.lineNumber;

  if (isInEvaluateBody) {
    const { parentKey: prefixParentKey } = findKeys(
      model,
      prefixEvaluateOperator.range,
      prefixEvaluateOperator?.range.startLineNumber
    );
    const { parentKey: suffixParentKey } = findKeys(
      model,
      suffixEvaluateOperator.range,
      suffixEvaluateOperator?.range.startLineNumber
    );
    const { keyList } = findKeys(model, word, position.lineNumber);
    if (
      // value is object
      (prefixParentKey === suffixParentKey &&
        keyList.includes(prefixParentKey)) ||
      // value is string
      (prefixParentKey === "" && suffixParentKey === "")
    ) {
      return true;
    }
  }
  return false;
};

export const brickNextYAMLProviderCompletionItems = (
  completers: monaco.languages.CompletionItem[] = [],
  advancedCompleters: Record<
    string,
    { triggerCharacter: string; completers: monaco.languages.CompletionItem[] }
  > = {},
  id: string,
  tokenConfig: TokenConfig
) => {
  return (
    model: monaco.editor.ITextModel,
    position: monaco.Position,
    context: monaco.languages.CompletionContext
  ): monaco.languages.ProviderResult<monaco.languages.CompletionList> => {
    if (id && id !== getEditorId())
      return {
        suggestions: [],
      };
    const DSToken = tokenConfig.showDSKey ? ["CTX.DS", "DS"] : [];
    const word = model.getWordUntilPosition(position);
    const { word: prefixWord, token: prefixToken } = getPrefixWord(
      model,
      position,
      tokenConfig
    );
    const curLineWord = model.getValueInRange({
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: 0,
      endColumn: Infinity,
    });
    const range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    };

    const isFirstLevelProperty = word.startColumn === 1;
    const { curLevelKeys } = findKeys(model, word, model.getLineCount());

    if (context.triggerCharacter === "<") {
      const fullWord = model.getValueInRange({
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: position.column - 2,
        endColumn: position.column + 2,
      });
      if (fullWord.trim() !== "<") {
        return {
          suggestions: [],
        };
      }
      return {
        suggestions: [
          {
            label: "<% %>",
            detail: "Evalute Body",
            kind: monaco.languages.CompletionItemKind.Value,
            insertText: "% ${0} %>",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
          },
          {
            label: "<%= %>",
            detail: "Track Evalute Body",
            kind: monaco.languages.CompletionItemKind.Value,
            insertText: "%= ${0} %>",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
          },
        ],
      };
    }

    if (isFirstLevelProperty) {
      return {
        suggestions: (completers ?? [])
          .filter((item) => !curLevelKeys.includes(item.label as string))
          .map((item) => ({
            ...item,
            label: item.label,
            insertText: item.insertText || (item.label as string),
            kind: monaco.languages.CompletionItemKind.Keyword,
            range,
          })),
      };
    }

    if (
      context.triggerCharacter === ":" ||
      (context.triggerCharacter === "." &&
        prefixWord &&
        !["CTX", "STATE", "FN"].concat(DSToken).includes(prefixWord))
    ) {
      if (prefixWord === "action" && context.triggerCharacter === ":") {
        const actions = get(
          storyboardJsonSchema,
          "definitions.BuiltinBrickEventHandler.properties.action.enum"
        );
        return {
          suggestions: ((actions as unknown as string[]) ?? [])?.map(
            (item) => ({
              label: ` ${item}`,
              detail: "event action",
              kind: monaco.languages.CompletionItemKind.Keyword,
              insertText: ` ${item}`,
              range,
            })
          ),
        };
      }
      const matchCompletion = advancedCompleters?.[prefixWord as string];
      let matchTriggerCharacter = "";
      let list: monaco.languages.CompletionItem[] | undefined;
      if (matchCompletion && !Array.isArray(matchCompletion)) {
        list = matchCompletion.completers;
        matchTriggerCharacter = matchCompletion.triggerCharacter;
      } else {
        list = matchCompletion;
      }
      if (
        matchTriggerCharacter
          ? context.triggerCharacter === matchTriggerCharacter && list
          : list
      ) {
        return {
          suggestions: (list ?? []).map((item) => {
            const label =
              matchTriggerCharacter === ":"
                ? ` ${item.label}`
                : (item.label as string);
            return {
              ...item,
              label: label,
              kind: monaco.languages.CompletionItemKind.Value,
              insertText: item.insertText || label,
              range,
            };
          }),
        };
      }
    }

    if (isInEvaluateBody(model, position)) {
      if (
        prefixWord &&
        ["CTX", "STATE"].concat(DSToken).includes(prefixWord) &&
        advancedCompleters
      ) {
        return {
          suggestions: (advancedCompleters[prefixWord]?.completers ?? []).map(
            (item) => ({
              label: item.label,
              insertText: item.label as string,
              kind: monaco.languages.CompletionItemKind.Value,
              range,
            })
          ),
        };
      }

      if (
        prefixWord === "FN" &&
        context.triggerCharacter === "." &&
        advancedCompleters
      ) {
        return {
          suggestions: (advancedCompleters["FN"]?.completers ?? []).map(
            (item) => ({
              label: item.label,
              insertText: item.label as string,
              kind: monaco.languages.CompletionItemKind.Value,
              range,
            })
          ),
        };
      }

      if (prefixWord === "APP" && context.triggerCharacter === ".") {
        const appProperties = get(
          storyboardJsonSchema,
          "definitions.MicroApp.properties"
        );
        const suggestions = [];
        for (const [k, v] of Object.entries(
          appProperties as unknown as Record<
            string,
            {
              description: string;
              type: string;
              enum: string[];
            }
          >
        )) {
          suggestions.push({
            label: k,
            kind: monaco.languages.CompletionItemKind.Value,
            documentation: v.description,
            detail: v.enum ? v.enum.join("|") : v.type,
            insertText: k,
            range,
          });
        }
        return {
          suggestions,
        };
      }

      if ([".", ":"].includes(prefixToken)) {
        return {
          suggestions: [],
        };
      }

      return {
        suggestions: EVALUATE_KEYWORD.map((item) => ({
          label: item,
          insertText: item,
          kind: monaco.languages.CompletionItemKind.Keyword,
          range,
        })),
      };
    }

    if (/^[\s|-]*\w$/.test(curLineWord)) {
      return {
        suggestions: brickNextKeywords
          .map((item) => ({
            label: item,
            insertText: item,
            kind: monaco.languages.CompletionItemKind.Keyword,
            range,
          }))
          .filter((item) => !curLevelKeys.includes(item.label as string)),
      };
    }

    return {
      suggestions: [],
    };
  };
};
