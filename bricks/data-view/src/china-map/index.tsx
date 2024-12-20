import React, { useEffect, useRef } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import {
  geoPath,
  geoMercator,
  type ExtendedFeatureCollection,
} from "d3-geo";
import texturePng from "../china-map-chart/assets/texture.png";
import { rewind } from "./rewind.mjs";
// import ChinaGeoJson from "../china-map-chart/map.json";
// import ChinaGeoJson from "./china-provinces-geo.json";
// import ChinaGeoJson from "./china-simplified.json";
import ChinaGeoJson from "./china-simplified-alt.json";
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

const layers = [
  {
    fill: "rgba(84, 239, 241, 0.2)",
    shadowColor: "rgba(84, 239, 241, 0.2)",
    shadowBlur: 2,
    shadowOffsetY: 1,
    offset: 14,
  },
  {
    fill: "#bee1e2",
    shadowColor: "rgba(93,250,255,0.2)",
    shadowBlur: 4,
    shadowOffsetY: 10,
    offset: 11.5,
  },
  {
    fill: "#000",
    offset: 9.75,
  },
  {
    lineWidth: 1,
    strokeStyle: "#2B64FF",
    offset: 7.5,
  },
  {
    lineWidth: 1.5,
    strokeStyle: "#2B64FF",
    offset: 5,
  },
];

export function ChinaMapComponent(/* props: ChinaMapComponentProps */) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const layersRef = useRef<HTMLCanvasElement[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    context.strokeStyle = "#fff";
    context.lineWidth = 2.5 * pixelRatio;
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
          [10 * pixelRatio, 10 * pixelRatio],
          [BASE_WIDTH * pixelRatio - 10, BASE_HEIGHT * pixelRatio - 10 * pixelRatio],
        ],
        one
      ),
      context
    );

    const image = new Image();
    image.onload = () => {
      layers.forEach((layer, i) => {
        const ctx = layersRef.current[i]!.getContext("2d")!;

        if (layer.shadowColor) {
          ctx.shadowColor = layer.shadowColor;
          ctx.shadowBlur = (layer.shadowBlur ?? 0) * pixelRatio;
          ctx.shadowOffsetY = (layer.shadowOffsetY ?? 0) * pixelRatio;
        }

        ctx.beginPath();
        const p = geoPath(
          geoMercator().fitExtent(
            [
              [10 * pixelRatio, 10 * pixelRatio],
              [BASE_WIDTH * pixelRatio - 10 * pixelRatio, BASE_HEIGHT * pixelRatio - 10 * pixelRatio],
            ],
            one
          ),
          ctx
        );
        p(one);
        ctx.closePath();

        if (layer.fill) {
          ctx.fillStyle = layer.fill;
          ctx.fill();
        }

        if (layer.lineWidth) {
          ctx.strokeStyle = layer.strokeStyle;
          ctx.lineWidth = layer.lineWidth * pixelRatio;
          ctx.stroke();
        }
      });

      context.save();
      const pattern = context.createPattern(image, "repeat");
      context.fillStyle = pattern;

      context.beginPath();
      path(one);
      context.closePath();
      context.fill();
      context.restore();

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
      {layers.map((layer, i) =>
        <canvas
          key={i}
          ref={(el) => {layersRef.current[i] = el!}}
          width={BASE_WIDTH * pixelRatio}
          height={BASE_HEIGHT * pixelRatio}
          style={{ width: BASE_WIDTH, height: BASE_HEIGHT, transform: `translate(0,${layer.offset * pixelRatio}px)` }}
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
