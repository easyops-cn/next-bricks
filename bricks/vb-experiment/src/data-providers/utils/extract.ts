import type {
  BrickConf,
  CustomTemplate,
  RouteConf,
  RouteConfOfBricks,
  RouteConfOfRoutes,
} from "@next-core/types";
import { isObject } from "@next-core/utils/general";

interface BrickNode extends BrickConf {
  alias?: string;
}

export interface ExtractedItem {
  name: string;
  path: WalkPath;
  node: unknown;
}

export interface ExtractState {
  extracts: ExtractedItem[];
  namePool: Map<string, Set<string>>;
}

type WalkPath = Readonly<Array<string>>;

export const PLACEHOLDER_PREFIX = `--${Math.floor(
  Math.random() * 1e16
).toString(36)}--:`;

function getPlaceholder(folder: string, name: string): string {
  return `${PLACEHOLDER_PREFIX}${folder}/${name}`;
}

export function extractRoutes(
  routes: RouteConf[] | undefined,
  path: WalkPath,
  state: ExtractState
) {
  const childrenPath = [...path, "routes"];
  if (Array.isArray(routes)) {
    return routes.map((route) => extractRoute(route, childrenPath, state));
  }
  return routes;
}

export function extractTemplates(
  templates: CustomTemplate[] | undefined,
  path: WalkPath,
  state: ExtractState
) {
  const childrenPath = [...path, "templates"];
  if (Array.isArray(templates)) {
    return templates.map((tpl) => extractTemplate(tpl, childrenPath, state));
  }
  return templates;
}

function extractRoute(route: RouteConf, path: WalkPath, state: ExtractState) {
  const name = getAvailableName("route", route.alias, path, state.namePool);

  let node: unknown = route;
  const childrenPath: WalkPath = [...path, name];

  if (Array.isArray((route as RouteConfOfBricks).bricks)) {
    node = {
      ...route,
      bricks: extractBricks(
        (route as RouteConfOfBricks).bricks,
        childrenPath,
        state
      ),
    };
  } else if (Array.isArray((route as RouteConfOfRoutes).routes)) {
    node = {
      ...route,
      routes: extractRoutes(
        (route as RouteConfOfRoutes).routes,
        childrenPath,
        state
      ),
    };
  }

  state.extracts.push({
    name,
    path,
    node,
  });

  return getPlaceholder("routes", name);
}

function getAvailableName(
  type: "route" | "brick",
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
    type === "brick" ||
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

// path: ["routes"]
// name: "route_1"
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
  delete brick.alias;

  if (name) {
    name = getAvailableName("brick", name, path, state.namePool, 2);
  }

  let newBrick = brick;
  const childrenPath: WalkPath = [...path, ...(name ? ["bricks", name] : [])];

  if (isObject(brick.slots)) {
    newBrick = {
      ...brick,
      slots: Object.fromEntries(
        Object.entries(brick.slots).map(([slot, conf]) => {
          if (conf.type === "routes") {
            return [
              slot,
              {
                ...conf,
                routes: extractRoutes(conf.routes, childrenPath, state),
              },
            ];
          }
          return [
            slot,
            {
              ...conf,
              bricks: extractBricks(conf.bricks, childrenPath, state),
            },
          ];
        })
      ),
    };
  }

  if (name) {
    state.extracts.push({
      name,
      node: newBrick,
      path: [...path, "bricks"],
    });

    return getPlaceholder("bricks", name);
  }

  return newBrick;
}

function extractTemplate(
  tpl: CustomTemplate,
  path: WalkPath,
  state: ExtractState
) {
  const name = tpl.name;
  let node = tpl;

  const childrenPath = [...path, name];

  if (Array.isArray(tpl.bricks)) {
    node = {
      ...tpl,
      bricks: extractBricks(tpl.bricks, childrenPath, state),
    } as CustomTemplate;
  }

  state.extracts.push({
    name,
    path,
    node,
  });

  return getPlaceholder("templates", name);
}
