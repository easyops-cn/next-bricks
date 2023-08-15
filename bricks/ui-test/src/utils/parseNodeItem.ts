/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as t from "@babel/types";
import { isEmpty } from "lodash";
import { parse } from "@babel/parser";

function createCodeItem(item: NodeItem): t.Statement[] {
  const source = item.params!.content;
  const ast = parse(source);

  return ast.program.body;
}

function createPresetNode(item: NodeItem): t.Statement[] {
  // todo: 后面再改成解析传进来 ast 数据
  return [
    t.expressionStatement(
      t.callExpression(
        t.memberExpression(t.identifier("cy"), t.identifier(item.name!)),
        []
      )
    ),
  ];
}

function parseCustomNodeList(children: NodeItem[]) {
  const statementList = [] as t.Statement[];
  children?.forEach((item) => {
    statementList.push(...parseCustomNodeItem(item));
  });

  return statementList;
}

function parseCustomNodeItem(item: NodeItem): t.Statement[] {
  switch (item.type) {
    case "preset":
      return createPresetNode(item);
    case "code":
      return createCodeItem(item);
    default:
      throw new Error(`Unsupported current type:${item.type}`);
  }
}

function createSetupNode(item: NodeItem): t.ExpressionStatement {
  return t.expressionStatement(
    t.callExpression(t.identifier(item.type), [
      t.arrowFunctionExpression(
        [],
        t.blockStatement(
          isEmpty(item.children) ? [] : parseCustomNodeList(item.children!)
        )
      ),
    ])
  );
}

function createCaseNode(item: NodeItem): t.ExpressionStatement {
  return t.expressionStatement(
    t.callExpression(t.identifier("it"), [
      t.stringLiteral(item.alias!),
      t.arrowFunctionExpression(
        [],
        t.blockStatement(
          isEmpty(item.children) ? [] : parseCustomNodeList(item.children!)
        )
      ),
    ])
  );
}

function createDescribeNode(item: NodeItem): t.ExpressionStatement {
  return t.expressionStatement(
    t.callExpression(t.identifier("describe"), [
      t.stringLiteral(item.alias!),
      t.arrowFunctionExpression(
        [],
        t.blockStatement(
          isEmpty(item.children) ? [] : processNodeList(item.children!)
        )
      ),
    ])
  );
}

export function processNodeList(children: NodeItem[]): t.ExpressionStatement[] {
  return children?.map((item) => processNodeItem(item));
}

export function processNodeItem(item: NodeItem): t.ExpressionStatement {
  switch (item.type) {
    case "before":
    case "beforeEach":
    case "after":
    case "afterEach":
      return createSetupNode(item);
    case "case":
      return createCaseNode(item);
    case "describe":
      return createDescribeNode(item);
    default:
      throw new Error(`Unsupported current type:${item.type}`);
  }
}
