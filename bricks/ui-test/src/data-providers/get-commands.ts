import { createProviderClass } from "@next-core/utils/general";
import fetchCommands from "./data/fetchCommands.js";

export interface Command {
  name: string;
  category: CommandCategory;
  from: CommandFrom;
  chain: CommandChain;
  description?: string;
  params?: CommandParam[];
  overloads?: CommandOverload[];
  keywords?: string[];
}

export type CommandCategory = "query" | "action" | "assertion" | "other";
export type CommandFrom = "cypress" | "third-party" | "custom";
export type CommandChain = "parent" | "child" | "dual";

export interface CommandParam {
  label: string;
  type: CommandParamType;
  description?: string;
  required?: boolean;
  default?: unknown;
  enum?: (string | number | EnumItem)[];
}

export type CommandParamType =
  | "number"
  | "string"
  | "boolean"
  | "object"
  | "array"
  | "function"
  | "mixed";

export interface EnumItem {
  label: string;
  value: unknown;
}

export interface CommandOverload {
  label: string;
  params?: CommandParam[];
}

export interface GetCommandsOptions {
  category?: CommandCategory[];
  chain?: CommandChain[];
  q?: string;
}

type CommandFilter = (cmd: Command) => boolean | undefined;

export async function getCommands(
  options?: GetCommandsOptions
): Promise<Command[]> {
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
