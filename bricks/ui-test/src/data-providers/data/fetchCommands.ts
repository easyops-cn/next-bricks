import type { CommandDoc } from "../../interface.js";
import getCustomCommands from "./commands/custom.js";
import getCypressCommands from "./commands/cypress.js";
import getThirdPartyCommands from "./commands/third-party.js";

export default function fetchCommands() {
  return Promise.resolve<CommandDoc[]>([
    ...getCypressCommands(),
    ...getThirdPartyCommands(),
    ...getCustomCommands(),
  ]);
}
