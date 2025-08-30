import { createProviderClass } from "@next-core/utils/storyboard";
import { brickMap } from "./brickMap.js";
import { omit, isEmpty } from "lodash";

interface NodeDetail {
  instanceId: string;
  properties: string;
  events: string;
  lifeCycle: string;
  context: Array<Record<string, any>>;
  mountPoint: string;
  children: NodeDetail[];
  [key: string]: any;
}

let dataUid: number;
export function updateRoute(route: Array<NodeDetail>) {
  dataUid = 0;
  const rootNode = route[0];
  const DATAKEY =
    rootNode["_object_id"] === "STORYBOARD_ROUTE" ? "CTX" : "STATE";
  const list: Array<any> = [];
  const mountPointMap = new Map<string, string>();
  let useResolvesList: Array<Record<string, any>> = [];
  let childContextList: Array<Record<string, any>> = [];
  function updateBricks(route: Array<NodeDetail>) {
    route.forEach((node) => {
      let newProperties: Record<string, any> | undefined;
      let newEvents: Record<string, any> | undefined;
      let newLifeCycle: Record<string, any> | undefined;
      const matchV3Brick = brickMap[node.brick];
      if (matchV3Brick) {
        if (matchV3Brick.properties && node.properties) {
          const properties = JSON.parse(node.properties);
          newProperties = Object.fromEntries(
            Object.entries(properties).map(([k, v]) => {
              if (typeof matchV3Brick.properties?.[k] === "string") {
                return [matchV3Brick.properties[k], v];
              } else if (typeof matchV3Brick.properties?.[k] === "function") {
                return matchV3Brick.properties[k](v);
              }
              return [k, v];
            })
          );
        }
        if (matchV3Brick.events && node.events) {
          const events = JSON.parse(node.events);
          newEvents = Object.fromEntries(
            Object.entries(events).map(([k, v]) => {
              if (typeof matchV3Brick.events?.[k] === "string") {
                return [matchV3Brick.events?.[k], v];
              } else if (typeof matchV3Brick.events?.[k] === "function") {
                return matchV3Brick.events?.[k](v);
              }
              return [k, v];
            })
          );
        }
        if (matchV3Brick.slots && node.children?.length) {
          Object.entries(matchV3Brick.slots).forEach(([k, v]) => {
            const slotChild = (
              node.children as Array<Record<string, any>>
            ).filter((child) => child.mountPoint === k);
            slotChild.forEach((slot, index) => {
              let mountPoint;
              if (typeof v === "string") {
                mountPoint = v;
              } else if (typeof v === "function") {
                mountPoint = v(index, newProperties);
              }
              mountPointMap.set(slot.instanceId, mountPoint);
            });
          });
        }
      } else if (mountPointMap.get(node.instanceId)) {
        list.push({
          instanceId: node.instanceId,
          mountPoint: mountPointMap.get(node.instanceId) ?? node.mountPoint,
        });
      }
      if (node.lifeCycle) {
        newLifeCycle = JSON.parse(node.lifeCycle) as Record<string, any>;
        if (newLifeCycle.useResolves?.length) {
          const useResolves = newLifeCycle.useResolves as Array<
            Record<string, any>
          >;
          useResolves.forEach((item) => {
            if (item.transform) {
              newProperties || (newProperties = {});
              Object.assign(
                newProperties,
                Object.fromEntries(
                  Object.entries(item.transform).map(([k, v]) => {
                    let flag = false;
                    const newValue = JSON.stringify(v).replace(
                      /(?<=\s)DATA(?!\w)/g,
                      () => {
                        flag = true;
                        return `${DATAKEY}.DATA${dataUid}`;
                      }
                    );
                    if (flag) {
                      item.dataUid = dataUid;
                      dataUid++;
                    }
                    return [k, JSON.parse(newValue)];
                  })
                )
              );
            }
          });
          useResolvesList = useResolvesList.concat(useResolves);
        }
        delete newLifeCycle.lifeCycle;
      }
      if (node.context && node.context.length) {
        childContextList = childContextList.concat(node.context);
      }
      const obj = Object.fromEntries(
        Object.entries({
          properties: newProperties,
          events: newEvents,
          lifeCycle: newLifeCycle,
        })
          .filter(([_, v]) => {
            return !isEmpty(v) ? true : false;
          })
          .map(([k, v]) => {
            return [k, JSON.stringify(v)];
          })
      );
      list.push({
        objectId: node._object_id,
        instanceId: node.instanceId,
        brick: matchV3Brick?.brick ?? node.brick,
        ...obj,
        mountPoint: mountPointMap.get(node.instanceId) ?? node.mountPoint,
        context: null,
      });

      if (node.children) {
        updateBricks(node.children);
      }
    });
    return route;
  }

  updateBricks(rootNode.children);

  useResolvesList.forEach((item) => {
    childContextList.push({
      name: `DATA${item.dataUid}`,
      resolve: omit(item, ["transform", "dataUid"]),
    });
  });
  if (childContextList.length) {
    list.unshift({
      objectId: rootNode._object_id,
      instanceId: rootNode.instanceId,
      context: JSON.stringify(childContextList.concat(rootNode.context ?? [])),
    });
  }
  return list;
}

customElements.define(
  "v2-adapter.load-bricks",
  createProviderClass(updateRoute)
);
