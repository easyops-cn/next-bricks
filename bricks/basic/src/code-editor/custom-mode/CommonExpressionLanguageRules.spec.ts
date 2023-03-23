import {
  getCommonExpressionLanguageCompleterWords,
  getCommonExpressionLanguageRules,
} from "./CommonExpressionLanguageRules.js";
import { AceLanguageRule, AceTokenFunction } from "../interfaces.js";

describe("CommonExpressionLanguageRules", () => {
  it("should work", () => {
    const rules = getCommonExpressionLanguageRules();
    expect(
      Object.keys(rules).every((className) => !className.startsWith("cel-"))
    ).toBe(true);

    const keywordRule = rules.start.find(
      (rule) => typeof rule.token === "function"
    ) as AceLanguageRule;
    expect((keywordRule.token as AceTokenFunction)("has")).toBe(
      "support.function"
    );
    expect((keywordRule.token as AceTokenFunction)("req")).toBe("identifier");
  });

  it("should work for multi-line", () => {
    const rules = getCommonExpressionLanguageRules({
      yamlContext: "multi-line",
    });
    expect(
      Object.keys(rules).every((className) =>
        className.startsWith("cel-multi-line-")
      )
    ).toBe(true);

    const indentRule = rules["cel-multi-line-start"].find(
      (rule) => typeof rule.onMatch === "function"
    ) as AceLanguageRule;
    expect(indentRule.onMatch && indentRule.onMatch("    ", null, ["", 2])).toBe("indent");
    expect(indentRule.next).toBe("cel-multi-line-start");
    expect(indentRule.onMatch && indentRule.onMatch("  ", null, ["", 2])).toBe("indent");
    expect(indentRule.next).toBe("start");
  });

  it("should work for single-quoted", () => {
    const rules = getCommonExpressionLanguageRules({
      yamlContext: "single-quoted",
    });
    expect(
      Object.keys(rules).every((className) =>
        className.startsWith("cel-single-quoted-")
      )
    ).toBe(true);
  });

  it("should work for double-quoted", () => {
    const rules = getCommonExpressionLanguageRules({
      yamlContext: "double-quoted",
    });
    expect(
      Object.keys(rules).every((className) =>
        className.startsWith("cel-double-quoted-")
      )
    ).toBe(true);
  });
});

describe("getCommonExpressionLanguageCompleterWords", () => {
  it("should work", () => {
    const words = getCommonExpressionLanguageCompleterWords();
    expect(words.length).toBeGreaterThan(0);
    expect(words.every((word) => typeof word === "string" && word)).toBe(true);
  });
});
