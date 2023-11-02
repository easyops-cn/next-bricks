declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.css" {
  const css: string;
  export default css;
}

declare module "*.less" {
  const lessValue: string;
  export default lessValue;
}

interface SvgrComponent
  extends React.FunctionComponent<React.SVGAttributes<SVGElement>> {}

declare module "*.svg" {
  const ReactComponent: SvgrComponent;
  export default ReactComponent;
}

declare module "*.svg?url" {
  const url: string;
  export default url;
}

declare module "*.png" {
  const value: string;
  export = value;
}

declare module "*.jpg" {
  const value: string;
  export = value;
}

declare module "*.jpeg" {
  const value: string;
  export = value;
}

declare module "*.gif" {
  const value: string;
  export = value;
}

declare module "*.json" {
  const value: any;
  export default value;
}

declare module "*.txt" {
  const source: string;
  export default source;
}

declare module "@ungap/event-target" {
  export default EventTarget;
}

declare module "@babel/standalone" {
  export const transformFromAst: (
    ast: unknown,
    sourceCode: string | undefined,
    options: import("@babel/core").TransformOptions
  ) => import("@babel/core").BabelFileResult;

  export const transform: (
    sourceCode: string,
    options: import("@babel/core").TransformOptions
  ) => import("@babel/core").BabelFileResult;

  export const registerPlugin: (
    name: string,
    plugin: (api: any, opts?: any) => import("@babel/core").PluginObj
  ) => void;

  export const availablePlugins: Record<string, unknown>;
}

interface Window {
  /** For Google Analytics. */
  dataLayer?: IArguments[];

  /** A map of versions of core packages. */
  BRICK_NEXT_VERSIONS?: Record<string, string>;

  /** Declare supported features currently. */
  BRICK_NEXT_FEATURES?: string[];

  /** A map of dll name to file path. */
  DLL_PATH?: Record<string, string>;

  /** Markup for v2 adapter */
  MIGRATE_TO_BRICK_NEXT_V3?: boolean;

  // Variables below are for standalone micro-apps only.

  /** Markup for standalone micro-apps. */
  STANDALONE_MICRO_APPS?: boolean;

  /** Markup for standalone brick preview */
  DEVELOPER_PREVIEW?: boolean;

  /** The app needs no auth guard.  */
  NO_AUTH_GUARD?: boolean;

  /** The current app ID. */
  APP_ID?: string;

  /** The app root, E.g. "hello-world/" */
  APP_ROOT?: string;

  /** The public cdn, E.g. "https://my.cdn.site/" */
  PUBLIC_CDN?: string;

  /** The public root, E.g. "hello-world/-/" */
  PUBLIC_ROOT?: string;

  /** Whether the public root includes package version. */
  PUBLIC_ROOT_WITH_VERSION?: boolean;

  /** The core root, E.g. "hello-world/-/core/" */
  CORE_ROOT?: string;

  /** The bootstrap filename, E.g. "hello-world/-/bootstrap.abc123.json" */
  BOOTSTRAP_FILE?: string;

  /** Mock global date, currently for sandbox demo website only */
  MOCK_DATE?: string;

  // for File System Access Api
  showDirectoryPicker?(options: {
    mode: "read" | "readwrite";
  }): Promise<FileSystemDirectoryHandle>;
}

interface FileSystemDirectoryHandle {
  getFileHandle(
    name: string,
    option: { create?: boolean }
  ): Promise<FileSystemFileHandle>;
}

interface FileSystemFileHandle {
  createWritable(): Promise<any>;
}

declare const __webpack_public_path__: string;

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

declare namespace React {
  interface HTMLAttributes {
    part?: string;
  }
}
