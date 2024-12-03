import React, { useEffect, useRef, useState, CSSProperties } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import { Scene, PolygonLayer, LineLayer, Marker, ImageLayer } from "@antv/l7";
import { Map } from "@antv/l7-maps";
import { cloneDeep, isEmpty, isEqual, toNumber } from "lodash";
import defaultSvg from "./assets/default.svg?url";
import selectedSvg from "./assets/selected.svg?url";
import chinaPng from "./assets/china.png";
import CHINA from "./map.json";
import styleText from "./styles.shadow.css";

const { defineElement, property, event } = createDecorators();

/**
 * 中国地图图表构件，可以显示省级指标数据
 */
export
@defineElement("data-view.china-map-chart", {
  styleTexts: [styleText],
})
class ChinaMapChart extends ReactNextElement {
  /**
   * 数据源
   */
  @property({ attribute: false })
  accessor dataSource: DataSource[] | undefined;

  /**
   * 数据源
   */
  @property({ attribute: false })
  accessor detailContentStyle: CSSProperties | undefined;

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
        dataSource={this.dataSource}
        onDetailOpenChange={this.#handleOpenChange}
        detailContentStyle={this.detailContentStyle}
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
  onDetailOpenChange: (open: boolean, data: Record<string, any>) => void;
  dataSource: DataSource[];
  detailContentStyle?: CSSProperties;
  // Define props here.
}

export function ChinaMapChartComponent(props: ChinaMapChartProps) {
  const {
    onDetailOpenChange,
    dataSource = [],
    detailContentStyle = {},
  } = props;
  const mapRef = useRef<HTMLDivElement>();
  const slotRef = useRef<HTMLSlotElement>();
  const [showData, setShowData] = useState<DataSource>();
  const showDataRef = useRef<DataSource>();
  const [textPosition, setTextPosition] = useState<{
    left: string;
    top: string;
  }>();

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
        center: [90.268, 40.3628],
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
    scene.addImage("chinaBg", chinaPng);

    scene.on("loaded", () => {
      const data = {
        ...CHINA,
        features: CHINA.features.slice(0, CHINA.features.length - 2),
      };
      const southSeaData = {
        ...CHINA,
        features: CHINA.features.slice(
          CHINA.features.length - 2,
          CHINA.features.length
        ),
      };
      const seventhPolygonLayer = new PolygonLayer({
        autoFit: false,
      }).source(data);

      seventhPolygonLayer
        .shape("extrude")
        .color("rgba(84, 239, 241, 0.20)")
        .style({
          heightfixed: true,
          pickLight: true,
          opacity: 1,
          raisingHeight: -1300000,
        });

      const sixthPolygonLayer = new PolygonLayer({
        autoFit: false,
      }).source(data);

      sixthPolygonLayer.shape("extrude").color("rgba(14, 11, 75, 0.58)").style({
        heightfixed: true,
        pickLight: true,
        opacity: 1,
        raisingHeight: -1100000,
      });

      const fifthPolygonLayer = new PolygonLayer({
        autoFit: false,
      }).source(data);

      fifthPolygonLayer.shape("extrude").color("rgba(190, 225, 226, 1)").style({
        heightfixed: true,
        pickLight: true,
        opacity: 1,
        raisingHeight: -900000,
      });
      const fourthPolygonLayer = new PolygonLayer({
        autoFit: false,
      }).source(data);

      fourthPolygonLayer.shape("extrude").color("rgba(18, 26, 45, 1)").style({
        heightfixed: true,
        pickLight: true,
        opacity: 1,
        raisingHeight: -700000,
      });

      const thirdPolygonLayer = new PolygonLayer({
        autoFit: false,
      }).source(data);

      thirdPolygonLayer.shape("extrude").color("#111D3C").style({
        heightfixed: true,
        pickLight: true,
        opacity: 1,
        raisingHeight: -500000,
      });
      const secondPolygonLayer = new PolygonLayer({
        autoFit: false,
      }).source(data);

      secondPolygonLayer.shape("extrude").color("#121A2D").style({
        heightfixed: true,
        pickLight: true,
        opacity: 1,
        raisingHeight: -300000,
      });

      const firstPolygonLayer = new PolygonLayer({
        autoFit: true,
      }).source(data);

      firstPolygonLayer.shape("fill").color("rgba(8, 77, 255, 0.60)");
      // .select({
      //   color: "rgba(177, 254, 254, 1)",
      // });//编排上层缩放会影响到高亮功能，还不知道怎么解决，暂时不实现。

      const chinaImgLayer = new ImageLayer({
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

      const fourthLineLayer = new LineLayer()
        .source(data)
        .shape("line")
        .color("rgba(43, 100, 255, 1)")
        .size(1)
        .style({
          raisingHeight: -1600000,
        });

      const thirdLineLayer = new LineLayer()
        .source(data)
        .shape("line")
        .color("rgba(84, 239, 241, 1)")
        .size(1)
        .style({
          raisingHeight: -1200000,
        });

      const secondLineLayer = new LineLayer()
        .source(data)
        .shape("line")
        .color("rgba(43, 100, 255, 1)")
        .size(1)
        .style({
          raisingHeight: -600000,
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
      scene.addLayer(chinaImgLayer);
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

      dataSource.map((i) => {
        const el = document.createElement("div");
        let classNameText = "text";
        el.textContent = i.text;
        const city = data.features.find((f) =>
          f.properties.name.includes(i.city)
        );
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
        el.className = classNameText;

        el.onclick = (e) => {
          i.width = el.getBoundingClientRect().width;
          textClick(e, i);
        };

        const imgEl = document.createElement("img");
        imgEl.src = defaultSvg;
        imgEl.className = "iconImg";

        const center = city.properties.center;
        let lat = center[1];
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
          lat -= 1;
        }

        const marker = new Marker({
          element: el,
        }).setLnglat({ lng: center[0], lat });
        const imgMarker = new Marker({
          element: imgEl,
        }).setLnglat({ lng: center[0], lat });
        scene.addMarker(marker);
        scene.addMarker(imgMarker);
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
    <div>
      <div id="map" ref={mapRef} className="map"></div>
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
