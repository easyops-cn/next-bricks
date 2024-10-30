import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import {
  celCommonCompletionProviderFactory,
  celSpecificCompletionProviderFactory,
  provideEmbeddedCelCompletionItems,
} from "./celCompletionProvider";
import { setEditorId } from "./editorId";
import type { MixedCompleter } from "../interfaces";

jest.mock("monaco-editor/esm/vs/editor/editor.api.js", () => ({
  ...jest.requireActual("monaco-editor/esm/vs/editor/editor.api.js"),
}));

describe("provideEmbeddedCelCompletionItems", () => {
  const model = monaco.editor.createModel(
    "a: <\nb: <% < %>\nc: '<'\nd: -<",
    "yaml"
  );

  test("basic usage", () => {
    const { suggestions } = provideEmbeddedCelCompletionItems(
      model,
      new monaco.Position(1, 5),
      { triggerKind: 0, triggerCharacter: "<" }
    );
    expect(suggestions).toEqual([
      expect.objectContaining({
        label: "<%  %>",
      }),
    ]);
  });

  test("with quotes", () => {
    const { suggestions } = provideEmbeddedCelCompletionItems(
      model,
      new monaco.Position(3, 6),
      { triggerKind: 0, triggerCharacter: "<" }
    );
    expect(suggestions.length).toBe(1);
  });

  test("non < trigger", () => {
    const { suggestions } = provideEmbeddedCelCompletionItems(
      model,
      new monaco.Position(1, 3),
      { triggerKind: 0, triggerCharacter: "." }
    );
    expect(suggestions.length).toBe(0);
  });

  test("inside embedded", () => {
    const { suggestions } = provideEmbeddedCelCompletionItems(
      model,
      new monaco.Position(2, 8),
      { triggerKind: 0, triggerCharacter: "<" }
    );
    expect(suggestions.length).toBe(0);
  });

  test("nearby not match", () => {
    const { suggestions } = provideEmbeddedCelCompletionItems(
      model,
      new monaco.Position(4, 6),
      { triggerKind: 0, triggerCharacter: "<" }
    );
    expect(suggestions.length).toBe(0);
  });
});

describe("celCommonCompletionProviderFactory", () => {
  const celProvider = celCommonCompletionProviderFactory("cel");
  const celYamlProvider = celCommonCompletionProviderFactory("cel_yaml");
  const celYamlModel = monaco.editor.createModel("a: <% s %>", "yaml");
  const celModel = monaco.editor.createModel(
    "s.\nstep.\ns.a\nrequest.u",
    "yaml"
  );

  test("constants", async () => {
    const result = await celProvider.provideCompletionItems(
      celModel,
      new monaco.Position(1, 3),
      { triggerKind: 0, triggerCharacter: "." },
      null!
    );
    expect(result?.suggestions).toContainEqual(
      expect.objectContaining({
        label: "all",
      })
    );
  });

  test("member of constants", async () => {
    const result = await celProvider.provideCompletionItems(
      celModel,
      new monaco.Position(2, 6),
      { triggerKind: 0, triggerCharacter: "." },
      null!
    );
    expect(result?.suggestions.length).toBe(0);
  });

  test("non . trigger", async () => {
    const result = await celProvider.provideCompletionItems(
      celModel,
      new monaco.Position(3, 4),
      { triggerKind: 0, triggerCharacter: undefined },
      null!
    );
    expect(result?.suggestions).toContainEqual(
      expect.objectContaining({
        label: "all",
      })
    );
  });

  test("non . trigger", async () => {
    const result = await celProvider.provideCompletionItems(
      celModel,
      new monaco.Position(4, 10),
      { triggerKind: 0, triggerCharacter: undefined },
      null!
    );
    expect(result?.suggestions).toContainEqual(
      expect.objectContaining({
        label: "uri",
      })
    );
  });

  test("constants in cel_yaml", async () => {
    const result = await celYamlProvider.provideCompletionItems(
      celYamlModel,
      new monaco.Position(1, 8),
      { triggerKind: 0, triggerCharacter: undefined },
      null!
    );
    expect(result?.suggestions).toContainEqual(
      expect.objectContaining({
        label: "step",
      })
    );
  });

  test("non inside embedded in cel_yaml", async () => {
    const result = await celYamlProvider.provideCompletionItems(
      celYamlModel,
      new monaco.Position(1, 2),
      { triggerKind: 0, triggerCharacter: undefined },
      null!
    );
    expect(result?.suggestions.length).toBe(0);
  });
});

describe("celSpecificCompletionProviderFactory", () => {
  const editorId = "editor-0";
  const completers: MixedCompleter[] = [
    {
      type: "members",
      members: {
        step: ["firstStep"],
      },
    },
  ];
  const celProvider = celSpecificCompletionProviderFactory(
    "cel",
    editorId,
    completers
  );
  const celYamlProvider = celSpecificCompletionProviderFactory(
    "cel_yaml",
    editorId,
    completers
  );
  const celYamlModel = monaco.editor.createModel("a: <% step. %>", "yaml");
  const celModel = monaco.editor.createModel("step.\nrequest.\n.", "yaml");

  beforeEach(() => {
    setEditorId(editorId);
  });

  test("members", async () => {
    const result = await celProvider.provideCompletionItems(
      celModel,
      new monaco.Position(1, 6),
      { triggerKind: 0, triggerCharacter: "." },
      null!
    );
    expect(result?.suggestions).toContainEqual(
      expect.objectContaining({
        label: "firstStep",
      })
    );
  });

  test("non . trigger", async () => {
    const result = await celProvider.provideCompletionItems(
      celModel,
      new monaco.Position(1, 6),
      { triggerKind: 0, triggerCharacter: undefined },
      null!
    );
    expect(result?.suggestions).toContainEqual(
      expect.objectContaining({
        label: "firstStep",
      })
    );
  });

  test("non . trigger, not at .", async () => {
    const result = await celProvider.provideCompletionItems(
      celModel,
      new monaco.Position(1, 5),
      { triggerKind: 0, triggerCharacter: undefined },
      null!
    );
    expect(result?.suggestions.length).toBe(0);
  });

  test("no matched members", async () => {
    const result = await celProvider.provideCompletionItems(
      celModel,
      new monaco.Position(2, 9),
      { triggerKind: 0, triggerCharacter: "." },
      null!
    );
    expect(result?.suggestions.length).toBe(0);
  });

  test("no previous word", async () => {
    const result = await celProvider.provideCompletionItems(
      celModel,
      new monaco.Position(3, 2),
      { triggerKind: 0, triggerCharacter: "." },
      null!
    );
    expect(result?.suggestions.length).toBe(0);
  });

  test("members in cel_yaml", async () => {
    const result = await celYamlProvider.provideCompletionItems(
      celYamlModel,
      new monaco.Position(1, 12),
      { triggerKind: 0, triggerCharacter: "." },
      null!
    );
    expect(result?.suggestions).toContainEqual(
      expect.objectContaining({
        label: "firstStep",
      })
    );
  });

  test("non inside embedded in cel_yaml", async () => {
    const result = await celYamlProvider.provideCompletionItems(
      celYamlModel,
      new monaco.Position(1, 2),
      { triggerKind: 0, triggerCharacter: undefined },
      null!
    );
    expect(result?.suggestions.length).toBe(0);
  });
});
