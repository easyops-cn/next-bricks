import { traverseStoryboardExpressions } from "@next-core/utils/storyboard";
import { isEvaluable, type EstreeLiteral } from "@next-core/cook";
import type { SpreadElement } from "@babel/types";

const I18N = "I18N";

/**
 * Get smart display for a string property, which may be an evaluation.
 *
 * This is useful for brick editors to display specific property configurations.
 *
 * E.g., for a button brick editor, display it by
 * `smartDisplayForEvaluableString(btn.$$parsedProperties.buttonName, btn.alias, "<% … %>")`.
 *
 * @param rawString - Raw string value.
 * @param nonStringFallback - Fallback value if it's not a string.
 * @param unknownEvaluationFallback - Fallback value if it's an unknown evaluation.
 *
 * @returns
 *
 * Returns the nonStringFallback if the input is not a string and nonStringFallback is present.
 *
 * Or returns the raw input when nonStringFallback no presents.
 *
 * Returns the I18N default value (or key if no value found)
 * if it is an evaluation and contains one and only one I18N key.
 *
 * Or returns the unknownEvaluationFallback if it is an unknown evaluation string and
 * unknownEvaluationFallback presents.
 *
 * Or returns the raw input otherwise.
 */
export function smartDisplayForEvaluableString<T, U, V>(
  rawString: T,
  nonStringFallback?: U,
  unknownEvaluationFallback?: V
): T | U | V | string {
  if (typeof rawString !== "string") {
    // Catch on `undefined` or `null`.
    if (nonStringFallback != undefined) {
      return nonStringFallback;
    }
    return rawString;
  }
  if (isEvaluable(rawString)) {
    const defaults = new Set<string>();
    const keys = new Set<string>();

    traverseStoryboardExpressions(
      rawString,
      (node, parent) => {
        if (node.name === I18N) {
          const callParent = parent[parent.length - 1];
          if (
            callParent?.node.type === "CallExpression" &&
            callParent?.key === "callee"
          ) {
            const args = callParent.node.arguments as unknown as (
              | SpreadElement
              | EstreeLiteral
            )[];

            if (args.length > 0) {
              const firstArg = args[0];
              if (
                firstArg.type === "Literal" &&
                typeof firstArg.value === "string"
              ) {
                keys.add(firstArg.value);
              }
            }

            if (args.length > 1 && args[0].type !== "SpreadElement") {
              const secondArg = args[1];
              if (
                secondArg.type === "Literal" &&
                typeof secondArg.value === "string"
              ) {
                defaults.add(secondArg.value);
              }
            }
          }
        }
      },
      I18N
    );

    if (defaults.size === 1) {
      return [...defaults][0];
    }

    if (keys.size === 1) {
      return [...keys][0];
    }

    // Catch on `undefined` or `null`.
    if (unknownEvaluationFallback != undefined) {
      return unknownEvaluationFallback;
    }
  }

  return rawString;
}
