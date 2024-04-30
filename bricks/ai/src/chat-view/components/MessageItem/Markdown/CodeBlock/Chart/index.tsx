import React, { useEffect, useMemo, useRef } from "react";
import { Chart } from "@antv/g2";

export default function ChartComponent({
  data,
  params,
}: {
  data: {
    list: Array<Record<string, any>>;
  };
  params: {
    measures: Array<{ name: string }>;
    [k: string]: any;
  };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Chart>();

  const dataSource = useMemo(() => {
    return data?.list ?? [];
  }, [data]);

  const xField = useMemo(() => {
    return params.measures?.[0]?.name;
  }, [params]);

  useEffect(() => {
    if (dataSource.length && xField) {
      chartRef.current = new Chart({
        container: containerRef.current!,
        autoFit: true,
      });

      const chart = chartRef.current;

      chart
        .line()
        .encode("shape", "smooth")
        .data(
          dataSource.map((item) => ({
            ...item,
            time: (item.time as number) * 1000,
          }))
        )
        .encode("x", (d: Record<string, any>) => new Date(d.time))
        .encode("y", xField)
        .scale("x", {
          padding: 0.5,
        })
        .scale("y", {
          nice: true,
        })
        // https://github.com/antvis/G2/issues/6213
        // 由于 tooltip 显示在 shadow-dom 下有问题，故先隐藏
        .tooltip(false);

      // 渲染可视化
      chart.render();
      return () => {
        chart.destroy();
      };
    }
  }, [dataSource, xField]);

  return dataSource.length ? (
    <div className="chart-wrapper" ref={containerRef} />
  ) : (
    <div className="empty-tip">无数据</div>
  );
}
