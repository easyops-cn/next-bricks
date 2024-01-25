import React, {
  type ChangeEvent,
  useCallback,
  useMemo,
  useState,
  type ReactElement,
  createContext,
  useContext,
  useEffect,
} from "react";
// import { Input } from "antd";
import { get, isMatch, pick } from "lodash";
import classNames from "classnames";
import { useWorkbenchTreeContext } from "./WorkbenchTreeContext.js";
import { useWorkbenchActionsContext } from "./WorkbenchActionsContext.js";
import {
  useWorkbenchTreeDndContext,
  dragStatusEnum,
} from "./WorkbenchTreeDndContext.js";
import type { WorkbenchNodeData } from "../../interfaces.js";
import { WorkbenchMiniActionBar } from "../workbench-mini-action-bar/WorkbenchMiniActionBar.js";
import { checkIfOfComputed } from "@next-core/runtime";
import { WorkbenchTreeDndContext } from "./WorkbenchTreeDndContext.js";
import { setDragImage } from "../../utils/setDragImage.js";
import classnames from "classnames";
import {
  getNodesByPathTree,
  getNodeTreeByPath,
} from "../../utils/normalizeTreeNodeWithPath.js";
import { wrapBrick } from "@next-core/react-element";
import type { Link, LinkProps } from "@next-bricks/basic/link";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";

export const WrappedLink = wrapBrick<Link, LinkProps>("basic.general-link");
export const WrappedGeneralIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "icons.general-icon"
);

const treeLevelPadding = 10;
const borderStyle = "0 0 0 1px #ba6d30";

export interface dropEmitProps {
  nodes: WorkbenchNodeData[];
  curNode: WorkbenchNodeData;
  overNode: WorkbenchNodeData;
  status: dragStatusEnum;
}

export interface WorkbenchTreeProps {
  nodes: WorkbenchNodeData[];
  placeholder?: string;
  searchPlaceholder?: string;
  noSearch?: boolean;
  isDrag?: boolean;
  allowDrag?: boolean;
  allowDragToRoot?: boolean;
  allowDragToInside?: boolean;
  dropEmit?: (detail: dropEmitProps) => void;
}

export interface TreeListProps {
  nodes: WorkbenchNodeData[];
  level: number;
}

const SearchingContext = createContext(false);

export function WorkbenchTree({
  nodes: originNode,
  placeholder,
  searchPlaceholder,
  isDrag,
  noSearch,
  allowDrag,
  allowDragToRoot,
  allowDragToInside,
  dropEmit,
}: WorkbenchTreeProps): ReactElement {
  const [q, setQ] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(isDrag);
  const [curNode, setCurNode] = useState<WorkbenchNodeData>();
  const [curElement, setCurElement] = useState<HTMLElement>();
  const [overNode, setOverNode] = useState<WorkbenchNodeData>();
  const [overElement, setOverElement] = useState<HTMLElement>();
  const [overStatus, setOverStatus] = useState<dragStatusEnum>();
  const [isFocus, setIsFocus] = useState<boolean>();
  const { nodeKey, onBrickDrop, contextMenuFactory, matchNode } =
    useWorkbenchTreeContext();
  const nodes = useMemo(
    () => getNodeTreeByPath(originNode?.slice() ?? [], nodeKey),
    [originNode, nodeKey]
  );

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setQ(event.target.value);
    },
    []
  );

  const handleClearInput = () => {
    setQ("");
  };

  const onContextMenu = useMemo(
    () => contextMenuFactory?.(),
    [contextMenuFactory]
  );

  const trimmedLowerQ = q?.trim().toLowerCase();
  const filteredNodes = useMemo(() => {
    if (noSearch || !trimmedLowerQ || !nodes) {
      return nodes;
    }
    const walk = (node: WorkbenchNodeData): boolean => {
      node.matchedSelf = matchNode(node, trimmedLowerQ);
      const hasMatchedChildren = node.children?.map(walk).includes(true);
      node.matched = node.matchedSelf || hasMatchedChildren;
      return node.matched;
    };
    nodes.forEach(walk);
    return nodes.slice();
  }, [noSearch, trimmedLowerQ, nodes, matchNode]);

  const findDragParent = (element: HTMLElement, equal = true): HTMLElement => {
    let node = element;
    while (node) {
      if (
        node.draggable &&
        (equal || node !== element) &&
        node.tagName !== "A"
      ) {
        return node;
      }
      node = node.parentElement;
    }
  };

  const findNode = (
    nodes: WorkbenchNodeData[],
    id: string,
    nodeKey: string,
    node: WorkbenchNodeData = null
  ): WorkbenchNodeData => {
    for (const item of nodes) {
      if ((item.data as Record<string, unknown>)[nodeKey] === id) {
        node = item;
      }
      if (item.children) {
        node = findNode(item.children, id, nodeKey, node);
      }
      if (node) break;
    }
    return node;
  };

  const getDragState = (
    e: React.DragEvent<HTMLElement>
  ): {
    element: HTMLElement;
    node: WorkbenchNodeData;
    status: dragStatusEnum;
  } => {
    const element = findDragParent(e.target as HTMLElement);
    const id = element.dataset.uid;
    if (element === curElement || id?.includes(":")) {
      return;
    }
    const { top, bottom } = element.getBoundingClientRect();
    let status: dragStatusEnum;
    const repair = allowDragToInside ? 5 : 10;
    if (e.clientY < top + repair) {
      status = dragStatusEnum.top;
    } else if (e.clientY > bottom - repair) {
      status = dragStatusEnum.bottom;
    } else {
      status = allowDragToInside ? dragStatusEnum.inside : overStatus;
    }

    return {
      element,
      node: findNode(nodes, id, nodeKey),
      status,
    };
  };

  const handleOnDragStart = (
    e: React.DragEvent,
    node: WorkbenchNodeData
  ): void => {
    e.stopPropagation();
    if (!allowDrag) return;
    const element = e.target as HTMLElement;
    if (element.dataset?.container) return;
    setIsDragging(true);
    setDragImage(e, element.innerText);
    setCurElement(element);
    setCurNode(node);
  };

  const handleOnDragOver = (e: React.DragEvent<HTMLElement>): void => {
    e.preventDefault();
    if (!isDragging) return;
    if ((e.target as HTMLElement).className === "workbenchTree-placeholder-dom")
      return;
    const dom = getDragState(e);
    if (dom && !curElement?.contains(dom.element)) {
      setOverElement(dom.element);
      setOverNode(dom.node);
      setOverStatus(dom.status);
    }
  };

  const handleOnDragEnd = (): void => {
    setCurElement(null);
    setOverElement(null);
    setOverNode(null);
    setOverStatus(null);
    setIsDragging(false);
  };

  const handleOnDrop = (e: React.DragEvent<HTMLElement>): void => {
    if (!isDragging) return;
    if (onBrickDrop) {
      let parentElement = overElement;
      if ([dragStatusEnum.top, dragStatusEnum.bottom].includes(overStatus)) {
        parentElement = findDragParent(parentElement, false);
      }
      onBrickDrop(e, {
        curElement,
        overElement,
        parentElement,
        overStatus,
      });
    } else {
      if (allowDragToRoot || Number(overElement.dataset.level) !== 1) {
        let realOverNode = overNode;
        const findRealNode = (
          nodes: WorkbenchNodeData[],
          key: string
        ): void => {
          for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].key === key) {
              realOverNode = nodes[i];
              break;
            }
            if (nodes[i].children) {
              findRealNode(nodes[i].children, key);
            }
          }
        };
        const overUid = overElement.dataset.uid;
        findRealNode(nodes, overUid);
        const filterNodes = (
          nodes: WorkbenchNodeData[]
        ): WorkbenchNodeData[] => {
          let flag = false;
          const { container, uid } = overElement.dataset;
          const realOverKey = container ? realOverNode.originKey : uid;
          const newNodes = nodes.filter((node) => {
            if (node.children) {
              node.children = filterNodes(node.children);
            }
            if (node.key === realOverKey) flag = true;
            return node.key !== curNode.key;
          });
          if (flag) {
            newNodes.splice(
              newNodes.findIndex((item) => item.key === realOverKey) +
                (overStatus === "bottom" ? 1 : 0),
              0,
              curNode
            );
          }
          return newNodes;
        };

        const normalizeNode = getNodesByPathTree(nodes);
        const realCurNode = curNode.isContainer
          ? normalizeNode.find((item) => item.key === curNode.originKey)
          : curNode;
        const curNodeData = realCurNode.data as Record<string, unknown>;
        curNodeData.path = realOverNode.parentPath || realOverNode.path;

        dropEmit({
          nodes: filterNodes(normalizeNode),
          curNode: realCurNode,
          overNode: realOverNode,
          status: overStatus,
        });
      }
    }
    handleOnDragEnd();
  };

  useEffect(() => {
    setIsDragging(isDrag);
  }, [isDrag]);

  useEffect(() => {
    window.addEventListener("dragend", handleOnDragEnd);
    return () => {
      window.removeEventListener("dragend", handleOnDragEnd);
    };
  }, []);

  return (
    <div
      style={{
        height: "100%",
      }}
      className="tree-wrapper"
      onContextMenu={onContextMenu}
    >
      {nodes?.length ? (
        <div>
          {!noSearch && (
            <div
              className="searchBox"
              onContextMenu={(e) => e.stopPropagation()}
            >
              <span
                className={classNames("filter-input-wrapper", {
                  focus: isFocus,
                })}
              >
                <span className="prefix">
                  <WrappedGeneralIcon
                    icon="search"
                    lib="antd"
                    theme="outlined"
                  />
                </span>
                <input
                  value={q}
                  onChange={handleSearchChange}
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  autoComplete="off"
                  placeholder={searchPlaceholder}
                />
                <span className="suffix">
                  {q ? (
                    <WrappedGeneralIcon
                      className="clear-button"
                      icon="close-circle"
                      lib="antd"
                      theme="filled"
                      onClick={handleClearInput}
                    />
                  ) : null}
                </span>
              </span>
            </div>
          )}
          <SearchingContext.Provider value={!!q}>
            <WorkbenchTreeDndContext.Provider
              value={{
                allow: allowDrag,
                allowDragToRoot: allowDragToRoot,
                dragElement: curElement,
                dragOverElement: overElement,
                dragStatus: overStatus,
                onDragStart: handleOnDragStart,
              }}
            >
              <div
                className={classnames({
                  hightlight: isDrag,
                })}
                onDragOver={handleOnDragOver}
                onDrop={handleOnDrop}
              >
                <TreeList nodes={filteredNodes} level={1} />
              </div>
            </WorkbenchTreeDndContext.Provider>
          </SearchingContext.Provider>
        </div>
      ) : (
        <div className="placeholder">{placeholder}</div>
      )}
    </div>
  );
}

function TreeList({ nodes, level }: TreeListProps): ReactElement {
  const lastIndex = nodes.length - 1;
  return (
    <ul className="tree">
      {nodes
        .filter((item) => checkIfOfComputed(item))
        .map((node, index) => (
          <TreeNode
            key={node.key}
            node={node}
            level={level}
            isFirst={index === 0}
            isLast={index === lastIndex}
          />
        ))}
    </ul>
  );
}

function PlaceholderDOM({
  style,
}: {
  style: React.CSSProperties;
}): React.ReactElement {
  const { dragStatus } = useWorkbenchTreeDndContext();
  const styles: React.CSSProperties = {
    height: 22,
    border: "1px dashed goldenrod",
    opacity: dragStatus === dragStatusEnum.inside ? "0" : "1",
    ...style,
  };

  return <li className="workbenchTree-placeholder-dom" style={styles} />;
}
export interface TreeNodeProps {
  node: WorkbenchNodeData;
  level: number;
  isFirst?: boolean;
  isLast?: boolean;
  skipNotify?: boolean;
}

function TreeNode({
  node,
  level,
  isFirst,
  isLast,
}: TreeNodeProps): ReactElement {
  const isLeaf = !node.children?.length;
  const isContainer = node.isContainer;
  const {
    hoverKey,
    activeKey,
    basePaddingLeft,
    showMatchedNodeOnly,
    fixedActionsFor,
    collapsible,
    collapsedNodes,
    nodeKey,
    clickFactory,
    mouseEnterFactory,
    mouseLeaveFactory,
    contextMenuFactory,
    onNodeToggle,
    getCollapsedId,
    skipNotify,
  } = useWorkbenchTreeContext();
  const {
    allow,
    allowDragToRoot,
    onDragStart,
    dragElement,
    dragOverElement,
    dragStatus,
  } = useWorkbenchTreeDndContext();

  const { actions, actionsHidden, onActionClick } =
    useWorkbenchActionsContext();

  const nodePaddingLeft = level * treeLevelPadding + basePaddingLeft - 2;
  const searching = useContext(SearchingContext);
  const [cacheDragStatus, setCacheDragStatus] = useState(null);
  const [collapseClicked, setCollapseClicked] = useState(false);
  const [collapsed, setCollapsed] = useState(
    collapsedNodes?.includes(getCollapsedId?.(node)) ?? false
  );

  const onMouseEnter = useMemo(
    () => mouseEnterFactory?.(node),
    [mouseEnterFactory, node]
  );
  const onMouseLeave = useMemo(
    () => mouseLeaveFactory?.(node),
    [mouseLeaveFactory, node]
  );

  const onContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      contextMenuFactory?.(node)?.(e);
    },
    [contextMenuFactory, node]
  );

  const isActive = activeKey && node.key === activeKey;

  const nodeLabelCallback = useMemo(
    () =>
      isActive
        ? (element: HTMLElement) => {
            element?.scrollIntoView?.({
              block: "center",
              inline: "center",
              // behavior: "smooth",
            });
          }
        : null,
    // Only for initial active node.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const nodeUid = useMemo(() => {
    if (isContainer) {
      return node.key;
    }
    if (node.data) {
      const getNodeUid = (data: Record<string, any>): number | string => {
        return data.type === "mount-point"
          ? data.parent[nodeKey] || `${data.parent.$$uid}:${data.mountPoint}`
          : data[nodeKey] || data.$$uid;
      };
      return getNodeUid(node.data);
    }
  }, [nodeKey, node, isContainer]);

  useEffect(() => {
    if (dragStatus === dragStatusEnum.inside) {
      return;
    }
    if ([dragStatusEnum.top, dragStatusEnum.bottom].includes(dragStatus)) {
      setCacheDragStatus(dragStatus);
    }
  }, [dragStatus]);

  const isDragElement = useMemo(() => {
    if (dragElement) {
      const dragUid = dragElement.dataset.uid;
      return dragUid === String(nodeUid);
    }
    return false;
  }, [dragElement, nodeUid]);

  const isDragActive = useMemo(() => {
    if (dragOverElement) {
      const dragUid = dragOverElement.dataset.uid;
      return dragUid === String(nodeUid);
    }
    return false;
  }, [dragOverElement, nodeUid]);

  const nodeStyle = useMemo((): React.CSSProperties => {
    const commomStyle: React.CSSProperties = {};
    let style: React.CSSProperties = {
      opacity: isDragElement ? 0.2 : 1,
    };
    if (isDragActive) {
      if (dragStatus === dragStatusEnum.inside) {
        style = {
          boxShadow: borderStyle,
          background: "rgba(255, 255, 255, 0.1)",
        };
      }
    }
    return Object.assign(commomStyle, style);
  }, [isDragActive, isDragElement, dragStatus]);

  const handleCollapse = useCallback((event: React.MouseEvent | MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setCollapseClicked(true);
    setCollapsed((prev) => !prev);
  }, []);

  const preventMouseEvent = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const onLinkClick = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      if (isContainer) {
        handleCollapse(e);
      } else {
        return clickFactory?.(node)?.();
      }
    },
    [clickFactory, handleCollapse, isContainer, node]
  );

  useEffect(() => {
    if (collapseClicked) {
      onNodeToggle?.(getCollapsedId?.(node), collapsed);
    }
  }, [collapseClicked, collapsed, getCollapsedId, node, onNodeToggle]);

  // Disallow collapse leaf nodes, or any nodes when searching.
  const allowCollapse = collapsible && !isLeaf && !searching;

  if (searching && showMatchedNodeOnly && !node.matched) {
    return null;
  }

  return (
    <>
      {isDragActive &&
        (allowDragToRoot || level !== 1) &&
        cacheDragStatus === dragStatusEnum.top && (
          <PlaceholderDOM
            style={{
              marginLeft: nodePaddingLeft,
            }}
          />
        )}
      <li
        draggable={allow}
        onDragStart={(e) => onDragStart(e, node)}
        data-uid={nodeUid}
        data-level={level}
        style={nodeStyle}
        {...(isContainer
          ? {
              "data-container": isContainer,
            }
          : {})}
      >
        <WrappedLink
          tabIndex={0}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onContextMenu={onContextMenu}
          // noEmptyHref={true}
          onClick={onLinkClick}
          {...(skipNotify
            ? {
                // TODO: link should support
                url: {
                  pathname: get(node.link, "url", "href"),
                  state: {
                    notify: false,
                  },
                } as any,
              }
            : { ...pick(node.link, ["url", "href"]) })}
        >
          <span
            className={classNames("nodeLabelRow", {
              active: isActive,
              hover: hoverKey && node.key === hoverKey,
              matched: searching && node.matchedSelf && !showMatchedNodeOnly,
              fixedActions:
                fixedActionsFor &&
                []
                  .concat(fixedActionsFor)
                  .some((source) =>
                    isMatch(node.data as Record<string, unknown>, source)
                  ),
              collapsed: allowCollapse && collapsed,
              collapsible: allowCollapse,
            })}
          >
            <span
              className={classNames("nodeLabel", {
                unreachable: node.unreachable,
              })}
              style={{
                paddingLeft: nodePaddingLeft,
                color: node.labelColor,
              }}
              ref={nodeLabelCallback}
            >
              <span className="nodeIconWrapper">
                {allowCollapse && (
                  <span
                    className="collapseIcon"
                    onClick={handleCollapse}
                    onMouseDown={preventMouseEvent}
                    title={collapsed ? "Expand" : "Collapse"}
                    role="button"
                  >
                    <WrappedGeneralIcon
                      lib="antd"
                      theme="outlined"
                      icon={collapsed ? "right" : "down"}
                    />
                  </span>
                )}
                <span className="nodeIcon">
                  <WrappedGeneralIcon
                    {...(node.icon as GeneralIconProps)}
                    style={{
                      fontSize: (node.icon as unknown as Record<string, string>)
                        ?.imgSrc
                        ? 14
                        : null,
                    }}
                  />
                </span>
              </span>
              <span className="nodeName">
                {/* {isTransformName
                  ? smartDisplayForEvaluableString(node.name)
                  : node.name} */}
                {node.name}
              </span>
            </span>
            <WorkbenchMiniActionBar
              className="nodeActionsBar"
              data={node.data}
              isFirst={isFirst}
              isLast={isLast}
              actions={actions}
              onActionClick={onActionClick}
              actionsHidden={actionsHidden}
            />
            {node.badge && (
              <span className="badge">
                <WrappedGeneralIcon {...(node.badge as GeneralIconProps)} />
              </span>
            )}
          </span>
        </WrappedLink>
        {isLeaf || <TreeList nodes={node.children} level={level + 1} />}
      </li>
      {isDragActive &&
        (allowDragToRoot || level !== 1) &&
        cacheDragStatus === dragStatusEnum.bottom && (
          <PlaceholderDOM
            style={{
              marginLeft: nodePaddingLeft,
            }}
          />
        )}
    </>
  );
}
