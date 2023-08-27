import { createProviderClass } from "@next-core/utils/general";
import fetchCommands from "./data/fetchCommands.js";
import { CommandDoc, CommandCategory, CommandChain } from "../interface.js";

export interface GetCommandsOptions {
  category?: CommandCategory[];
  chain?: CommandChain[];
  q?: string;
}

type CommandFilter = (cmd: CommandDoc) => boolean | undefined;

export async function getCommands(
  options?: GetCommandsOptions
): Promise<CommandDoc[]> {
  const { category, chain, q } = options ?? {};
  const commands = await fetchCommands();
  const filters: CommandFilter[] = [];
  if (Array.isArray(category) && category.length > 0) {
    filters.push((cmd) => category.includes(cmd.category));
  }
  if (Array.isArray(chain) && chain.length > 0) {
    filters.push((cmd) => chain.includes(cmd.chain));
  }
  if (q) {
    const lowerQ = q.toLowerCase();
    filters.push(
      (cmd) =>
        cmd.name.toLowerCase().includes(lowerQ) ||
        cmd.keywords?.some((k) => k.includes(lowerQ))
    );
  }
  if (filters.length === 0) {
    return commands;
  }
  return commands.filter((cmd) => filters.every((filter) => filter(cmd)));
}

customElements.define("ui-test.get-commands", createProviderClass(getCommands));
