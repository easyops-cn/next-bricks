import { GeneralIconProps } from "@next-bricks/icons/general-icon";

export interface WorkbenchNodeData<T = unknown> {
  if?: boolean;
  key: string | number;
  name: string;
  icon?: GeneralIconProps;
  data?: T;
  labelColor?: string;
  link?:
    | {
        to: string;
      }
    | {
        href: string;
      };
  badge?: GeneralIconProps;
  children?: WorkbenchNodeData[];
  matched?: boolean;
  matchedSelf?: boolean;
  path?: string;
  isContainer?: boolean;
  originKey?: string;
  parentPath?: string;
  unreachable?: boolean;
}

export interface WorkbenchTreeAction {
  action: string;
  icon: GeneralIconProps;
  title?: string;
  if?: string | boolean;
}

export interface ActionClickDetail {
  action: string;
  data?: unknown;
}
