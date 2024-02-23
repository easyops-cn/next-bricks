import { getParseYaml } from "../utils/parseYaml.js";

self.onmessage = onMessage;

const parseYaml = await getParseYaml();

function onMessage(message: MessageEvent): void {
  const { token, data, id, init } = message.data;
  switch (token) {
    case "parse_yaml": {
      try {
        const result = parseYaml(data.value, data.links, data.markers);
        self.postMessage({
          token: "parse_yaml",
          data: result,
          id,
          init,
        });
      } catch {
        self.postMessage({
          token: "parse_yaml_error",
          id,
          init,
        });
      }
      break;
    }
  }
}
