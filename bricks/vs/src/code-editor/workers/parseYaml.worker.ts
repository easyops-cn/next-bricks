import { getParseYaml } from "../utils/parseYaml.js";

self.onmessage = onMessage;

let parseYaml: any;

async function onMessage(message: MessageEvent): Promise<void> {
  const { token, data, id, options, init } = message.data;
  if (!parseYaml) {
    parseYaml = await getParseYaml(options);
  }
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
