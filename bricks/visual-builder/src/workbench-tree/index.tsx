import React from "react";
import { pick } from "lodash";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import type {
  ActionClickDetail,
  WorkbenchNodeData,
  WorkbenchTreeAction,
} from "../interfaces.js";
import { WorkbenchActionsContext } from "../shared/workbench/WorkbenchActionsContext.js";
import {
  WorkbenchTree,
  dropEmitProps,
} from "../shared/workbench/WorkbenchTree.js";
import { WorkbenchTreeContext } from "../shared/workbench/WorkbenchTreeContext.js";
import { deepMatch } from "../utils/deepMatch.js";
import treeStyleText from "./WorkbenchTree.shadow.css";
import actionStyleText from "../shared/workbench-mini-action-bar/WorkbenchMiniActionBar.shadow.css";
import "@next-core/theme";

function defaultGetCollapsedId(node: WorkbenchNodeData): string | number {
  return node.key;
}

const { defineElement, property, event } = createDecorators();

/**
 * @id next-builder.workbench-tree
 * @author steve
 * @history
 * 1.x.0: 新增构件 `next-builder.workbench-tree`
 * @docKind brick
 * @noInheritDoc
 * @insider
 */
@defineElement("visual-builder.workbench-tree", {
  styleTexts: [treeStyleText, actionStyleText],
})
class WorkbenchTreeElement extends ReactNextElement {
  @property({ attribute: false })
  accessor nodes: WorkbenchNodeData[];

  @property({ attribute: false })
  accessor actions: WorkbenchTreeAction[];

  @property({ type: Boolean })
  accessor actionsHidden: boolean;

  @property()
  accessor placeholder: string;

  @property({ type: Boolean })
  accessor isTransformName: boolean;

  @property()
  accessor searchPlaceholder: string;

  @property({ type: Boolean })
  accessor noSearch: boolean;

  @property({ attribute: false })
  accessor activeKey: string | number;

  @property({ type: Boolean })
  accessor showMatchedNodeOnly: boolean;

  @property({ attribute: false })
  accessor matchNodeDataFields: string | string[];

  @property({ attribute: false })
  accessor fixedActionsFor: Record<string, unknown> | Record<string, unknown>[];

  @property({ type: Boolean })
  accessor collapsible: boolean;

  @property({ attribute: false })
  accessor collapsedNodes: string[];

  @property({ type: Boolean })
  accessor allowDrag: boolean;

  @property({ type: Boolean })
  accessor allowDragToRoot: boolean;

  @property({ type: Boolean })
  accessor allowDragToInside: boolean;

  @property({ type: String })
  accessor nodeKey: string;

  @property({ type: Boolean })
  accessor skipNotify: boolean;

  @event({ type: "action.click" })
  accessor #actionClickEvent!: EventEmitter<ActionClickDetail>;

  #handleActionClick = (detail: ActionClickDetail): void => {
    this.#actionClickEvent.emit(detail);
  };

  @event({ type: "node.click" })
  accessor #nodeClickEvent: EventEmitter<unknown>;

  #nodeClickFactory = (node: WorkbenchNodeData) => () => {
    this.#nodeClickEvent.emit(node.data);
  };

  @event({ type: "node.drop" })
  accessor #nodeDropEvent: EventEmitter<any>;

  #handleNodeDrop = (detail: dropEmitProps): void => {
    this.#nodeDropEvent.emit(detail);
  };

  @event({ type: "context.menu" })
  accessor #nodeContextMenuEvent: EventEmitter<unknown>;

  #contextMenuFactory = (node: WorkbenchNodeData) => (e: React.MouseEvent) => {
    e.preventDefault();
    this.#nodeContextMenuEvent.emit({
      active: true,
      node: node?.data,
      x: e.clientX,
      y: e.clientY,
    });
  };

  @event({ type: "node.toggle" })
  accessor #nodeToggleEvent: EventEmitter<{
    nodeId: string;
    collapsed: boolean;
  }>;

  #handleNodeToggle = (nodeId: string, collapsed: boolean): void => {
    this.#nodeToggleEvent.emit({ nodeId, collapsed });
  };

  render() {
    return (
      <WorkbenchActionsContext.Provider
        value={{
          actions: this.actions,
          actionsHidden: this.actionsHidden,
          onActionClick: this.#handleActionClick,
        }}
      >
        <WorkbenchTreeContext.Provider
          value={{
            activeKey: this.activeKey,
            basePaddingLeft: 5,
            showMatchedNodeOnly: this.showMatchedNodeOnly,
            isTransformName: this.isTransformName,
            fixedActionsFor: this.fixedActionsFor,
            nodeKey: this.nodeKey,
            collapsible: this.collapsible,
            collapsedNodes: this.collapsedNodes,
            getCollapsedId: defaultGetCollapsedId,
            onNodeToggle: this.#handleNodeToggle,
            skipNotify: this.skipNotify,
            clickFactory: this.#nodeClickFactory,
            contextMenuFactory: this.#contextMenuFactory,
            matchNode: (node, lowerTrimmedQuery) =>
              deepMatch(node.name, lowerTrimmedQuery) ||
              (!!this.matchNodeDataFields?.length &&
                deepMatch(
                  this.matchNodeDataFields === "*"
                    ? node.data
                    : pick(node.data, this.matchNodeDataFields),
                  lowerTrimmedQuery
                )),
          }}
        >
          <WorkbenchTree
            nodes={this.nodes}
            placeholder={this.placeholder}
            searchPlaceholder={this.searchPlaceholder}
            noSearch={this.noSearch}
            dropEmit={this.#handleNodeDrop}
            allowDrag={this.allowDrag}
            allowDragToInside={this.allowDragToInside}
            allowDragToRoot={this.allowDragToRoot}
          />
        </WorkbenchTreeContext.Provider>
      </WorkbenchActionsContext.Provider>
    );
  }
}

export { WorkbenchTreeElement };
