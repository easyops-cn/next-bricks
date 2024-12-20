import React, { useEffect, useMemo, useRef } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import {
  geoPath,
  geoMercator,
  type GeoPermissibleObjects,
  type ExtendedFeatureCollection,
  geoOrthographic,
} from "d3-geo";
import texturePng from "../china-map-chart/assets/texture.png";
import { rewind } from "./rewind.mjs";
import ChinaGeoJson from "../china-map-chart/map.json";
// import ChinaGeoJson from "../china-map/china-provinces-geo.json";
// import ChinaGeoJson from "../china-map/china-geo.json";
import styleText from "./styles.shadow.css";

const ChinaRewindGeoJson = rewind(ChinaGeoJson, true);

const { defineElement, property } = createDecorators();

const BASE_WIDTH = 960;
const BASE_HEIGHT = 750;

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
    return <ChinaMapComponent />;
  }
}

export interface ChinaMapComponentProps extends ChinaMapProps {
  // Define react event handlers here.
}

const pixelRatio = window.devicePixelRatio ?? 1;

const bgColors = [
  // "rgba(84, 239, 241, 0.20)",
  "rgb(37, 62, 64)",
  "rgba(190, 225, 226, 1)",
  "#000",
  "rgba(43, 100, 255, 1)",
  "#000",
];
const bgOffsets = [
  35,
  25,
  20,
  14,
  11,
];

export function ChinaMapComponent(props: ChinaMapComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const bgRef = useRef<HTMLCanvasElement[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    // context.fillStyle = "#000";
    // context.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

    context.strokeStyle = "#fff";
    context.lineWidth = 4;
    context.lineJoin = "round";
    // context.fillStyle = "#008";
    const geo: ExtendedFeatureCollection = {
      type: "FeatureCollection",
      features: (
        ChinaRewindGeoJson as ExtendedFeatureCollection
      ).features.filter((f) => f.properties.name),
    };

    const one = geo;
    const path = geoPath(
      geoMercator().fitExtent(
        [
          [20, 20],
          [BASE_WIDTH * pixelRatio - 20, BASE_HEIGHT * pixelRatio - 20],
        ],
        one
      ),
      context
    );
    // const Sphere = { type: "Sphere" } as const;
    // const one = Sphere;

    // const projection = geoOrthographic().fitExtent(
    //   [[20, 20], [BASE_WIDTH - 20, BASE_HEIGHT - 20]],
    //   // one,
    //   Sphere
    // ).rotate([-104.1954, -35.8617])//.scale(2000);

    // const path = geoPath(projection, context);

    // for (let i = 0; i < 2; i++) {
    //   context.save();
    //   context.strokeStyle = [
    //     "rgba(43, 100, 255, 1)",
    //     "rgba(84, 239, 241, 1)",
    //     "rgba(43, 100, 255, 1)",
    //   ][i];
    //   // context.lineWidth = 4;
    //   context.translate(0, 20 * (i + 1));
    //   context.beginPath();
    //   path(one);
    //   context.closePath();
    //   context.stroke();
    //   context.resetTransform();
    //   context.restore();
    // }

    {
      for (let i = 0; i < bgColors.length; i++) {
        const ctx = bgRef.current[i]!.getContext("2d")!;
        ctx.fillStyle = bgColors[i];
        // ctx.strokeStyle = "none";
        // ctx.translate(0, bgOffsets[i]);
        ctx.beginPath();
        const p = geoPath(
          geoMercator().fitExtent(
            [
              [20, 20],
              [BASE_WIDTH * pixelRatio - 20, BASE_HEIGHT * pixelRatio - 20],
            ],
            one
          ),
          ctx
        );
        p(one);
        ctx.closePath();
        ctx.fill();
      }
    }

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

      // context.save();
      // context.strokeStyle = "#3DC6FF";
      // context.beginPath();
      // path(Sphere);
      // context.closePath();
      // context.stroke();
      // context.restore();

      context.save();
      context.strokeStyle = "#3DC6FF";
      context.beginPath();
      path(one);
      context.closePath();
      context.stroke();
      context.restore();

      const SouthSea: ExtendedFeatureCollection = {
        type: "FeatureCollection",
        features: (
          ChinaRewindGeoJson as ExtendedFeatureCollection
        ).features.slice(-2),
      };
      console.log(SouthSea);

      context.save();
      context.strokeStyle = "rgb(30, 144, 255)";
      context.beginPath();
      path(SouthSea);
      context.closePath();
      context.stroke();
      context.restore();
    };
    image.src = texturePng;
  }, []);

  return (
    <div
      className="container"
      style={{ width: BASE_WIDTH, height: BASE_HEIGHT }}
    >
      {bgOffsets.map((offset, i) =>
        <canvas
          key={i}
          ref={(el) => {bgRef.current[i] = el!}}
          width={BASE_WIDTH * pixelRatio}
          height={BASE_HEIGHT * pixelRatio}
          style={{ width: BASE_WIDTH, height: BASE_HEIGHT, transform: `translate(0,${offset}px)` }}
        />
      )}
      <canvas
        ref={canvasRef}
        width={BASE_WIDTH * pixelRatio}
        height={BASE_HEIGHT * pixelRatio}
        style={{ width: BASE_WIDTH, height: BASE_HEIGHT }}
      />
    </div>
  );
}
