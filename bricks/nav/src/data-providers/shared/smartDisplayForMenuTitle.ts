import type { MicroApp } from "@next-core/types";
import { i18n } from "@next-core/i18n";
import { hasOwnProperty } from "@next-core/utils/general";
import {
  cook,
  isEvaluable,
  preevaluate,
  type PreevaluateResult,
} from "@next-core/cook";
import { supply } from "@next-core/supply";
import {
  beforeVisitGlobalMember,
  type MemberUsageInExpressions,
} from "@next-core/utils/storyboard";

const allowedAppProps = new Set(["name", "id", "homepage", "localeName"]);

/**
 * 对菜单标题进行表达式解析，支持 I8N 和 APP。
 */
export function smartDisplayForMenuTitle(
  title: unknown,
  i18nNamespace: string | undefined,
  overrideApp: MicroApp | undefined
): string | undefined {
  if (typeof title !== "string") {
    return;
  }
  if (isEvaluable(title)) {
    // A `SyntaxError` maybe thrown.
    let precooked: PreevaluateResult | undefined;
    const appUsage: MemberUsageInExpressions = {
      usedProperties: new Set(),
      hasNonStaticUsage: false,
    };
    try {
      precooked = preevaluate(title, {
        withParent: true,
        hooks: {
          beforeVisitGlobal: beforeVisitGlobalMember(appUsage, ["APP"]),
        },
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Parse menu title expression "${title}" failed:`, error);
    }

    if (
      precooked &&
      (!precooked.attemptToVisitGlobals.has("APP") ||
        (overrideApp &&
          !appUsage.hasNonStaticUsage &&
          [...appUsage.usedProperties].every((prop) =>
            allowedAppProps.has(prop)
          )))
    ) {
      const globals: Record<string, unknown> = {};
      for (const key of precooked.attemptToVisitGlobals) {
        switch (key) {
          case "I18N":
            globals[key] = i18n.getFixedT(
              null,
              [i18nNamespace].filter(Boolean)
            );
            break;
          case "APP":
            globals[key] = {
              ...overrideApp,
              localeName: overrideApp?.name,
            };
            break;
        }
      }
      const suppliedGlobals = supply(precooked.attemptToVisitGlobals, globals);

      let computable = true;
      for (const key of precooked.attemptToVisitGlobals) {
        if (!hasOwnProperty(suppliedGlobals, key)) {
          computable = false;
          break;
        }
      }

      if (computable) {
        try {
          const result = cook(precooked.expression, precooked.source, {
            globalVariables: suppliedGlobals,
          });
          if (typeof result === "string") {
            return result;
          }
          // eslint-disable-next-line no-console
          console.error(
            `The result of menu title expression "${title}" is not a string:`,
            result
          );
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error(
            `Evaluate menu title expression "${title}" failed:`,
            error
          );
        }
      }
    }
  }
  return title;
}
