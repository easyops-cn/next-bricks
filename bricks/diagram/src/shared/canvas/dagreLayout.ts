import { pick } from "lodash";
import dagre from "@dagrejs/dagre";
import { extractPartialRectTuple } from "../../diagram/processors/extractPartialRectTuple";
import type {
  Cell,
  ForceNode,
  LayoutOptionsDagre,
  NodeId,
  NodeView,
} from "../../draw-canvas/interfaces";
import { isEdgeCell, isNodeCell } from "../../draw-canvas/processors/asserts";
import type { FullRectTuple } from "../../diagram/interfaces";

export interface DagreLayoutOptions {
  cells: Cell[];
  layoutOptions?: LayoutOptionsDagre;
}

export function dagreLayout({ cells, layoutOptions }: DagreLayoutOptions): {
  getNodeView: (id: NodeId) => NodeView;
  nodePaddings: FullRectTuple;
} {
  const { nodePadding, ...dagreGraphOptions } = {
    nodePadding: 0,
    rankdir: "TB",
    ranksep: 50,
    edgesep: 10,
    nodesep: 50,
    // align: undefined,
    ...pick(layoutOptions, [
      "nodePadding",
      "rankdir",
      "ranksep",
      "edgesep",
      "nodesep",
      "align",
    ]),
  };
  const nodePaddings = extractPartialRectTuple(nodePadding);
  const graph = new dagre.graphlib.Graph<ForceNode>();
  graph.setGraph(dagreGraphOptions);
  // Default to assigning a new object as a label for each new edge.
  graph.setDefaultEdgeLabel(function () {
    return {};
  });
  for (const cell of cells) {
    if (isNodeCell(cell)) {
      graph.setNode(cell.id, {
        id: cell.id,
        width: cell.view.width + nodePaddings[1] + nodePaddings[3],
        height: cell.view.height + nodePaddings[0] + nodePaddings[2],
      });
    } else if (isEdgeCell(cell)) {
      graph.setEdge(cell.source, cell.target);
    }
  }
  dagre.layout(graph);

  return {
    getNodeView: (id: NodeId) => graph.node(id),
    nodePaddings,
  };
}
