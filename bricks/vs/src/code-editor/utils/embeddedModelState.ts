interface Range {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

export interface EmbeddedState {
  content?: string;
  offset?: number;
  range?: Range;
}

export class EmbeddedModelContext {
  static #instance: Record<string, EmbeddedModelContext> = {};
  #id: string;
  #state: EmbeddedState = {};

  static getInstance(id: string) {
    if (!this.#instance[id]) {
      this.#instance[id] = new EmbeddedModelContext(id);
    }
    return this.#instance[id];
  }

  constructor(id: string) {
    this.#id = id;
  }

  updateState(state: EmbeddedState) {
    this.#state = state;
  }

  getState(): EmbeddedState {
    return this.#state;
  }
}
