import { lintYaml, type LintRequest } from "./lintYaml";

self.addEventListener("message", async (event: MessageEvent<LintRequest>) => {
  const response = await lintYaml(event.data);

  self.postMessage(response);
});
