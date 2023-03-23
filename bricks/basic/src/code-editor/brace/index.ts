let pluginsForCodeEditorLoaded = false;

export function loadPluginsForCodeEditor(): void {
  if (pluginsForCodeEditorLoaded) {
    return;
  }
  pluginsForCodeEditorLoaded = true;
  require("brace/ext/language_tools");
  require("brace/mode/json");
  require("brace/mode/yaml");
  require("brace/mode/text");
  require("brace/mode/sh");
  require("brace/mode/javascript");
  require("brace/mode/typescript");
  require("brace/mode/markdown");
  require("brace/mode/python");
  require("brace/mode/java");
  require("brace/mode/xml");
  require("brace/mode/mysql");
  require("brace/mode/golang");
  require("brace/theme/tomorrow");
  require("brace/theme/github");
  require("brace/theme/monokai");
}
