export const EVALUATE_KEYWORD = [
  "CTX",
  "STATE",
  "DATA",
  "EVENT",
  "FLAGS",
  "APP",
  "ANCHOR",
  "HASH",
  "INSTALLED_APPS",
  "ITEM",
  "INDEX",
  "SIZE",
  "LOCAL_STORAGE",
  "MEDIA",
  "MISC",
  "PARAMS",
  "PATH",
  "PROCESSORS",
  "QUERY",
  "QUERY_ARRAY",
  "SESSION_STORAGE",
  "TPL",
  "SYS",
  "BASE_URL",
  "IMG",
  "FN",
  "I18N",
  "I18N_TEXT",
  "PERMISSIONS",
  "THEME",
];

export const brickNextKeywords = [
  "target",
  "targetRef",
  "properties",
  "events",
  "method",
  "callback",
  "success",
  "error",
  "action",
  "useProvider",
  "useChildren",
  "useBrick",
  "args",
  "if",
  "then",
];

export const Level = {
  hit: 1,
  info: 2,
  warn: 4,
  error: 8,
};

export const builtInKeywordDeclare = `
  declare const DATA: any;
  declare const EVENT: CustomEvent<any>;
  declare const FLAGS: Record<string, boolean>;
  declare const ANCHOR: string | null;
  declare const HASH: string;
  declare namespace INSTALLED_APPS {
    function has(appId: string):boolean
  }
  declare const ITEM: any;
  declare const INDEX: number;
  declare const SIZE: number;
  declare namespace LOCAL_STORAGE {
    function getItem(name: string): string;
  }
  declare namespace SESSION_STORAGE {
    function getItem(name: string): string
  }
  declare const MEDIA: {
    breakpoint?: "xLarge" | "large" | "medium" | "small" | "xSmall";
  };
  declare const MISC: Record<string, any>;
  declare const PARAMS: URLSearchParams;
  declare const PROCESSORS: Record<string, Record<string, Function>>;
  declare const QUERY_ARRAY: Record<string, string[]>;
  declare const TPL: Record<string, any>;
  declare const PIPES: Record<string, Function>;
  declare const _: Record<string, any>;
  declare namespace SYS {
    const username:string;
    const userInstanceId:string;
    const org:number;
    const isAdmin: boolean;
    const accessRule:string;
    const csrfToken:string;
    const accessToken:string;
    const userShowValue:string[];
  }
  declare const BASE_URL: string;
  declare namespace IMG {
    function get(src: string): string;
  }
  declare function I18N(key: string, options?: string | Record<string, unknown>): string;
  declare function I18N_TEXT(data: {[language: string]: string}):string;
  declare namespace PERMISSIONS {
    function check(...action: string[]):boolean;
  }
  declare namespace THEME {
    function getTheme(): "light" | "dark" | "dark-v2";
  }
`;
