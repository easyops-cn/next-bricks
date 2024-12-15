import React, { useEffect, useRef, useState, CSSProperties } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import {
  Scene,
  PolygonLayer,
  LineLayer,
  Marker,
  ImageLayer,
  type ILayer,
  type Point,
} from "@antv/l7";
import { Map } from "@antv/l7-maps";
import { cloneDeep, isEmpty, isEqual, toNumber } from "lodash";
import defaultSvg from "./assets/default.svg?url";
import selectedSvg from "./assets/selected.svg?url";
import chinaPng from "./assets/china.png";
import texturePng from "./assets/texture.png";
import styleText from "./styles.shadow.css";
import { useContainerScale } from "../shared/useContainerScale";

const { defineElement, property, event } = createDecorators();

const BASE_WIDTH = 825;
const BASE_HEIGHT = 600;

interface FeatureCollection {
  type: "FeatureCollection";
  features: Feature[];
}

interface Feature {
  type: "Feature";
  id?: string;
  properties: {
    name: string;
    center?: Point;
    province_adcode: number;
    province: string;
  };
  geometry: Polygon | MultiPolygon;
}

interface Polygon {
  type: "Polygon";
  coordinates: Point[][];
}

interface MultiPolygon {
  type: "MultiPolygon";
  coordinates: Point[][][];
}

interface Area {
  name: string;
  level: "country" | "province" | "city" | "district";
  adcode: number;
  lng: number;
  lat: number;
  parent: number;
}

/**
 * 中国地图图表构件，可以显示省级指标数据
 */
export
@defineElement("data-view.china-map-chart", {
  styleTexts: [styleText],
})
class ChinaMapChart extends ReactNextElement {
  /**
   * 省份名称，例如“广东”。如果设置，则只显示该省份的地图，否则显示全国地图
   */
  @property()
  accessor province: string | undefined;

  /**
   * 数据源
   */
  @property({ attribute: false })
  accessor dataSource: DataSource[] | undefined;

  /**
   * 描述内容样式
   */
  @property({ attribute: false })
  accessor detailContentStyle: CSSProperties | undefined;

  /**
   * 是否铺满容器
   *
   * 注意：该属性不同时兼容 detail 插槽
   */
  @property({ type: Boolean })
  accessor fillContainer: boolean | undefined;

  /**
   * 当提示可见性开始变化时触发
   * @detail 当前是否可见
   */
  @event({ type: "detail.open.change" })
  accessor #openChangeEvent!: EventEmitter<{
    open: boolean;
    data: Record<string, any>;
  }>;
  #handleOpenChange = (open: boolean, data: Record<string, any>): void => {
    this.#openChangeEvent.emit({ open, data });
  };

  render() {
    return (
      <ChinaMapChartComponent
        root={this}
        province={this.province}
        dataSource={this.dataSource}
        onDetailOpenChange={this.#handleOpenChange}
        detailContentStyle={this.detailContentStyle}
        fillContainer={this.fillContainer}
      />
    );
  }
}

interface DataSource {
  /** 省级行政区域名，例如：四川、北京 */
  city: string;
  detailDisplayLocation: "pageCenter" | "textBottom";
  text: string;
  [x: string]: any;
}

export interface ChinaMapChartProps {
  root: HTMLElement;
  province?: string;
  onDetailOpenChange: (open: boolean, data: Record<string, any>) => void;
  dataSource: DataSource[];
  detailContentStyle?: CSSProperties;
  fillContainer?: boolean;
  // Define props here.
}

export function ChinaMapChartComponent(props: ChinaMapChartProps) {
  const {
    root,
    province,
    onDetailOpenChange,
    dataSource = [],
    detailContentStyle = {},
    fillContainer,
  } = props;
  const mapRef = useRef<HTMLDivElement>();
  const slotRef = useRef<HTMLSlotElement>();
  const [showData, setShowData] = useState<DataSource>();
  const showDataRef = useRef<DataSource>();
  const [textPosition, setTextPosition] = useState<{
    left: string;
    top: string;
  }>();

  const scale = useContainerScale({
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
    root,
    maxScale: 10,
    disabled: !fillContainer,
  });

  const textClick = (e: MouseEvent, data: any) => {
    e.stopPropagation();
    if (isEqual(data, showDataRef.current)) {
      setShowData(null);
      return;
    }
    setShowData(data);
    setTextPosition({
      left: `${toNumber((e.target as any).style.left.replace("px", "")) + 24}px`,
      top: `${toNumber((e.target as any).style.top.replace("px", "")) + 28}px`,
    });
  };
  useEffect(() => {
    const scene = new Scene({
      id: mapRef.current,
      logoVisible: false,
      map: new Map({
        // center: [90.268, 40.3628],
        pitch: 35,
        zoom: 1,
      }),
    });
    scene.setMapStatus({ doubleClickZoom: false, zoomEnable: false });
    const defaultImg = new Image();
    defaultImg.src = defaultSvg;

    const selectedImg = new Image();
    selectedImg.src = selectedSvg;

    scene.addImage("default", defaultImg);
    scene.addImage("selected", selectedImg);
    if (!province) {
      scene.addImage("chinaBg", chinaPng);
    } else {
      scene.addImage("texture", texturePng);
    }

    scene.on("loaded", async () => {
      let data: FeatureCollection;
      let southSeaData: FeatureCollection;
      let matchedProvince: Area | undefined;
      let AreaList: Area[] | undefined;
      if (province) {
        const [CitiesImport, AreaListImport] = await Promise.all([
          import("./cities.json"),
          import("./area-list.json"),
        ]);
        const Cities = CitiesImport.default as unknown as FeatureCollection;
        AreaList = AreaListImport.default as unknown as Area[];
        matchedProvince = AreaList.find(
          (a) => a.level === "province" && a.name.includes(province)
        );

        if (!matchedProvince) {
          throw new Error(`没有找到省份："${province}"`);
        }

        data = {
          type: "FeatureCollection",
          features: (Cities as FeatureCollection).features.filter(
            (f) => f.properties.province_adcode === matchedProvince.adcode
          ),
        };
      } else {
        const ChinaImport = await import("./map.json");
        const CHINA = ChinaImport.default as unknown as FeatureCollection;
        data = {
          type: "FeatureCollection",
          features: (CHINA as unknown as FeatureCollection).features.slice(
            0,
            CHINA.features.length - 2
          ),
        };
        southSeaData = {
          ...CHINA,
          features: CHINA.features.slice(
            CHINA.features.length - 2,
            CHINA.features.length
          ),
        };
      }

      const seventhPolygonLayer = new PolygonLayer({
        autoFit: false,
      }).source(data);

      let labelDivideLng: number | undefined;
      // 根据坐标范围设置 3D 图层升起的高度
      let raisingHeightBase: number;
      if (province) {
        let top = Infinity;
        let left = Infinity;
        let bottom = -Infinity;
        let right = -Infinity;
        const points = data.features.flatMap(
          (f) =>
            f.geometry.coordinates.flat(
              f.geometry.type === "MultiPolygon" ? 2 : 1
            ) as Point[]
        );
        points.forEach(([lng, lat]) => {
          top = Math.min(top, lat);
          left = Math.min(left, lng);
          bottom = Math.max(bottom, lat);
          right = Math.max(right, lng);
        });
        const lngRange = right - left;
        const latRange = bottom - top;
        raisingHeightBase = Math.max(2000 * lngRange, 3000 * latRange);
        // 在经度范围的 3/4 处设置分界线，左边的文字向右排，右边的文字向左排
        labelDivideLng = left + (lngRange * 3) / 4;
      } else {
        raisingHeightBase = 100000;
      }

      seventhPolygonLayer
        .shape("extrude")
        .color("rgba(84, 239, 241, 0.20)")
        .style({
          heightfixed: true,
          pickLight: true,
          opacity: 1,
          raisingHeight: -13 * raisingHeightBase,
        });

      const sixthPolygonLayer = new PolygonLayer({
        autoFit: false,
      }).source(data);

      sixthPolygonLayer
        .shape("extrude")
        .color("rgba(14, 11, 75, 0.58)")
        .style({
          heightfixed: true,
          pickLight: true,
          opacity: 1,
          raisingHeight: -11 * raisingHeightBase,
        });

      const fifthPolygonLayer = new PolygonLayer({
        autoFit: false,
      }).source(data);

      fifthPolygonLayer
        .shape("extrude")
        .color("rgba(190, 225, 226, 1)")
        .style({
          heightfixed: true,
          pickLight: true,
          opacity: 1,
          raisingHeight: -9 * raisingHeightBase,
        });
      const fourthPolygonLayer = new PolygonLayer({
        autoFit: false,
      }).source(data);

      fourthPolygonLayer
        .shape("extrude")
        .color("rgba(18, 26, 45, 1)")
        .style({
          heightfixed: true,
          pickLight: true,
          opacity: 1,
          raisingHeight: -7 * raisingHeightBase,
        });

      const thirdPolygonLayer = new PolygonLayer({
        autoFit: false,
      }).source(data);

      thirdPolygonLayer
        .shape("extrude")
        .color("#111D3C")
        .style({
          heightfixed: true,
          pickLight: true,
          opacity: 1,
          raisingHeight: -5 * raisingHeightBase,
        });
      const secondPolygonLayer = new PolygonLayer({
        autoFit: false,
      }).source(data);

      secondPolygonLayer
        .shape("extrude")
        .color("#121A2D")
        .style({
          heightfixed: true,
          pickLight: true,
          opacity: 1,
          raisingHeight: -3 * raisingHeightBase,
        });

      const firstPolygonLayer = new PolygonLayer({
        autoFit: true,
      }).source(data);

      firstPolygonLayer.shape("fill").color("rgba(8, 77, 255, 0.60)");
      // .select({
      //   color: "rgba(177, 254, 254, 1)",
      // });//编排上层缩放会影响到高亮功能，还不知道怎么解决，暂时不实现。

      let chinaImgLayer: ILayer | undefined;
      if (!province) {
        chinaImgLayer = new ImageLayer({
          autoFit: false,
          zIndex: 1,
        }).source(chinaPng, {
          parser: {
            type: "image",
            extent: [73.33, 17.9, 134.85, 53.73],
          },
        });

        chinaImgLayer.shape("img").style({
          opacity: 1,
        });
      }

      const fourthLineLayer = new LineLayer()
        .source(data)
        .shape("line")
        .color("rgba(43, 100, 255, 1)")
        .size(1)
        .style({
          raisingHeight: -16 * raisingHeightBase,
        });

      const thirdLineLayer = new LineLayer()
        .source(data)
        .shape("line")
        .color("rgba(84, 239, 241, 1)")
        .size(1)
        .style({
          raisingHeight: -12 * raisingHeightBase,
        });

      const secondLineLayer = new LineLayer()
        .source(data)
        .shape("line")
        .color("rgba(43, 100, 255, 1)")
        .size(1)
        .style({
          raisingHeight: -6 * raisingHeightBase,
        });

      const firstLineLayer = new LineLayer({ zIndex: 2 })
        .source(data)
        .shape("line")
        .color("#3DC6FF")
        .size(1)
        .style({
          raisingHeight: 0,
        })
        .scale("density", {
          type: "quantile",
        });

      // const hightLayer = new LineLayer({
      //   zIndex: 10, // 设置显示层级
      //   name: "hightlight",
      // })
      //   .source({
      //     type: "FeatureCollection",
      //     features: [],
      //   })
      //   .shape("line")
      //   .size(2)
      //   .color("rgba(177, 254, 254, 1)")
      //   .style({
      //     opacity: 1,
      //   });
      // const hightPolygonLayer = new PolygonLayer({zIndex: 10})
      //   .source({
      //     type: "FeatureCollection",
      //     features: [],
      //   })
      //   .shape("fill")
      //   .color("rgba(177, 254, 254, 1)")
      //   .style({
      //     heightfixed: true,
      //     pickLight: true,
      //     opacity: 1,
      //     raisingHeight: 0,
      //   }); //自定义选择高亮

      scene.addLayer(seventhPolygonLayer);
      scene.addLayer(sixthPolygonLayer);
      scene.addLayer(fifthPolygonLayer);
      scene.addLayer(fourthPolygonLayer);
      scene.addLayer(thirdPolygonLayer);
      scene.addLayer(secondPolygonLayer);
      if (chinaImgLayer) {
        scene.addLayer(chinaImgLayer);
      }
      // scene.addLayer(hightLayer);
      // scene.addLayer(hightPolygonLayer);
      scene.addLayer(firstPolygonLayer);

      scene.addLayer(fourthLineLayer);
      scene.addLayer(thirdLineLayer);
      scene.addLayer(secondLineLayer);
      scene.addLayer(firstLineLayer);

      // firstPolygonLayer.on("click", (e) => {
      //   const { feature } = e;
      //   hightPolygonLayer.setData({
      //     type: "FeatureCollection",
      //     features: [feature],
      //   });
      //   hightLayer.setData({
      //     type: "FeatureCollection",
      //     features: [feature],
      //   });
      // });

      if (!province) {
        const southSeaPolygonLayer = new PolygonLayer({
          autoFit: false,
        }).source(southSeaData);

        southSeaPolygonLayer.shape("fill").color("black");

        const southSeaLineLayer = new LineLayer({ zIndex: 2 })
          .source(southSeaData)
          .shape("line")
          .color("rgba(30, 144, 255, 1)")
          .size(0.5)
          .style({
            raisingHeight: 0,
          })
          .scale("density", {
            type: "quantile",
          });
        scene.addLayer(southSeaPolygonLayer);
        scene.addLayer(southSeaLineLayer);
      }

      dataSource.forEach((i) => {
        const el = document.createElement("div");
        let classNameText = "text";
        el.textContent = i.text;
        let coord: Point;

        // 计算标签的排列方向，全国地图保持原有逻辑，省份地图根据经度所在比例自动适应排列方向
        if (!province) {
          const city = data.features.find((f) =>
            f.properties.name.includes(i.city)
          );
          if (!city) {
            return;
          }
          coord = city.properties.center;
          //先手动调整位置，缓解重叠的问题
          if (
            [
              "410000",
              "820000",
              "140000",
              "110000",
              "420000",
              "430000",
              "450000",
              "500000",
              "520000",
              "530000",
              "510000",
              "610000",
              "640000",
              "150000",
              "630000",
              "540000",
              "340000",
            ].includes(city.id)
          ) {
            classNameText = `${classNameText} leftText`;
            i.isLeftOffset = true;
          }
          if (
            [
              "620000",
              "640000",
              "450000",
              "440000",
              "120000",
              "340000",
              "510000",
              "150000",
              "320000",
            ].includes(city.id)
          ) {
            classNameText = `${classNameText} topText`;
            i.isTopOffset = true;
          }

          if (
            [
              "530000",
              "520000",
              "430000",
              "360000",
              "330000",
              "610000",
              "370000",
              "130000",
            ].includes(city.id)
          ) {
            coord[1] -= 1;
          }
        } else {
          const area = AreaList.find(
            (a) =>
              a.parent === matchedProvince.adcode && a.name.includes(i.city)
          );
          if (!area) {
            return;
          }
          coord = [area.lng, area.lat];
          if (area.lng > labelDivideLng) {
            classNameText = `${classNameText} leftText`;
            i.isLeftOffset = true;
          }
        }

        el.className = classNameText;

        el.onclick = (e) => {
          i.width = el.getBoundingClientRect().width;
          textClick(e, i);
        };

        const imgEl = document.createElement("img");
        imgEl.src = defaultSvg;
        imgEl.className = "iconImg";

        const marker = new Marker({
          element: el,
        }).setLnglat({ lng: coord[0], lat: coord[1] });
        const imgMarker = new Marker({
          element: imgEl,
        }).setLnglat({ lng: coord[0], lat: coord[1] });
        scene.addMarker(marker);
        scene.addMarker(imgMarker);
      });

      setTimeout(() => {
        const bounds = scene.getBounds();
        // 进行适当平移和缩放，因为设置了倾角 pitch，地图默认没有铺满并居中
        scene.panTo([
          (bounds[0][0] + bounds[1][0]) / 2 + (province ? 0 : 1.6),
          (bounds[0][1] + bounds[1][1]) / 2 - (bounds[1][1] - bounds[0][1]) / 9,
        ]);
        if (province) {
          scene.setZoom(scene.getZoom() * 0.97);
        }

        // 省份贴图
        if (province) {
          const provinceImgLayer = new ImageLayer({
            autoFit: false,
            zIndex: 1,
            maskLayers: [firstPolygonLayer],
          }).source(texturePng, {
            parser: {
              type: "image",
              extent: [...bounds[0], ...bounds[1]],
            },
          });

          provinceImgLayer.shape("img").style({
            opacity: 1,
          });
          scene.addLayer(provinceImgLayer);
        }
      });
    });

    return () => {
      scene.destroy();
    };
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (slotRef.current && e.composedPath().includes(slotRef.current)) return;
      setShowData(null);
    };
    document?.addEventListener("click", handleClick);
    return () => {
      document?.removeEventListener("click", handleClick);
    };
  }, []);

  useEffect(() => {
    showDataRef.current = cloneDeep(showData);
    onDetailOpenChange(!isEmpty(showData), showData);
  }, [showData]);
  return (
    <div
      style={
        fillContainer
          ? {
              height: "100%",
              transform: `scale(${scale ?? 1})`,
            }
          : null
      }
    >
      <div
        id="map"
        ref={mapRef}
        className="map"
        style={
          fillContainer
            ? {
                width: BASE_WIDTH,
                height: BASE_HEIGHT,
              }
            : null
        }
      ></div>
      {showData && (
        <div
          className="detailContent"
          onClick={(e) => {
            e.stopPropagation();
          }}
          style={{
            ...(showData.detailDisplayLocation === "textBottom"
              ? {
                  left: textPosition.left,
                  top: textPosition.top,
                  transform: `translate(${showData.isLeftOffset ? -showData.width : 0}px, ${showData.isTopOffset ? -50 : -40}px)`,
                }
              : {
                  transform: "translate(-50%, 0%)",
                  top: "50%",
                  left: "50%",
                }),
            ...detailContentStyle,
          }}
        >
          <slot name="detail" ref={slotRef}></slot>
        </div>
      )}
    </div>
  );
}
