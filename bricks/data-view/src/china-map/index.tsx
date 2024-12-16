import React, { useEffect, useMemo, useRef } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import { geoPath, geoMercator, type GeoPermissibleObjects } from "d3-geo";
import texturePng from "../china-map-chart/assets/texture.png";
import { rewind } from "./rewind.mjs";
// import ChinaGeoJson from "../china-map-chart/map.json";
// import ChinaGeoJson from "../china-map/china-provinces-geo.json";
import ChinaGeoJson from "../china-map/china-geo.json";
import styleText from "./styles.shadow.css";

const ChinaRewindGeoJson = rewind(ChinaGeoJson, true);

const { defineElement, property } = createDecorators();

const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1500;

export interface ChinaMapProps {
  // Define props here.
}

/**
 * 构件 `data-view.china-map`
 */
export
@defineElement("data-view.china-map", {
  styleTexts: [styleText],
})
class ChinaMap extends ReactNextElement implements ChinaMapProps {
  render() {
    return (
      <ChinaMapComponent />
    );
  }
}

export interface ChinaMapComponentProps extends ChinaMapProps {
  // Define react event handlers here.
}

export function ChinaMapComponent(props: ChinaMapComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    // context.fillStyle = "#000";
    // context.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

    context.strokeStyle = "#fff";
    context.lineWidth = 8;
    context.lineJoin = "round";
    // context.fillStyle = "#008";
    const geo = {
      type: "FeatureCollection",
      features: (ChinaRewindGeoJson as any).features.filter(f => f.properties.name),
    } as GeoPermissibleObjects;

    const one = geo;

    const path = geoPath(geoMercator().fitExtent(
      [[20, 20], [BASE_WIDTH - 20, BASE_HEIGHT - 20]],
      one,
    ), context);
    const [[x0, y0], [x1, y1]] = path.bounds(one);
    console.log(x0, y0, x1, y1);

    for (let i = 0; i < 3; i++) {
      context.save();
      context.strokeStyle = [
        "rgba(43, 100, 255, 1)",
        "rgba(84, 239, 241, 1)",
        "rgba(43, 100, 255, 1)"
      ][i];
      context.lineWidth = 4;
      context.translate(0, 20 * (i + 1));
      context.beginPath();
      path(one);
      context.closePath();
      context.stroke();
      context.resetTransform();
      context.restore();
    }

    context.save();
    context.strokeStyle = "#3DC6FF";
    context.beginPath();
    path(one);
    context.closePath();
    context.stroke();
    context.restore();

    const image = new Image();
    image.onload = () => {
      context.save();
      const pattern = context.createPattern(image, "repeat");
      context.fillStyle = pattern;
      context.beginPath();
      path(one);
      context.closePath();
      context.fill();
      // context.clip();
      // context.drawImage(image, 0, 0/* , 2572, 1706 */);
      context.restore();
    };
    image.src = texturePng;
  }, []);

  return <canvas width={BASE_WIDTH} height={BASE_HEIGHT} ref={canvasRef} />;
}
