import { GeneralIconProps } from "@next-bricks/icons/general-icon";

export interface WorkbenchNodeData<T = unknown> {
  if?: boolean;
  key: string | number;
  name: string;
  icon?: IconConfig;
  data?: T;
  labelColor?: string;
  labelPrefix?: {
    text: string;
    style?: React.CSSProperties;
  };
  link?:
    | {
        to: string;
      }
    | {
        href: string;
      };
  badge?: IconConfig;
  children?: WorkbenchNodeData[];
  matched?: boolean;
  matchedSelf?: boolean;
  path?: string;
  isContainer?: boolean;
  originKey?: string;
  parentPath?: string;
  unreachable?: boolean;
}

export type IconConfig = GeneralIconProps & {
  color?: string;
};

export interface WorkbenchTreeAction {
  action: string;
  icon: IconConfig;
  title?: string;
  if?: string | boolean;
}

export interface ActionClickDetail {
  action: string;
  data?: unknown;
}
