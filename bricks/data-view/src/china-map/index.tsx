import React, { useEffect, useRef, useState } from "react";
import { groupBy } from "lodash";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import { geoPath, geoMercator, type ExtendedFeatureCollection } from "d3-geo";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { useContainerScale } from "../shared/useContainerScale";
import texturePng from "../china-map-chart/assets/texture.png";
import markerSvg from "../china-map-chart/assets/default.svg?url";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

const BASE_WIDTH = 960;
const BASE_HEIGHT = 750;
const pixelRatio = window.devicePixelRatio ?? 1;
const layers = [
  {
    fill: "rgba(84, 239, 241, 0.2)",
    shadowColor: "rgba(84, 239, 241, 0.2)",
    shadowBlur: 2,
    shadowOffsetY: 1,
    offset: 28,
  },
  {
    fill: "#bee1e2",
    shadowColor: "rgba(93,250,255,0.2)",
    shadowBlur: 4,
    shadowOffsetY: 10,
    offset: 23,
  },
  {
    fill: "#000",
    offset: 19.5,
  },
  {
    lineWidth: 1,
    strokeStyle: "#2B64FF",
    offset: 15,
  },
  {
    lineWidth: 1.5,
    strokeStyle: "#2B64FF",
    offset: 10,
  },
];

export interface ChinaMapProps {
  province?: string;
  dataSource?: DataItem[];
  maxScale?: number;
}

export interface DataItem {
  province?: string;
  city?: string;
  text: string;
}

/**
 * 构件 `data-view.china-map`
 */
export
@defineElement("data-view.china-map", {
  styleTexts: [styleText],
})
class ChinaMap extends ReactNextElement implements ChinaMapProps {
  /**
   * 省份名称，例如“广东”。如果设置，则只显示该省份的地图，否则显示全国地图
   */
  @property()
  accessor province: string | undefined;

  /**
   * 数据源
   */
  @property({ attribute: false })
  accessor dataSource: DataItem[] | undefined;

  /**
   * 最大缩放比例
   *
   * @default 1
   */
  @property({ type: Number })
  accessor maxScale: number | undefined;

  render() {
    return (
      <ChinaMapComponent
        root={this}
        province={this.province}
        dataSource={this.dataSource}
        maxScale={this.maxScale}
      />
    );
  }
}

export interface ChinaMapComponentProps extends ChinaMapProps {
  root: ChinaMap;
}

interface Area {
  name: string;
  level: "country" | "province" | "city" | "district";
  adcode: number;
  lng: number;
  lat: number;
  parent: number;
}

interface Label {
  left: number;
  top: number;
  text: string;
  align: "left" | "right";
}

export function ChinaMapComponent({
  root,
  province,
  dataSource,
  maxScale,
}: ChinaMapComponentProps) {
  const scale = useContainerScale({
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
    root,
    maxScale,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [labels, setLabels] = useState<Label[]>([]);

  // true: loaded
  // false: loading
  // string: error
  const [state, setState] = useState<boolean | string>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    let ignore = false;

    (async () => {
      let geo: ExtendedFeatureCollection;
      let SouthSea: ExtendedFeatureCollection;
      let matchedProvince: Area | undefined;
      let AreaList: Area[] | undefined;

      let image: HTMLImageElement;
      try {
        [image] = await Promise.all([
          new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            // istanbul ignore next: can't mock image
            img.onload = () => {
              resolve(img);
            };
            // istanbul ignore next: can't mock image
            img.onerror = (reason) => {
              reject(reason);
            };
            img.src = texturePng;
            // istanbul ignore next: can't mock image
            if (process.env.NODE_ENV === "test") {
              resolve(null);
            }
          }),
          (async () => {
            if (province) {
              const [CitiesImport, AreaListImport] = await Promise.all([
                import("./cities.json"),
                import("../china-map-chart/area-list.json"),
              ]);

              const Cities =
                CitiesImport.default as unknown as ExtendedFeatureCollection;
              AreaList = AreaListImport.default as unknown as Area[];
              matchedProvince = AreaList.find(
                (a) => a.level === "province" && a.name.includes(province)
              );
              if (!matchedProvince) {
                throw new Error(`没有找到省份："${province}"`);
              }
              geo = {
                type: "FeatureCollection",
                features: Cities.features.filter(
                  (f) => f.properties.province_adcode === matchedProvince.adcode
                ),
              };
            } else {
              const ChinaImport = await import("./provinces.json");
              const ChinaGeoJson =
                ChinaImport.default as unknown as ExtendedFeatureCollection;
              const geoGroup = groupBy(ChinaGeoJson.features, (f) =>
                f.properties.name ? "main-land" : "south-sea"
              );
              geo = {
                type: "FeatureCollection",
                features: geoGroup["main-land"],
              };
              SouthSea = {
                type: "FeatureCollection",
                features: geoGroup["south-sea"],
              };
            }
          })(),
        ]);
      } catch (e) {
        if (!ignore) {
          setState(String(e));
          context.clearRect(
            0,
            0,
            BASE_WIDTH * pixelRatio,
            BASE_HEIGHT * pixelRatio
          );
          setLabels([]);
        }
        return;
      }

      if (ignore) {
        return;
      }

      setState(true);

      context.clearRect(
        0,
        0,
        BASE_WIDTH * pixelRatio,
        BASE_HEIGHT * pixelRatio
      );

      context.strokeStyle = "#fff";
      context.lineWidth = 2.5 * pixelRatio;
      context.lineJoin = "round";

      const projection = geoMercator().fitExtent(
        [
          [10 * pixelRatio, 10 * pixelRatio],
          [(BASE_WIDTH - 10) * pixelRatio, (BASE_HEIGHT - 25) * pixelRatio],
        ],
        geo
      );
      const path = geoPath(projection, context);

      // 3D 效果层
      layers.forEach((layer) => {
        const ctx = context;
        context.save();
        context.translate(0, layer.offset * pixelRatio);

        if (layer.shadowColor) {
          ctx.shadowColor = layer.shadowColor;
          ctx.shadowBlur = (layer.shadowBlur ?? 0) * pixelRatio;
          ctx.shadowOffsetY = (layer.shadowOffsetY ?? 0) * pixelRatio;
        }

        ctx.beginPath();
        const p = geoPath(projection, ctx);
        p(geo);
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
        context.restore();
      });

      // 纹理填充
      context.save();
      // istanbul ignore next: can't mock image
      if (process.env.NODE_ENV !== "test") {
        const pattern = context.createPattern(image, "repeat");
        context.fillStyle = pattern;
      }
      context.beginPath();
      path(geo);
      context.closePath();
      context.fill();
      context.restore();

      // 边界线
      context.save();
      context.strokeStyle = "#3DC6FF";
      context.beginPath();
      path(geo);
      context.closePath();
      context.stroke();
      context.restore();

      // 南海
      if (!province) {
        context.save();
        context.strokeStyle = "rgb(30, 144, 255)";
        context.beginPath();
        path(SouthSea);
        context.closePath();
        context.stroke();
        context.restore();
      }

      // 标签
      setLabels(
        dataSource?.flatMap<Label>((label) => {
          let lng: number;
          let lat: number;
          if (matchedProvince) {
            const area = AreaList.find(
              (a) =>
                a.level === "city" &&
                a.parent === matchedProvince.adcode &&
                a.name.includes(label.city)
            );
            if (!area) {
              return [];
            }
            ({ lng, lat } = area);
          } else {
            const feature = geo.features.find(
              (f) =>
                f.properties.level === "province" &&
                f.properties.name.includes(label.province)
            );
            if (!feature) {
              return [];
            }
            [lng, lat] = feature.properties.cp ?? feature.properties.center;
          }

          const point = projection([lng, lat]);
          const left = point[0] / pixelRatio;
          const top = point[1] / pixelRatio;

          return {
            left,
            top,
            text: label.text,
            // 防止标签超出边界，将最右侧的标签左对齐
            align: left > BASE_WIDTH - 150 ? "left" : "right",
          };
        })
      );
    })();

    return () => {
      ignore = true;
    };
  }, [province, dataSource]);

  return (
    <div
      className="container"
      style={
        {
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          visibility: scale === null ? "hidden" : "visible",
          "--scale": scale,
        } as React.CSSProperties & {
          "--scale": number;
        }
      }
    >
      {state !== true && (
        <div
          className="message"
          style={{ width: BASE_WIDTH, height: BASE_HEIGHT }}
        >
          {state === false && (
            <WrappedIcon
              lib="antd"
              icon="loading"
              spinning
              className="loading"
            />
          )}
          {typeof state === "string" && <div className="error">{state}</div>}
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={BASE_WIDTH * pixelRatio}
        height={BASE_HEIGHT * pixelRatio}
        style={{ width: BASE_WIDTH, height: BASE_HEIGHT }}
      />
      <div
        className="labels"
        style={{
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
        }}
      >
        {labels?.map((label, index) => (
          <div
            key={index}
            className={`label ${label.align}`}
            style={{ left: label.left, top: label.top }}
          >
            <img width={28} height={32} className="marker" src={markerSvg} />
            <div className="text">{label.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
