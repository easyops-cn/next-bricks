import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import { hasOwnProperty } from "@next-core/utils/general";
import { constants, instanceMembers } from "../languages/cel";
import { getEditorId } from "./editorId";
import { isInEmbedded } from "./isInEmbedded";
import type { MixedCompleter } from "../interfaces";

const BUILTIN_MEMBERS: Record<string, string[]> = {
  request: ["uri", "query", "header", "body"],
};

/**
 * When user types "<", provide the completion item "<% | %>",
 * in which, `|` represents the position of the cursor.
 */
export function provideEmbeddedCelCompletionItems(
  model: monaco.editor.ITextModel,
  position: monaco.Position,
  context: monaco.languages.CompletionContext
): monaco.languages.CompletionList {
  if (context.triggerCharacter !== "<" || isInEmbedded(model, position)) {
    return getEmptySuggestions();
  }

  // Handle: <|
  // Or: "<|"
  // Or: '<|'
  const nearby = model.getValueInRange({
    startLineNumber: position.lineNumber,
    startColumn: position.column - 2,
    endLineNumber: position.lineNumber,
    endColumn: position.column + 1,
  });
  if (!/^(['"]?)<\1$/.test(nearby.trim())) {
    return getEmptySuggestions();
  }

  const word = model.getWordUntilPosition(position);
  const range = {
    startLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    endLineNumber: position.lineNumber,
    endColumn: word.endColumn,
  };

  return {
    suggestions: [
      {
        label: "<%  %>",
        detail: "CEL body",
        kind: monaco.languages.CompletionItemKind.Value,
        insertText: "% ${0} %>",
        insertTextRules:
          monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      },
    ],
  };
}

/**
 * Provide common completion items for CEL language.
 * Such as `size` and `base64`.
 */
export function celCommonCompletionProviderFactory(
  lang: string
): monaco.languages.CompletionItemProvider {
  return {
    triggerCharacters: ["."],
    provideCompletionItems(model, position, context) {
      if (lang !== "cel" && !isInEmbedded(model, position)) {
        return getEmptySuggestions();
      }

      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endLineNumber: position.lineNumber,
        endColumn: word.endColumn,
      };

      const previousWord = model.getWordUntilPosition(
        new monaco.Position(position.lineNumber, word.startColumn - 1)
      );

      // Handle: foo.|
      // Or: foo.x|
      if (
        context.triggerCharacter === "." ||
        model
          .getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: previousWord.endColumn,
            endLineNumber: position.lineNumber,
            endColumn: word.startColumn,
          })
          .trim() === "."
      ) {
        const completer =
          previousWord.word &&
          hasOwnProperty(BUILTIN_MEMBERS, previousWord.word)
            ? BUILTIN_MEMBERS[previousWord.word]
            : undefined;

        if (completer) {
          return {
            suggestions: completer.map((label) => ({
              label,
              insertText: label,
              kind: monaco.languages.CompletionItemKind.Method,
              range,
            })),
          };
        }

        // Do not provide member suggestions for constants.
        if ((constants as readonly string[]).includes(previousWord.word)) {
          return getEmptySuggestions();
        }

        return {
          suggestions: instanceMembers.map((label) => ({
            label,
            insertText: label,
            kind: monaco.languages.CompletionItemKind.Method,
            range,
          })),
        };
      }

      // Handle: x|
      return {
        suggestions: constants.map((label) => ({
          label,
          insertText: label,
          kind: monaco.languages.CompletionItemKind.Keyword,
          range,
        })),
      };
    },
  };
}

/**
 * Provide specific completion items for CEL language.
 * Such as `step.*`
 */
export function celSpecificCompletionProviderFactory(
  lang: string,
  id: string,
  completers: MixedCompleter[]
): monaco.languages.CompletionItemProvider {
  return {
    triggerCharacters: ["."],
    provideCompletionItems(model, position, context) {
      if (
        id !== getEditorId() ||
        (lang !== "cel" && !isInEmbedded(model, position))
      ) {
        return getEmptySuggestions();
      }

      const word = model.getWordUntilPosition(position);
      const previousWord = model.getWordUntilPosition(
        new monaco.Position(position.lineNumber, word.startColumn - 1)
      );

      if (
        context.triggerCharacter !== "." &&
        model
          .getValueInRange({
            startLineNumber: position.lineNumber,
            startColumn: previousWord.endColumn,
            endLineNumber: position.lineNumber,
            endColumn: word.startColumn,
          })
          .trim() !== "."
      ) {
        return getEmptySuggestions();
      }

      let members: string[] | undefined;
      if (previousWord.word) {
        for (const completer of completers) {
          if (
            completer.type === "members" &&
            hasOwnProperty(completer.members, previousWord.word)
          ) {
            members = completer.members[previousWord.word];
          }
        }
      }

      if (!members) {
        return getEmptySuggestions();
      }

      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      return {
        suggestions: members.map((label) => ({
          label,
          insertText: label,
          kind: monaco.languages.CompletionItemKind.Method,
          range,
        })),
      };
    },
  };
}

function getEmptySuggestions(): monaco.languages.CompletionList {
  return { suggestions: [] };
}
