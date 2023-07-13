import type { State } from "js-yaml";
import { isEqual } from "lodash";

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

  constructor() {
    this.#recordsToken = [];
    this.#prefixPosition = 0;
    this.#recordLastWord = "";
  }

  private handleState(event: "open" | "close", state: State): void {
    if (event === "close") {
      const { line, position, lineStart, result } = state;
      const curWord = state.input.substring(lineStart, position);
      if (curWord.trim() === this.#recordLastWord.trim()) return;
      this.#recordLastWord = curWord;
      let startLineNumber = line + 1;
      let endLineNumber = line + 1;
      let startColumn = position - lineStart - result.length;
      let endColumn = position - lineStart - state.lineIndent;
      if (
        typeof result === "string" &&
        /^\s*<%[~=]?\s/.test(result) &&
        /\s%>\s*$/.test(result)
      ) {
        let source = result;
        const wrapLength = result.match(/\n/g)?.length;
        if (wrapLength) {
          let nearWrapIndex = this.#prefixPosition;
          for (let i = this.#prefixPosition; i < state.input.length; i++) {
            if (state.input[i] === "\n") {
              nearWrapIndex = i + 1;
              break;
            }
          }
          source = state.input.substring(nearWrapIndex, position - 1);
          startLineNumber = state.line - wrapLength + 1;
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

  public listen() {
    return this.handleState.bind(this);
  }

  public getTokens = () => {
    return this.#recordsToken;
  };
}

export default BrickNextYamlSourceMap;
