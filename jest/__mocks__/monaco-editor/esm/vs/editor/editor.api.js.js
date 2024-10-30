export const editor = {
  create(_container, options) {
    return new Editor(options);
  },
  setModelLanguage: jest.fn(),
  createModel: jest.fn(() => ({
    dispose: jest.fn(),
    onDidChangeContent: jest.fn(() => ({
      dispose: jest.fn(),
    })),
  })),
  setModelMarkers: jest.fn(),
  setTheme: jest.fn(),
  defineTheme: jest.fn(),
};

export const languages = {
  typescript: {
    javascriptDefaults: {
      addExtraLib: jest.fn(() => ({
        dispose: jest.fn(),
      })),
      setCompilerOptions: jest.fn(),
      setDiagnosticsOptions: jest.fn(),
    },
    typescriptDefaults: {
      addExtraLib: jest.fn(() => ({
        dispose: jest.fn(),
      })),
      setCompilerOptions: jest.fn(),
      setDiagnosticsOptions: jest.fn(),
    },
    ModuleResolutionKind: {
      NodeJs: "NodeJs",
    },
  },
  register: jest.fn(),
  setLanguageConfiguration: jest.fn(),
  setMonarchTokensProvider: jest.fn(),
  registerCompletionItemProvider: jest.fn(),
  IndentAction: {},
};

export const Uri = {
  parse: jest.fn(),
  file: (path) => `file:///${path}`,
};

class Editor {
  constructor(options) {
    this._model = options.model;
  }

  _model;

  getModel = () => {
    return this._model;
  };

  updateOptions = jest.fn();

  createDecorationsCollection() {
    return {
      set: jest.fn(),
    };
  }

  getContentHeight() {
    return 200;
  }

  onDidChangeModelContent() {
    return { dispose: jest.fn() };
  }

  onDidContentSizeChange() {
    return { dispose: jest.fn() };
  }

  layout = jest.fn();

  dispose = jest.fn();

  _codeEditorService = {
    openCodeEditor: jest.fn(),
  };
}

export const Range = {
  containsRange(a, b) {
    return (
      (a.startLineNumber < b.startLineNumber ||
        (a.startLineNumber === b.startLineNumber &&
          a.startColumn <= b.startColumn)) &&
      (a.endLineNumber > b.endLineNumber ||
        (a.endLineNumber === b.endLineNumber && a.endColumn >= b.endColumn))
    );
  },
};
