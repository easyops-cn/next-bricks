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
  declare const DATA;
  declare const EVENT;
  declare const FLAGS;
  declare const ANCHOR;
  declare const HASH;
  declare namespace INSTALLED_APPS {
    function has(appId: string):boolean
  }
  declare const ITEM;
  declare namespace LOCAL_STORAGE {
    function getItem(name: string): string; 
  }
  declare namespace SESSION_STORAGE {
    function getItem(name: string): string
  } 
  declare const MEDIA;
  declare const MISC;
  declare const PARAMS;
  declare const PROCESSORS;
  declare const QUERY_ARRAY;
  declare const TPL;
  declare const PIPES;
  declare const _;
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
  declare const BASE_URL;
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
