import type {
  BrickConf,
  ContextConf,
  CustomTemplate,
  CustomTemplateProxy,
  RouteConf,
} from "@next-core/types";
import { isObject } from "@next-core/utils/general";
import { isEmpty } from "lodash";

interface BrickNode extends BrickConf {
  alias?: string;
}

export interface ExtractedItem {
  name: string;
  path: WalkPath;
  node: unknown;
  nodeType: NodeType;
}

export type NodeType = "routes" | "template" | "bricks" | "others";

export interface ExtractState {
  extracts: ExtractedItem[];
  namePool: Map<string, Set<string>>;
}

type WalkPath = Readonly<Array<string>>;

const PROXY_KEYS = {
  properties: [
    "ref",
    "refProperty",
    "extraOneWayRefs",
    "refTransform",
    "mergeType",
    "mergeMethod",
    "mergeArgs",
    "mergeProperty",
    "asVariable",
  ],
  slots: ["ref", "refSlot", "refPosition"],
  events: ["ref", "refEvent"],
  methods: ["ref", "refMethod"],
};

export const PLACEHOLDER_PREFIX = `--${Math.floor(
  Math.random() * 1e16
).toString(36)}--:`;

export const PLACEHOLDER_PREFIX_REGEXP = new RegExp(
  `"${PLACEHOLDER_PREFIX}((?:[-\\w]+/)*[-\\w]+)"`,
  "g"
);

function getPlaceholder(folder: string, name: string): string {
  return `${PLACEHOLDER_PREFIX}${folder}${folder ? "/" : ""}${name}`;
}

export function extractRoutes(
  routes: RouteConf[] | undefined,
  path: WalkPath,
  state: ExtractState
) {
  if (Array.isArray(routes)) {
    return routes.map((route) => extractRoute(route, path, state));
  }
  return routes;
}

export function extractTemplates(
  templates: CustomTemplate[] | undefined,
  path: WalkPath,
  state: ExtractState
) {
  if (Array.isArray(templates)) {
    return templates.map((tpl) => extractTemplate(tpl, path, state));
  }
  return templates;
}

function extractRoute(
  route: RouteConf,
  path: WalkPath,
  state: ExtractState
): any {
  const name = getAvailableName("route", route.alias, path, state.namePool);
  cleanRoute(route);

  let node: any;

  const childrenPath = [...path, "views", name];

  if (route.type === "redirect") {
    node = route;
  } else if (route.type === "routes") {
    const { routes, ...restRoute } = route;
    node = {
      ...restRoute,
      children: extractRoutes(routes, path, state),
    };
  } else {
    const { bricks, ...restRoute } = route;
    const view = extractBricks(bricks, childrenPath, state);

    state.extracts.push({
      name,
      path: childrenPath,
      node: view,
      nodeType: "bricks",
    });

    node = {
      ...restRoute,
      view: getPlaceholder(`views/${name}`, name),
    };
  }

  const context = extractContext(
    "context",
    route.context,
    name,
    childrenPath,
    state
  );

  return {
    ...node,
    context,
  };
}

function extractContext(
  type: "context" | "state",
  context: ContextConf[] | undefined,
  routeName: string,
  path: WalkPath,
  state: ExtractState
) {
  if (Array.isArray(context) && context.length > 0) {
    for (const item of context) {
      cleanContext(item);
    }
    const name = getAvailableName(type, type, path, state.namePool);
    state.extracts.push({
      name,
      path,
      node: context,
      nodeType: "others",
    });

    return getPlaceholder(type === "context" ? `views/${routeName}` : "", name);
  }

  return context;
}

function extractProxy(
  proxy: CustomTemplateProxy | undefined,
  path: WalkPath,
  state: ExtractState
) {
  if (!isEmpty(proxy)) {
    const name = getAvailableName("proxy", "proxy", path, state.namePool);
    cleanProxy(proxy);
    state.extracts.push({
      name,
      path,
      node: proxy,
      nodeType: "others",
    });

    return getPlaceholder("", name);
  }

  return proxy;
}

function getAvailableName(
  type: "route" | "brick" | "context" | "state" | "proxy",
  name: string | undefined,
  path: WalkPath,
  namePool: Map<string, Set<string>>,
  countStart = 1
): string {
  const pathString = path.join("/");
  let names = namePool.get(pathString);
  if (!names) {
    namePool.set(pathString, (names = new Set()));
  }

  const aliasIsOk =
    type !== "route" ||
    (typeof name === "string" && /^\w+$/.test(name) && name !== "index");

  if (!aliasIsOk || names.has(name as string)) {
    const prefix = aliasIsOk ? name : type;
    let candidate: string;
    let count = countStart;
    while (names.has((candidate = `${prefix}_${count}`))) {
      count++;
    }
    name = candidate;
  }

  names.add(name as string);
  return name as string;
}

function extractBricks(
  bricks: BrickNode[] | undefined,
  path: WalkPath,
  state: ExtractState
) {
  if (Array.isArray(bricks)) {
    return bricks.map((brick) => extractBrick(brick, path, state));
  }
  return bricks;
}

function extractBrick(
  brick: BrickNode,
  path: WalkPath,
  state: ExtractState
): BrickNode | string {
  let name: string | undefined;
  if (
    typeof brick.alias === "string" &&
    /^<\w+>$/.test(brick.alias) &&
    brick.alias !== "<index>"
  ) {
    name = brick.alias.slice(1, -1);
  }
  cleanBrick(brick);

  if (name) {
    name = getAvailableName("brick", name, [...path, name], state.namePool, 2);
  }

  const { slots, ...newBrick } = brick;
  const children = [];
  const childrenPath: WalkPath = [...path, ...(name ? [name] : [])];

  if (isObject(slots)) {
    for (const [slot, conf] of Object.entries(slots)) {
      if (conf.type === "routes") {
        const routes = extractRoutes(
          (conf.routes ?? []).map((route) => ({
            ...route,
            _isRoute: true,
            slot,
          })),
          path,
          state
        ) as any[];
        children.push(...routes);
      } else {
        const bricks = extractBricks(
          (conf.bricks ?? []).map((brick) => ({
            ...brick,
            slot,
          })),
          childrenPath,
          state
        ) as any[];
        children.push(...bricks);
      }
    }
  }

  newBrick.children = children;

  if (name) {
    state.extracts.push({
      name,
      node: newBrick,
      path: [...path, name],
      nodeType: "bricks",
    });

    return getPlaceholder(name, name);
  }

  return newBrick;
}

function extractTemplate(
  tpl: CustomTemplate,
  path: WalkPath,
  state: ExtractState
) {
  if (!tpl.name.startsWith("tpl-")) {
    throw new Error(`Invalid template name: "${tpl.name}"`);
  }
  const name = tpl.name.substring(4);

  const childrenPath = [...path, name];

  const extractedBricks = extractBricks(tpl.bricks, childrenPath, state);
  const extractedState = extractContext(
    "state",
    tpl.state,
    name,
    childrenPath,
    state
  );
  const extractedProxy = extractProxy(tpl.proxy, childrenPath, state);

  state.extracts.push({
    name,
    path: childrenPath,
    node: {
      ...tpl,
      bricks: extractedBricks,
      state: extractedState,
      proxy: extractedProxy,
    },
    nodeType: "template",
  });

  return getPlaceholder(name, name);
}

function cleanRoute(
  route: RouteConf & {
    deviceOwner?: unknown;
    menu?: RouteConf["menu"] | string;
  }
): void {
  delete route.alias;
  delete route.iid;
  delete route.deviceOwner;
  if (route.menu === "") {
    delete route.menu;
  }
  removeFalsyFields(route, ["redirect", "exact"]);
  if (route.type === "bricks") {
    delete route.type;
  }
}

function cleanBrick(
  brick: BrickConf & { alias?: string; deviceOwner?: unknown }
): void {
  delete brick.alias;
  delete brick.iid;
  delete brick.deviceOwner;
}

function cleanContext(context: ContextConf & { path?: unknown }): void {
  delete context.path;
}

function cleanProxy(proxy: CustomTemplateProxy & { invalid?: unknown }) {
  for (const [key, value] of Object.entries(proxy)) {
    switch (key) {
      case "properties":
      case "events":
      case "slots":
      case "methods":
        if (value) {
          for (const [j, v] of Object.entries(value)) {
            if (v) {
              for (const k of Object.keys(v)) {
                if (!PROXY_KEYS[key].includes(k)) {
                  delete (v as any)[k];
                }
              }
              if (Object.keys(v).length === 0) {
                delete value[j];
              }
            }
          }
        }
        break;
      default:
        delete proxy[key as "invalid"];
    }
  }
}

function removeFalsyFields(node: any, fields: string[]): void {
  for (const field of fields) {
    if (!node[field]) {
      delete node[field];
    }
  }
}
