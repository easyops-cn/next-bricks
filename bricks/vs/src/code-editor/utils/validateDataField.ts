import type { MemberExpression, Identifier } from "@babel/types";
import type { EstreeParentItem, EstreeLiteral } from "@next-core/cook";
import { DataDefinition, DataModelField } from "../interfaces.js";

function findWaningField(
  nodes: Identifier[],
  dataDefinition: DataDefinition | undefined
): Identifier | undefined {
  if (!dataDefinition) return;

  let curDefinition = dataDefinition;

  return nodes.find((node) => {
    const name = node.name;

    const find = curDefinition.fields?.find((item) => item.name === name);

    if (!find) return true;

    curDefinition = find;
  });
}

/**
 *
 * @description 根据契约定义检查字段是否存在
 */
export function validateDataFields(
  node: MemberExpression,
  parents: EstreeParentItem[],
  dataDefinitions: DataModelField[] | undefined
): Identifier | undefined {
  const dataName = (node.property as Identifier).name;
  const dataDefinition = dataDefinitions?.find(
    (item) => item.name === dataName
  )?.dataDefinition;

  if (!dataDefinition) return;

  const list = [];
  const reverseParents = parents.slice().reverse();

  for (let i = 0; i < reverseParents.length; i++) {
    const curNode = reverseParents[i].node as MemberExpression;
    const parentNode = reverseParents[i + 1]?.node;

    if (
      curNode.type === "MemberExpression" &&
      parentNode?.type !== "CallExpression" &&
      ["Identifier", "Literal"].includes(curNode.property?.type)
    ) {
      if (
        curNode.computed &&
        (curNode.property as unknown as EstreeLiteral).type === "Literal" &&
        typeof (curNode.property as unknown as EstreeLiteral).value === "number"
      ) {
        continue;
      }

      if (!curNode.computed && curNode.property.type === "Identifier") {
        list.push(curNode.property);
      }
    } else {
      break;
    }
  }

  const matched = findWaningField(list, dataDefinition);

  return matched;
}
