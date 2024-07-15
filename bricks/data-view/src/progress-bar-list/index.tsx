import React, { useEffect, useRef, useState, CSSProperties } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

import { maxBy } from "lodash";

const { defineElement, property } = createDecorators();

/**
 * 构件 `data-view.progress-bar-list`
 */
export
@defineElement("data-view.progress-bar-list", {
  styleTexts: [styleText],
})
class ProgressBarList extends ReactNextElement {
  /**
   * @default
   * @required
   * @description 数据
   */
  @property({
    attribute: false,
  })
  accessor dataSource: Data[];
  render() {
    return <ProgressBarListComponent dataSource={this.dataSource} />;
  }
}

export interface ProgressBarListProps {
  dataSource: Data[];
  // Define props here.
}
interface Data {
  title: string;
  count: number;
  loopBackground?: CSSProperties["background"];
  barBackground?: CSSProperties["background"];
}
export function ProgressBarListComponent(props: ProgressBarListProps) {
  const { dataSource = [] } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [barWidth, setBarWidth] = useState<number>();
  const [list, setList] = useState<(Data & { width: number })[]>([]);

  useEffect(() => {
    const element = containerRef.current;
    if (element) {
      const observer = new ResizeObserver((entries) => {
        let containerWidth: number = 0;
        for (const entry of entries) {
          containerWidth = entry.contentRect.width;
        }
        setBarWidth(containerWidth - 225);
      });

      observer.observe(element);
      return () => observer.disconnect();
    }
  }, []);
  useEffect(() => {
    if (barWidth && dataSource.length) {
      const maxData = maxBy(dataSource, "count");
      setList(
        dataSource.map((i) => ({
          ...i,
          width: (barWidth * i.count) / maxData.count,
        }))
      );
    }
  }, [dataSource, barWidth]);
  return (
    <div className="container" ref={containerRef}>
      {list.map((i, index) => (
        <div className="outermostContainer" key={index}>
          <div className="titleText">{i.title}</div>
          <div className="innerBarContainer">
            <div
              className="barContainer"
              style={{
                width: i.width,
                left: -i.width,
                background:
                  i.barBackground ||
                  "linear-gradient( 90deg, rgba(66,130,237,0) 0%, #4282ED 100%)",
              }}
            >
              <div
                className="smallLoop"
                style={{
                  background: i.loopBackground || "#4282ED",
                }}
              ></div>

              <div
                style={{
                  border: `1px solid ${i.loopBackground || "#4282ED"}`,
                }}
                className="bigLoop"
              ></div>
            </div>
            <div
              className="barBgContent"
              style={{
                width: barWidth,
              }}
            ></div>
          </div>

          <div className="countText">{i.count}</div>
        </div>
      ))}
    </div>
  );
}
