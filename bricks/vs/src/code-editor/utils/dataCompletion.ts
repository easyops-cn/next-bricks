import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";

import { DataModelField, DataDefinition } from "../interfaces.js";

type DataTypeConstructor =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | ArrayConstructor;

// 契约的定义的普通字段类型
export const contractSimpleField = ["string", "bool", "int", "int64", "float"];

// 契约字段类型转为普通类型
export const ContractTypeToNormalType: Record<
  (typeof contractSimpleField)[number],
  string
> = {
  string: "string",
  bool: "boolean",
  int: "number",
  int64: "number",
  float: "number",
};

function getSuggestionsOfDataType(
  constructor: DataTypeConstructor,
  range: monaco.Range
): monaco.languages.CompletionItem[] {
  return Object.getOwnPropertyNames(constructor.prototype).map((prop) => {
    const isFn =
      typeof constructor.prototype[
        prop as keyof typeof constructor.prototype
      ] === "function";

    return {
      label: prop,
      insertText: prop,
      kind: isFn
        ? monaco.languages.CompletionItemKind.Method
        : monaco.languages.CompletionItemKind.Property,
      detail: `(${isFn ? "function" : "property"})`,
      range,
    };
  });
}

/**
 *
 * @description 根据契约定义返回具体属性列表
 */
export function getDataMemberSuggestions(
  parentsWords: string[],
  dataDefinitions: DataModelField[],
  range: monaco.Range
): monaco.languages.CompletionItem[] {
  let fieldInfo;
  let dataDefinition: DataDefinition | undefined;

  for (let i = 0; i < parentsWords.length; i++) {
    const word = parentsWords[i];
    const isPropArray = /\[\d+\]$/.test(word);
    const exactWord = word.replace(/\[\d+\]$/, "");

    if (i === 0) {
      dataDefinition = dataDefinitions.find(
        (item) => item.name === exactWord
      )?.dataDefinition;
    } else {
      dataDefinition = dataDefinition?.fields?.find(
        (item) => item.name === exactWord
      );
    }
    if (!dataDefinition) return [];

    if (isPropArray) {
      if (dataDefinition?.type?.endsWith("[]")) {
        const exactType = dataDefinition?.type.replace("[]", "");

        fieldInfo = contractSimpleField.includes(exactType)
          ? { type: ContractTypeToNormalType[exactType] }
          : { type: "object", fields: dataDefinition?.fields };
      } else {
        fieldInfo = dataDefinition?.type === "string" ? { type: "string" } : {};
      }
    } else {
      if (dataDefinition?.type?.endsWith("[]")) {
        fieldInfo = { type: "array" };
      } else {
        if (contractSimpleField.includes(dataDefinition?.type as string)) {
          fieldInfo = {
            type: ContractTypeToNormalType[dataDefinition?.type],
          };
        } else {
          fieldInfo = { type: "object", fields: dataDefinition?.fields };
        }
      }
    }
  }

  switch (fieldInfo?.type) {
    case "string":
      return getSuggestionsOfDataType(String, range);
    case "number":
      return getSuggestionsOfDataType(Number, range);
    case "boolean":
      return getSuggestionsOfDataType(Boolean, range);
    case "array":
      return getSuggestionsOfDataType(Array, range);
    case "object":
      return fieldInfo.fields?.map((item) => ({
        label: item.name,
        insertText: item.name,
        kind: monaco.languages.CompletionItemKind.Property,
        range,
      })) as monaco.languages.CompletionItem[];
    default:
      return [];
  }
}
