import React, { MouseEvent, CSSProperties, useMemo, useState, useCallback } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import type { UseBrickConf } from "@next-core/types";
import { ReactUseMultipleBricks } from "@next-core/react-runtime";
import {
  treemap, hierarchy, stratify,
  treemapBinary, treemapDice, treemapResquarify, treemapSlice, treemapSliceDice, treemapSquarify,
} from "d3-hierarchy";
import variablesStyleText from "../data-view-variables.shadow.css";
import styleText from "./modern-style-treemap.shadow.css";
import { useResizeObserver } from "../hooks/index.js";
import { keyBy } from "lodash";

const { defineElement, property } = createDecorators();

enum TailTypes {
  treemapBinary = "treemapBinary",
  treemapDice = "treemapDice",
  treemapResquarify = "treemapResquarify",
  treemapSlice = "treemapSlice",
  treemapSliceDice = "treemapSliceDice",
  treemapSquarify = "treemapSquarify",
}

type TreemapData = {
  name: string;
  value?: number;
  children?: TreemapData[];
}

interface ModernStyleTreemapProps {
  data: TreemapData;
  tail?: TailTypes;
  leafUseBrick?: UseBrickConf;
  leafContainerStyle?: CSSProperties;
  tooltipUseBrick?: UseBrickConf;
  tooltipStyle?: CSSProperties;
}

/**
 * @id data-view.modern-style-treemap
 * @name data-view.modern-style-treemap
 * @docKind brick
 * @description 现代风树图
 * @author nlicroshan
 * @noInheritDoc
 */
@defineElement("data-view.modern-style-treemap", {
  styleTexts: [variablesStyleText, styleText],
})
class ModernStyleTreemap
  extends ReactNextElement
  implements ModernStyleTreemapProps {
  /**
   * @kind TreemapData
   * @required true
   * @default -
   * @description 数据
   */
  @property({
    attribute: false,
  })
  accessor data: TreemapData;

  /**
   * @kind TailTypes
   * @required false
   * @default treemapSquarify
   * @description 平铺方法
   */
  @property({
    attribute: false,
  })
  accessor tail: TailTypes = TailTypes["treemapSquarify"];

  /**
   * @kind UseBrickConf
   * @required false
   * @default -
   * @description 叶子节点useBrick
   */
  @property({
    attribute: false,
  })
  accessor leafUseBrick: UseBrickConf;

  /**
   * @kind CSSProperties
   * @required false
   * @default -
   * @description 叶子节点容器样式
   */
  @property({
    attribute: false,
  })
  accessor leafContainerStyle: CSSProperties;

  /**
   * @kind UseBrickConf
   * @required false
   * @default -
   * @description tooltip useBrick
   */
  @property({
    attribute: false,
  })
  accessor tooltipUseBrick: UseBrickConf;

  /**
   * @kind CSSProperties
   * @required false
   * @default -
   * @description tooltip容器样式
   */
  @property({
    attribute: false,
  })
  accessor tooltipStyle: CSSProperties;

  render() {
    return (
      <ModernStyleTreemapElement
        data={this.data}
        tail={this.tail}
        leafUseBrick={this.leafUseBrick}
        leafContainerStyle={this.leafContainerStyle}
        tooltipUseBrick={this.tooltipUseBrick}
        tooltipStyle={this.tooltipStyle}
      />
    );
  }
}

const tailMap = {
  [TailTypes["treemapBinary"]]: treemapBinary,
  [TailTypes["treemapDice"]]: treemapDice,
  [TailTypes["treemapResquarify"]]: treemapResquarify,
  [TailTypes["treemapSlice"]]: treemapSlice,
  [TailTypes["treemapSliceDice"]]: treemapSliceDice,
  [TailTypes["treemapSquarify"]]: treemapSquarify,
}

function ModernStyleTreemapElement(
  props: ModernStyleTreemapProps
): React.ReactElement {
  const { data, tail, leafUseBrick, leafContainerStyle, tooltipUseBrick, tooltipStyle } = props;

  const [wrapperRef, { clientWidth: wrapperWidth, clientHeight: wrapperHeight }] = useResizeObserver<HTMLDivElement>();
  const [tooltipRef, { clientWidth: tooltipWidth, clientHeight: tooltipHeight }] = useResizeObserver<HTMLDivElement>();
  const [mouseData, setMouseData] = useState
    <{ clientX: number, clientY: number, name?: string }>
    ({ clientX: 0, clientY: 0 });

  const hierarchyNode = useMemo(() => {
    return hierarchy(data).sum(d => d.value).sort((a, b) => b.value - a.value);
  }, [data]);

  const tm = useMemo(() => {
    return treemap<TreemapData>()
      .tile(tailMap[tail])
      .size([wrapperWidth, wrapperHeight])
      .padding(1)
      .round(true)
  }, [tail, wrapperWidth, wrapperHeight]);

  const root = useMemo(() => {
    return tm(hierarchyNode);
  }, [tm, hierarchyNode]);

  const [leaves, leavesMap] = useMemo(() => {
    const _leaves = root.leaves();
    return [_leaves, keyBy(_leaves, "data.name")];
  }, [root]);

  const curTooltipData = useMemo(() => {
    return leavesMap[mouseData.name];
  }, [leavesMap, mouseData.name]);

  const handleMouseMove = useCallback(((e: MouseEvent<HTMLDivElement>) => {
    const curLeaf = (e.target as HTMLDivElement).closest(".treemap-leaf");
    const curName = curLeaf?.getAttribute("data-leaf-id");
    setMouseData(pre => {
      return {
        clientX: e.clientX,
        clientY: e.clientY,
        name: curLeaf ? curName : pre.name,
      };
    });
  }), []);

  return (
    <div className="wrapper">
      <div
        className="treemap"
        ref={wrapperRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => {
          tooltipRef.current.style.visibility = "visible";
        }}
        onMouseLeave={() => {
          tooltipRef.current.style.visibility = "hidden";
        }}
      >
        {leaves.map(d => {
          const
            top = d.y0,
            left = d.x0,
            width = d.x1 - d.x0,
            height = d.y1 - d.y0;

          return <div key={d.data.name}
            className="treemap-leaf"
            data-leaf-id={d.data.name}
            style={{
              ...leafContainerStyle,
              top: 0,
              left: 0,
              transform: `translate(${left}px, ${top}px)`,
              width,
              height,
            }}>
            {leafUseBrick && <ReactUseMultipleBricks useBrick={leafUseBrick} data={d} />}
          </div>
        })}
      </div>
      <div className="tooltip"
        style={{
          ...tooltipStyle,
          transform: `translate(
            ${mouseData.clientX - wrapperRef.current?.getBoundingClientRect().left + 16}px,
            ${mouseData.clientY - wrapperRef.current?.getBoundingClientRect().top - tooltipHeight / 2}px)`
        }}
        ref={tooltipRef}>
        {tooltipUseBrick && <ReactUseMultipleBricks useBrick={tooltipUseBrick} data={curTooltipData} />}
      </div>
    </div>
  );
}

export { ModernStyleTreemap };
