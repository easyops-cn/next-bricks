import React, { useCallback, useMemo, useRef } from "react";
import { ConfigProvider, Slider, theme } from "antd";
import { StyleProvider, createCache } from "@ant-design/cssinjs";
import { useCurrentTheme } from "@next-core/react-runtime";
import type { RangeTuple } from "../../diagram/interfaces";
import CenterSVG from "./icons/center.svg";
import ZoomInSVG from "./icons/zoom-in.svg";
import ZoomOutSVG from "./icons/zoom-out.svg";

export interface ZoomBarComponentProps {
  shadowRoot: ShadowRoot;
  scale: number;
  scaleRange: RangeTuple;
  onZoomChange(value: number): void;
  onReCenter(): void;
}

export function ZoomBarComponent({
  shadowRoot,
  scale,
  scaleRange,
  onZoomChange,
  onReCenter,
}: ZoomBarComponentProps): JSX.Element | null {
  const currentTheme = useCurrentTheme();
  const cache = useMemo(() => createCache(), []);
  const zoomBarRef = useRef<HTMLDivElement | null>(null);
  const min = scaleRange[0] * 100;
  const max = scaleRange[1] * 100;
  const value = scale * 100;
  const step = 5;

  const tooltip = useMemo(() => {
    return {
      formatter: (value: number | undefined) => `${value}%`,
      placement: "left" as const,
      getPopupContainer: () => zoomBarRef.current!,
    };
  }, []);

  const onZoomIn = useCallback(() => {
    onZoomChange(Math.min(value + step, max));
  }, [max, onZoomChange, value]);

  const onZoomOut = useCallback(() => {
    onZoomChange(Math.max(value - step, min));
  }, [min, onZoomChange, value]);

  return (
    <ConfigProvider
      theme={{
        algorithm:
          currentTheme === "dark-v2"
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
      }}
    >
      <StyleProvider
        container={shadowRoot}
        // Auto clear injected styles after unmount
        autoClear
        cache={cache}
        // Set hashPriority to "high" to disable `:where()` usage for compatibility
        hashPriority="high"
      >
        <div className="zoom-bar" ref={zoomBarRef}>
          <div className="center-button" onClick={onReCenter} role="button">
            <CenterSVG />
          </div>
          <div className="zoom-slider">
            <div className="zoom-button" role="button" onClick={onZoomIn}>
              <ZoomInSVG />
            </div>
            <Slider
              min={min}
              max={max}
              value={value}
              step={step}
              vertical
              included={false}
              tooltip={tooltip}
              onChange={onZoomChange}
            />
            <div className="zoom-button" role="button" onClick={onZoomOut}>
              <ZoomOutSVG />
            </div>
          </div>
        </div>
      </StyleProvider>
    </ConfigProvider>
  );
}
