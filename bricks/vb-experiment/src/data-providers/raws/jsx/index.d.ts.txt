import { ContextConf, CustomTemplateProxy } from "@next-core/types";

export const Fragment: symbol;

export function Route(props: {
  path: string;
  exact?: boolean;
  type?: "view" | "routes" | "redirect";
  context?: ContextConf[];
  children?: any[];
  redirect?: string;
  menu?: any;
  permissionsPreCheck?: string[];
  if?: any;
}): any;

export function Component(props: {
  name: string;
  state?: ContextConf[];
  proxy?: CustomTemplateProxy;
  children?: any[];
}): any;

interface ControlNodeProps {
  value: any;
  children?: any[];
  if?: any;
}

export function ForEach(pControlNodeProps): any;

export function If(ControlNodeProps): any;

export function Switch(ControlNodeProps): any;

export function LegacyTemplate(props: {
  template: string;
  params?: any;
  if?: any;
}): any;
