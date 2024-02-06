import type { State } from "js-yaml";
import isEqual from "lodash/isEqual.js";

export interface Token {
  startLineNumber: number;
  endLineNumber: number;
  startColumn: number;
  endColumn: number;
  source: string;
  isString?: boolean;
}

class BrickNextYamlSourceMap {
  #recordsToken: Token[];
  #prefixPosition: number;
  #recordLastWord: string;
  #isString: boolean = false;

  constructor() {
    this.#recordsToken = [];
    this.#prefixPosition = 0;
    this.#recordLastWord = "";
  }

  #isEvaluable(result: string): boolean {
    return (
      typeof result === "string" &&
      /^\s*<%[~=]?\s/.test(result) &&
      /\s%>\s*$/.test(result)
    );
  }

  private handleState(event: "open" | "close", state: State): void {
    if (event === "close") {
      const { line, position, lineStart, result } = state;
      if (!this.#isString) {
        const curWord = state.input.substring(lineStart, position);
        if (curWord.trim() === this.#recordLastWord.trim()) return;
        this.#recordLastWord = curWord;
      }
      if (this.#isEvaluable(result)) {
        let source = result;
        let startLineNumber = this.#isString ? 1 : line + 1;
        let endLineNumber = this.#isString ? line : line + 1;
        let startColumn = this.#isString
          ? 0
          : position - lineStart - result.length;
        let endColumn = this.#isString
          ? position
          : position - lineStart - state.lineIndent;
        const wrapLength = result.match(/\n/g)?.length;
        if (wrapLength) {
          let nearWrapIndex = this.#prefixPosition;
          for (let i = this.#prefixPosition; i < state.input.length; i++) {
            if (state.input[i] === "\n") {
              nearWrapIndex = i + 1;
              break;
            }
          }
          const specilStringPrefix = /(\|-|>-)/.test(
            state.input.substring(this.#prefixPosition, position - 1)
          );
          source = state.input.substring(nearWrapIndex, position - 1);
          startLineNumber =
            state.line - wrapLength + 1 - Number(specilStringPrefix);
          endLineNumber = line;
          startColumn = 0;
          endColumn = 0;
        }
        const token = {
          source,
          startLineNumber,
          endLineNumber,
          startColumn,
          endColumn,
          isString: ['"', "'"].includes(
            state.input[lineStart + startColumn - 2]
          ),
        };
        !this.#recordsToken.find((item) => isEqual(item, token)) &&
          this.#recordsToken.push(token);
      }
      this.#prefixPosition = position;
    }
  }

  public listen(isString: boolean = false) {
    this.#isString = isString;
    return this.handleState.bind(this);
  }

  public getTokens = () => {
    return this.#recordsToken;
  };
}

export default BrickNextYamlSourceMap;
