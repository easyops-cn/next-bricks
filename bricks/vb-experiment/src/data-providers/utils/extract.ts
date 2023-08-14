import type {
  ContextConf,
  CustomTemplate,
  CustomTemplateProxy,
  RouteConf,
} from "@next-core/types";
import { isObject } from "@next-core/utils/general";
import type {
  BrickNode,
  BrickNormalNode,
  BrickSourceNode,
  RouteNode,
  RouteNodeInBrick,
} from "./interfaces.js";

export interface ExtractedItem {
  name: string;
  path: WalkPath;
  node: unknown;
  nodeType: NodeType;
}

export type NodeType =
  | "routes"
  | "template"
  | "bricks"
  | "context"
  | "menu"
  | "plain"
  | "others";

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
  routes: RouteConf[],
  path: WalkPath,
  state: ExtractState
): RouteNode[] | undefined {
  return routes.map((route) => extractRoute(route, path, state));
}

export function extractTemplates(
  templates: CustomTemplate[],
  path: WalkPath,
  state: ExtractState
) {
  return templates.map((tpl) => extractTemplate(tpl, path, state));
}

function extractRoute(
  route: RouteConf,
  path: WalkPath,
  state: ExtractState
): RouteNode {
  const viewsPath = [...path, "views"];
  const name = getAvailableName(
    "route",
    route.alias,
    viewsPath,
    state.namePool
  );
  addName(state.namePool, [...viewsPath, name], name);
  cleanRoute(route);

  let node: RouteNode;

  const childrenPath = [...viewsPath, name];

  if (route.type === "redirect") {
    node = route as RouteNode;
  } else if (route.type === "routes") {
    const { routes, ...restRoute } = route;
    node = {
      ...restRoute,
      children: extractRoutes(routes, path, state),
    } as RouteNode;
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
    } as RouteNode;
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
): string | undefined {
  if (Array.isArray(context) && context.length > 0) {
    for (const item of context) {
      cleanContext(item);
    }
    const name = getAvailableName(type, type, path, state.namePool);
    state.extracts.push({
      name,
      path,
      node: context,
      nodeType: "context",
    });

    return getPlaceholder(type === "context" ? `views/${routeName}` : "", name);
  }
}

function extractProxy(
  proxy: CustomTemplateProxy | undefined,
  path: WalkPath,
  state: ExtractState
) {
  if (isObject(proxy) && Object.keys(proxy).length > 0) {
    const name = getAvailableName("proxy", "proxy", path, state.namePool);
    cleanProxy(proxy);
    state.extracts.push({
      name,
      path,
      node: proxy,
      nodeType: "plain",
    });

    return getPlaceholder("", name);
  }

  return proxy;
}

function getAvailableName(
  type: "route" | "brick" | "context" | "state" | "proxy",
  name: string | undefined,
  path: WalkPath,
  namePool: Map<string, Set<string>>
): string {
  let lowerName = name?.toLowerCase();
  if (lowerName == "index") {
    lowerName = `${lowerName}_2`;
  }
  const names = getNames(namePool, path);

  const aliasIsOk =
    type !== "route" ||
    (typeof lowerName === "string" &&
      /^[-\w]+$/.test(lowerName) &&
      lowerName !== "index");

  if (!aliasIsOk || names.has(lowerName as string)) {
    const prefix = aliasIsOk ? lowerName : type;
    let candidate: string;
    let count = 2;
    while (names.has((candidate = `${prefix}_${count}`))) {
      count++;
    }
    lowerName = candidate;
  }

  names.add(lowerName as string);
  return lowerName as string;
}

function addName(
  namePool: Map<string, Set<string>>,
  path: WalkPath,
  name: string
) {
  const names = getNames(namePool, path);
  names.add(name);
}

function getNames(
  namePool: Map<string, Set<string>>,
  path: WalkPath
): Set<string> {
  const pathString = path.join("/");
  let names = namePool.get(pathString);
  if (!names) {
    namePool.set(pathString, (names = new Set()));
  }
  return names;
}

function extractBricks(
  bricks: BrickSourceNode[] | undefined,
  path: WalkPath,
  state: ExtractState
) {
  if (Array.isArray(bricks)) {
    return bricks.map((brick) => extractBrick(brick, path, state));
  }
  return bricks;
}

function extractBrick(
  brick: BrickSourceNode,
  path: WalkPath,
  state: ExtractState
): BrickNode {
  let name: string | undefined;
  if (
    typeof brick.alias === "string" &&
    /^<[-\w]+>$/.test(brick.alias) &&
    brick.alias !== "<index>"
  ) {
    name = brick.alias.slice(1, -1);
  }
  cleanBrick(brick);

  if (name) {
    name = getAvailableName("brick", name, path, state.namePool);
    addName(state.namePool, [...path, name], name);
  }

  const { slots, ...newBrick } = brick as BrickNormalNode &
    Pick<BrickSourceNode, "slots">;
  const children: (BrickNode | RouteNodeInBrick)[] = [];
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
        ) as RouteNodeInBrick[];
        children.push(...routes);
      } else {
        const bricks = extractBricks(
          (conf.bricks ?? []).map((brick) => ({
            ...brick,
            slot,
          })),
          childrenPath,
          state
        ) as BrickNode[];
        children.push(...bricks);
      }
    }
  }

  if (isObject(newBrick.properties) && !Array.isArray(newBrick.properties)) {
    newBrick.properties = extractProperties(
      newBrick.properties,
      childrenPath,
      state
    );
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

function extractProperties(
  props: Record<string, unknown>,
  path: WalkPath,
  state: ExtractState
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(props).map(([k, v]) => [
      k,
      extractPropertyValue(v, k, path, state),
    ])
  );
}

function extractPropertyValue(
  value: unknown,
  key: string | number,
  path: WalkPath,
  state: ExtractState
): unknown {
  if (key === "useBrick") {
    if (Array.isArray(value)) {
      return extractBricks(value as BrickSourceNode[], path, state);
    }
    if (isObject(value)) {
      return extractBrick(value as unknown as BrickSourceNode, path, state);
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((v, i) => extractPropertyValue(v, i, path, state));
  }

  if (isObject(value)) {
    return extractProperties(value, path, state);
  }

  return value;
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
    analyticsData?: unknown;
    menu?: RouteConf["menu"] | string;
  }
): void {
  delete route.alias;
  delete route.iid;
  delete route.deviceOwner;
  delete route.analyticsData;
  if (route.menu === "") {
    delete route.menu;
  }
  removeFalsyFields(route as unknown as Record<string, unknown>, [
    "redirect",
    "exact",
  ]);
  if (route.type === "bricks") {
    delete route.type;
  }
}

function cleanBrick(brick: BrickSourceNode): void {
  delete brick.alias;
  delete brick.iid;
  delete brick.deviceOwner;
  if (brick.events && Object.keys(brick.events).length === 0) {
    delete brick.events;
  }
  if (brick.lifeCycle && Object.keys(brick.lifeCycle).length === 0) {
    delete brick.lifeCycle;
  }
  removeFalsyFields(brick as unknown as Record<string, unknown>, [
    "bg",
    "portal",
  ]);
}

function cleanContext(
  context: ContextConf & { path?: unknown; relatedId?: unknown; doc?: unknown }
): void {
  delete context.path;
  delete context.relatedId;
  delete context.doc;
}

function cleanProxy(proxy: CustomTemplateProxy & { invalid?: unknown }) {
  for (const [key, value] of Object.entries(proxy)) {
    switch (key) {
      case "properties":
      case "events":
      case "slots":
      case "methods":
        if (isObject(value)) {
          for (const [j, v] of Object.entries(value)) {
            if (isObject(v)) {
              const keys = Object.keys(v);
              for (const k of keys) {
                if (!PROXY_KEYS[key].includes(k)) {
                  delete v[k];
                }
              }
              if (keys.length === 0) {
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

function removeFalsyFields(
  node: Record<string, unknown>,
  fields: string[]
): void {
  for (const field of fields) {
    if (!node[field]) {
      delete node[field];
    }
  }
}
