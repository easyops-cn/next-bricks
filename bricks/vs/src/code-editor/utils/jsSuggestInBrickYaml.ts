import storyboardJsonSchema from "@next-core/types/storyboard.json";
import { get } from "lodash";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import { builtInKeywordDeclare } from "./constants.js";

interface BlockContext {
  offset?: number;
}

export function getEmbeddedJavascriptUri(
  value: monaco.editor.IModel | monaco.Uri
) {
  if ("uri" in value) {
    value = value.uri;
  }
  return monaco.Uri.parse(value.toString() + ".ts");
}

// istanbul ignore next
export async function provideJsSuggestItems(
  model: monaco.editor.ITextModel,
  position: monaco.Position,
  embeddedContext: BlockContext
) {
  const workerGetter = await monaco.languages.typescript.getJavaScriptWorker();
  const worker = await workerGetter(model.uri);
  const javascriptModel = monaco.editor.getModel(
    getEmbeddedJavascriptUri(model)
  );

  const endOffset = model.getOffsetAt(position);
  const starOffset = embeddedContext?.offset ?? 0;

  const offset = endOffset - starOffset;

  const info = await worker.getCompletionsAtPosition(
    javascriptModel!.uri.toString(),
    offset!
  );

  const wordInfo = model.getWordUntilPosition(position);

  const wordRange = new monaco.Range(
    position.lineNumber,
    wordInfo.startColumn,
    position.lineNumber,
    wordInfo.endColumn
  );

  const suggestions = (info?.entries ?? []).map((entry: any) => {
    let range = wordRange;

    if (entry.replacementSpan) {
      const p1 = model.getPositionAt(entry.replacementSpan.start);
      const p2 = model.getPositionAt(
        entry.replacementSpan.start + entry.replacementSpan.length
      );
      range = new monaco.Range(
        p1.lineNumber,
        p1.column,
        p2.lineNumber,
        p2.column
      );
    }

    return {
      uri: javascriptModel!.uri,
      position: position,
      offset: offset,
      range: range,
      label: entry.name,
      insertText: entry.name,
      sortText: entry.sortText,
      kind: monaco.languages.CompletionItemKind.Property,
    };
  });

  return suggestions;
}

export function getMicroAppDeclare() {
  const appProperties = get(
    storyboardJsonSchema,
    "definitions.MicroApp.properties"
  ) as unknown as Record<string, { type: string }>;

  const fields = [];
  for (const [k, v] of Object.entries(appProperties)) {
    fields.push(`const ${k}: ${v.type ?? "any"}`);
  }

  return `
  declare namespace APP {
    ${fields.join("\n")}
  }
  `;
}

export function getBrickYamlBuiltInDeclare() {
  return [getMicroAppDeclare(), builtInKeywordDeclare].join("\n");
}
