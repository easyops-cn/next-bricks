import { createProviderClass } from "@next-core/utils/general";
import { brickCommandsConf } from "../data-providers/data/bricks/index.js";
import { BrickCommandConf } from "../data-providers/data/bricks/interfaces.js";

export async function getBrickCustomCommands(): Promise<BrickCommandConf[]> {
  return brickCommandsConf;
}

customElements.define(
  "ui-test.get-brick-custom-commands",
  createProviderClass(getBrickCustomCommands)
);
