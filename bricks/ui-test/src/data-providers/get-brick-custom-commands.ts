import { createProviderClass } from "@next-core/utils/general";
import { brickCommandsConf, BrickCommandConf } from "@next-shared/ui-test";

export async function getBrickCustomCommands(): Promise<BrickCommandConf[]> {
  return brickCommandsConf;
}

customElements.define(
  "ui-test.get-brick-custom-commands",
  createProviderClass(getBrickCustomCommands)
);
