/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as t from "@babel/types";
import { isEmpty } from "lodash";
import { parse } from "@babel/parser";
import { NodeItem, NodeType } from "../interface.js";

function processCodeItem(item: NodeItem): t.Statement[] {
  const source = item.params?.[0];

  if (!source) return [];
  const ast = parse(source);

  return ast.program.body;
}

function preProcessCommandParams(item: NodeItem): any[] | undefined {
  if (item.name.startsWith("should")) {
    const [, args] = item.name.split(":");

    const params = item.params?.slice() || [];
    args && params.unshift(args);
    return params;
  }

  return item.params;
}

function preProcessCommandName(item: NodeItem): string {
  if (item.name.startsWith("should")) {
    return item.name.split(":")?.[0];
  }

  return item.name;
}

function createCommandParams(item: NodeItem): t.Expression[] {
  const { name } = item;

  const params = preProcessCommandParams(item);
  if (!params) return [];

  if (!Array.isArray(params)) {
    throw new Error(
      `The expected type of the \`params\` field in \`${name}\` is an array, but the received type is a ${typeof params}`
    );
  }

  const args = JSON.stringify(params);
  const ast = parse(args);
  return (ast.program.body[0] as any).expression.elements;
}

function processCommandItem(item: NodeItem): t.ExpressionStatement {
  const ChainStartExpr = t.callExpression(
    t.memberExpression(
      t.identifier("cy"),
      t.identifier(preProcessCommandName(item))
    ),
    createCommandParams(item)
  );

  if (isEmpty(item.children)) {
    return t.expressionStatement(ChainStartExpr);
  }

  const chainList = item.children?.reverse().concat(item) as NodeItem[];

  const createChainedExpr = (chainList: NodeItem[]): t.Expression => {
    const [current, ...rest] = chainList;

    if (rest.length === 0) {
      return ChainStartExpr;
    }

    return t.callExpression(
      t.memberExpression(
        createChainedExpr(rest),
        t.identifier(preProcessCommandName(current))
      ),
      createCommandParams(current)
    );
  };

  return t.expressionStatement(createChainedExpr(chainList));
}

function createCommandNode(children: NodeItem[]): t.Statement[] {
  const statementList = [] as t.Statement[];

  children.forEach((item) => {
    if (item.name === "code") {
      statementList.push(...processCodeItem(item));
    } else {
      statementList.push(processCommandItem(item));
    }
  });

  return statementList;
}

function processBlockItem(item: NodeItem): t.Statement[] {
  if (isEmpty(item.children)) {
    return [];
  }

  if (item.name === "describe") {
    if (item.children!.some((c) => c.type !== NodeType.Block)) {
      throw new Error(
        `The children of the \`${item.name}\` are only be  \` block \` type, specifically including before, beforeEach, after, afterEach and "it."`
      );
    }

    return item.children!.map((c) => createBlockNode(c));
  } else {
    return createCommandNode(item.children!);
  }
}

function createBlockNode(item: NodeItem): t.ExpressionStatement {
  const callee = ["only", "skip"].includes(item.flag as string)
    ? t.memberExpression(
        t.identifier(item.name),
        t.identifier(item.flag as string)
      )
    : t.identifier(item.name);

  return t.expressionStatement(
    t.callExpression(callee, [
      ...(["before", "beforeEach", "after", "afterEach"].includes(item.name)
        ? []
        : [t.stringLiteral(item.label || "")]),
      t.arrowFunctionExpression([], t.blockStatement(processBlockItem(item))),
    ])
  );
}

function processSuiteChildren(children: NodeItem[]): t.Statement[] {
  if (!children.every((item) => item.type === NodeType.Block)) {
    throw new Error(
      `The children nodes of the suite type must be of the block type`
    );
  }
  return children.map((item) => createBlockNode(item));
}

function crateSuiteNode(item: NodeItem): t.ExpressionStatement {
  return t.expressionStatement(
    t.callExpression(t.identifier(item.name), [
      t.stringLiteral(item.label || ""),
      t.arrowFunctionExpression(
        [],
        t.blockStatement(
          isEmpty(item.children) ? [] : processSuiteChildren(item.children!)
        )
      ),
    ])
  );
}

export function parseSuiteAst(suiteData: NodeItem): t.Statement[] {
  if (isEmpty(suiteData.children)) return [];
  return processSuiteChildren(suiteData.children as NodeItem[]);
}
