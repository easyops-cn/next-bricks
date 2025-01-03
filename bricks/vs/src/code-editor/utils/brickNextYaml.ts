import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import { brickNextKeywords } from "./constants.js";
import { getEditorId } from "./editorId.js";
import { TokenConfig } from "../index.jsx";
import { AdvancedCompleterMap } from "../interfaces.js";
import { provideJsSuggestItems } from "../utils/jsSuggestInBrickYaml.js";
import { EmbeddedModelContext } from "../utils/embeddedModelState.js";
import builtinActions from "../../generated-actions.js";

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
      const [, wordSpace, key] = matchWord;
      if (wordSpace.length === range.startColumn - 1) {
        curLevelKeys.unshift(key);
      }
      if (wordSpace.length < startColumn - 1) {
        !parentKey && (parentKey = key);
        startColumn = wordSpace.length;
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
  tokenConfig: TokenConfig | undefined
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
  if (tokenConfig?.showDSKey && prefixWord?.word === "DS") {
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

const isInEvaluateBody = (
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

  const prefixRange = prefixEvaluateOperator?.range;
  const suffixRange = suffixEvaluateOperator?.range;

  const isInEvaluateBody =
    prefixRange?.startLineNumber &&
    suffixRange?.startLineNumber &&
    prefixRange.startLineNumber <= position.lineNumber &&
    suffixRange.endLineNumber >= position.lineNumber &&
    // 正确匹配当前表达式，防止匹配到上一个表达式<%的开始，下一个表达式的结尾%>
    !model.findMatches(
      "<%|%>",
      new monaco.Range(
        prefixRange.endLineNumber,
        prefixRange.endColumn,
        suffixRange.startLineNumber,
        suffixRange.startColumn
      ),
      true,
      false,
      null,
      true
    )?.length;

  if (isInEvaluateBody) {
    const { parentKey: prefixParentKey } = findKeys(
      model,
      prefixRange,
      prefixRange.startLineNumber
    );
    const { parentKey: suffixParentKey } = findKeys(
      model,
      suffixRange,
      suffixRange.startLineNumber
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
  advancedCompleters: AdvancedCompleterMap = {},
  id: string,
  tokenConfig: TokenConfig | undefined
) => {
  return async (
    model: monaco.editor.ITextModel,
    position: monaco.Position,
    context: monaco.languages.CompletionContext
  ): Promise<
    monaco.languages.ProviderResult<monaco.languages.CompletionList>
  > => {
    if (id && id !== getEditorId())
      return {
        suggestions: [],
      };
    const DSToken = tokenConfig?.showDSKey ? ["CTX.DS", "DS"] : [];
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
      if (!/^(['"]?)<\1$/.test(fullWord.trim())) {
        return {
          suggestions: [],
        };
      }
      return {
        suggestions: [
          {
            label: "<% %>",
            detail: "Expression body",
            kind: monaco.languages.CompletionItemKind.Value,
            insertText: "% ${0} %>",
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: range,
          },
          {
            label: "<%= %>",
            detail: "Track expression body",
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
        return {
          suggestions: builtinActions.map((item) => ({
            label: ` ${item}`,
            detail: "event action",
            kind: monaco.languages.CompletionItemKind.Keyword,
            insertText: ` ${item}`,
            range,
          })),
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

    if (isInEvaluateBody(model, position) && prefixToken !== ":") {
      const embeddedContext = EmbeddedModelContext.getInstance(id);

      const suggestions = await provideJsSuggestItems(
        model,
        position,
        embeddedContext.getState()
      );

      return {
        suggestions,
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
