import React, { useEffect, useMemo, useRef, useState } from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import styleText from "./styles.shadow.css";
import classNames from "classnames";
const { defineElement, property, event } = createDecorators();

/**
 * 带有tabs的标题构件
 * @author astrid
 * @slot - 标题
 * @slot start - 顶部左边插槽
 * @slot end - 顶部右边插槽
 * @slot [key] - 标签对应的key的插槽
 */
interface TabsItem {
  /** 唯一标识，对应 slot 名称 */
  key: string;
  /**  标签名称 */
  text: string;
}
interface TabsPageTitleProps {
  tabList?: TabsItem[];
  activeKey?: string;
  onTabChange?: (key: string) => void;
}

export
@defineElement("data-view.tabs-page-title", {
  styleTexts: [styleText],
})
class TabsPageTitle extends ReactNextElement implements TabsPageTitleProps {
  /**
   * 标签，如果没有就不展示标签
   * @default -
   */
  @property({ attribute: false })
  accessor tabList: TabsItem[];

  /**
   * 标签高亮显示，默认第一个
   * @default -
   */
  @property()
  accessor activeKey: string;

  /**
   * 切换 `tab` 栏会触发的事件，`detail` 为目标 `tab` 对应的 `key`
   * @detail `string`
   */
  @event({ type: "tab.change" })
  accessor #tabChangeEvent!: EventEmitter<string>;

  #handleTabChange = (key: string) => {
    this.activeKey = key;
    this.#tabChangeEvent.emit(key);
  };
  render() {
    return (
      <TabsPageTitleComponent
        tabList={this.tabList}
        activeKey={this.activeKey}
        onTabChange={this.#handleTabChange}
      />
    );
  }
}

export function TabsPageTitleComponent(props: TabsPageTitleProps) {
  const { tabList, activeKey, onTabChange } = props;

  const contentRef = useRef<HTMLDivElement>(null);
  const [curKey, setCurKey] = useState<string>();

  const setActiveItem = (key: string): void => {
    const _contentSlot = contentRef.current;
    if (_contentSlot) {
      const _slotElement: NodeListOf<HTMLSlotElement> =
        _contentSlot.querySelectorAll("slot.tabSlot");
      _slotElement?.forEach((slot: HTMLSlotElement) => {
        slot.hidden = slot.name !== key;
      });
      setCurKey(key);
    }
  };
  useEffect(() => {
    if (tabList?.length) {
      setActiveItem(activeKey ?? tabList[0].key);
    }
  }, [activeKey, tabList]);
  const tabElement = useMemo(() => {
    return (
      <div className={!tabList?.length ? "titleWrapper" : "tabWrapper"}>
        {tabList?.length && (
          <div className="tabLeft">
            {tabList.slice(0, Math.floor(tabList.length / 2)).map((item) => (
              <div key={item.key} className="tabItem">
                <div
                  className={classNames("text", {
                    active: item.key === curKey,
                  })}
                  onClick={() => onTabChange?.(item.key)}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        )}
        <slot className="text-container" />
        {tabList?.length && (
          <div className="tabRight">
            {tabList.slice(Math.floor(tabList.length / 2)).map((item) => (
              <div key={item.key} className="tabItem">
                <div
                  className={classNames("text", {
                    active: item.key === curKey,
                  })}
                  onClick={() => onTabChange?.(item.key)}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }, [tabList, curKey, onTabChange]);

  return (
    <div className="wrapper">
      <div className="header">
        <svg
          width="100%"
          height="100%"
          className="svg"
          viewBox="0 0 1967.1 180"
          version="1.1"
          preserveAspectRatio="none"
        >
          <defs>
            <radialGradient
              cx="50%"
              cy="30.055444%"
              fx="50%"
              fy="30.055444%"
              r="713.130816%"
              gradientTransform="translate(0.500000,0.300554),scale(0.039316,1.000000),rotate(-2.429174),translate(-0.500000,-0.300554)"
              id="radialGradient-1"
            >
              <stop stopColor="#00E0DB" offset="0%" />
              <stop stopColor="#3D7FFF" offset="100%" />
            </radialGradient>
            <filter
              x="-17.9%"
              y="-456.5%"
              width="135.9%"
              height="1013.0%"
              filterUnits="objectBoundingBox"
              id="filter-2"
            >
              <feGaussianBlur stdDeviation="35" in="SourceGraphic" />
            </filter>
            <filter
              x="-17.0%"
              y="-646.2%"
              width="133.9%"
              height="1392.3%"
              filterUnits="objectBoundingBox"
              id="filter-3"
            >
              <feGaussianBlur stdDeviation="28" in="SourceGraphic" />
            </filter>
            <filter
              x="-39.0%"
              y="-807.7%"
              width="178.1%"
              height="1715.4%"
              filterUnits="objectBoundingBox"
              id="filter-4"
            >
              <feGaussianBlur stdDeviation="35" in="SourceGraphic" />
            </filter>
            <radialGradient
              cx="50%"
              cy="30.055444%"
              fx="50%"
              fy="30.055444%"
              r="114.879371%"
              gradientTransform="translate(0.500000,0.300554),scale(0.252747,1.000000),rotate(-15.254524),translate(-0.500000,-0.300554)"
              id="radialGradient-5"
            >
              <stop stopColor="#00E0DB" offset="0%" />
              <stop stopColor="#3D7FFF" offset="100%" />
            </radialGradient>
            <filter
              x="-115.4%"
              y="-456.5%"
              width="330.8%"
              height="1013.0%"
              filterUnits="objectBoundingBox"
              id="filter-6"
            >
              <feGaussianBlur stdDeviation="35" in="SourceGraphic" />
            </filter>
            <filter
              x="-109.1%"
              y="-646.2%"
              width="318.2%"
              height="1392.3%"
              filterUnits="objectBoundingBox"
              id="filter-7"
            >
              <feGaussianBlur stdDeviation="28" in="SourceGraphic" />
            </filter>
            <filter
              x="-250.0%"
              y="-807.7%"
              width="600.0%"
              height="1715.4%"
              filterUnits="objectBoundingBox"
              id="filter-8"
            >
              <feGaussianBlur stdDeviation="35" in="SourceGraphic" />
            </filter>
            <linearGradient
              x1="16.7328962%"
              y1="50.631978%"
              x2="61.6633946%"
              y2="50.3091958%"
              id="linearGradient-9"
            >
              <stop stopColor="#3D7FFF" stopOpacity="0" offset="0%" />
              <stop stopColor="#66FFFF" offset="35.4287676%" />
              <stop
                stopColor="#3D75FF"
                stopOpacity="0.698880262"
                offset="44.8355504%"
              />
              <stop
                stopColor="#3D76FF"
                stopOpacity="0.629205177"
                offset="67.6519137%"
              />
              <stop stopColor="#3D7FFF" stopOpacity="0" offset="100%" />
            </linearGradient>
            <linearGradient
              x1="42.3383926%"
              y1="50.0721671%"
              x2="83.9990204%"
              y2="50.314338%"
              id="linearGradient-10"
            >
              <stop stopColor="#3D7FFF" stopOpacity="0" offset="0%" />
              <stop
                stopColor="#3D75FF"
                stopOpacity="0.698880262"
                offset="50.4124985%"
              />
              <stop stopColor="#3D76FF" offset="73.5915405%" />
              <stop stopColor="#3D7FFF" stopOpacity="0" offset="100%" />
            </linearGradient>
            <linearGradient
              x1="69.6531753%"
              y1="50.0704039%"
              x2="93.6196303%"
              y2="50.6342349%"
              id="linearGradient-11"
            >
              <stop stopColor="#3D7FFF" stopOpacity="0" offset="0%" />
              <stop
                stopColor="#3D76FF"
                stopOpacity="0.629205177"
                offset="50.5419037%"
              />
              <stop stopColor="#66FFFF" offset="72.7064129%" />
              <stop stopColor="#A6CCFF" offset="83.4271198%" />
              <stop
                stopColor="#FFFFFF"
                stopOpacity="0.25"
                offset="92.4032998%"
              />
              <stop stopColor="#FFFFFF" stopOpacity="0" offset="100%" />
            </linearGradient>
            <linearGradient
              x1="0%"
              y1="50%"
              x2="100%"
              y2="49.9988662%"
              id="linearGradient-12"
            >
              <stop stopColor="#01F5FF" stopOpacity="0.05" offset="0%" />
              <stop stopColor="#00FFF4" offset="51.2723483%" />
              <stop stopColor="#01F5FF" stopOpacity="0.05" offset="100%" />
            </linearGradient>
            <linearGradient
              x1="121.823279%"
              y1="53.9346322%"
              x2="-21.823279%"
              y2="53.9346322%"
              id="linearGradient-13"
            >
              <stop stopColor="#0E5FFF" stopOpacity="0.05" offset="0%" />
              <stop
                stopColor="#0E5FFF"
                stopOpacity="0.2"
                offset="36.3753421%"
              />
              <stop stopColor="#0E5FFF" stopOpacity="0" offset="100%" />
            </linearGradient>
            <linearGradient
              x1="121.823279%"
              y1="53.9346322%"
              x2="-21.823279%"
              y2="53.9346322%"
              id="linearGradient-14"
            >
              <stop stopColor="#0E5FFF" stopOpacity="0" offset="0%" />
              <stop
                stopColor="#0E5FFF"
                stopOpacity="0.2"
                offset="63.6246579%"
              />
              <stop stopColor="#0E5FFF" stopOpacity="0.05" offset="100%" />
            </linearGradient>
            <linearGradient
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
              id="linearGradient-15"
            >
              <stop stopColor="#0E5FFF" stopOpacity="0" offset="0%" />
              <stop stopColor="#0E5FFF" offset="21.3020387%" />
              <stop stopColor="#0E5FFF" offset="60.4246107%" />
              <stop stopColor="#0E5FFF" stopOpacity="0" offset="100%" />
            </linearGradient>
            <linearGradient
              x1="0%"
              y1="50%"
              x2="100%"
              y2="49.9988662%"
              id="linearGradient-16"
            >
              <stop stopColor="#C8C8C8" stopOpacity="0" offset="0%" />
              <stop stopColor="#FFFFFF" offset="51.2723483%" />
              <stop stopColor="#979797" stopOpacity="0" offset="100%" />
            </linearGradient>
            <linearGradient
              x1="50%"
              y1="-17.8886468%"
              x2="50%"
              y2="125.757911%"
              id="linearGradient-17"
            >
              <stop stopColor="#0E5FFF" stopOpacity="0" offset="0%" />
              <stop
                stopColor="#0E5FFF"
                stopOpacity="0.2"
                offset="63.6246579%"
              />
              <stop stopColor="#0E5FFF" stopOpacity="0.7" offset="100%" />
            </linearGradient>
            <linearGradient
              x1="50%"
              y1="-19.0793713%"
              x2="50%"
              y2="197.916872%"
              id="linearGradient-18"
            >
              <stop stopColor="#000000" stopOpacity="0.5" offset="0%" />
              <stop stopColor="#0E5FFF" stopOpacity="0.12" offset="100%" />
            </linearGradient>
            <linearGradient
              x1="35.9694535%"
              y1="126.83927%"
              x2="35.9694535%"
              y2="50%"
              id="linearGradient-19"
            >
              <stop stopColor="#004BFF" offset="0%" />
              <stop stopColor="#1C3A75" stopOpacity="0" offset="100%" />
            </linearGradient>
            <path
              d="M747.861553,95.4552188 C732.019206,95.4552188 716.403542,91.6912489 702.300975,84.4733839 L624.704053,44.7583369 C610.601486,37.540472 594.985822,33.7765021 579.143475,33.7765021 L2,33.7765021 L2,4.54747351e-13 L1966.5,0 L1966.5,33.7765021 L1389.35652,33.7765021 C1373.51418,33.7765021 1357.89851,37.540472 1343.79595,44.7583369 L1266.19902,84.4733839 C1252.09646,91.6912489 1236.48079,95.4552188 1220.63845,95.4552188 Z"
              id="path-20"
            />
            <linearGradient
              x1="26.2355307%"
              y1="100%"
              x2="69.0344979%"
              y2="100%"
              id="linearGradient-21"
            >
              <stop stopColor="#FFFFFF" stopOpacity="0.05" offset="0%" />
              <stop stopColor="#FFFFFF" offset="51.2723483%" />
              <stop stopColor="#FFFFFF" stopOpacity="0.05" offset="100%" />
            </linearGradient>
            <linearGradient
              x1="-0.523693994%"
              y1="49.9988662%"
              x2="94.7087296%"
              y2="50%"
              id="linearGradient-22"
            >
              <stop stopColor="#3D7FFF" stopOpacity="0" offset="0%" />
              <stop
                stopColor="#3D75FF"
                stopOpacity="0.698880262"
                offset="33.9578719%"
              />
              <stop stopColor="#66FFFF" offset="48.5889698%" />
              <stop
                stopColor="#3D76FF"
                stopOpacity="0.629205177"
                offset="67.6519137%"
              />
              <stop stopColor="#3D7FFF" stopOpacity="0" offset="100%" />
            </linearGradient>
          </defs>
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g>
              <g transform="translate(684, 94)">
                <ellipse
                  fill="url(#radialGradient-1)"
                  opacity="0.400000006"
                  filter="url(#filter-2)"
                  cx="292.5"
                  cy="11.5"
                  rx="292.5"
                  ry="11.5"
                />
                <ellipse
                  fill="#0E14DE"
                  opacity="0.560000002"
                  filter="url(#filter-3)"
                  cx="293.5"
                  cy="7.5"
                  rx="247.5"
                  ry="6.5"
                />
                <ellipse
                  fill="#6580FF"
                  filter="url(#filter-4)"
                  cx="293.5"
                  cy="7.5"
                  rx="134.5"
                  ry="6.5"
                />
              </g>
              <g opacity="0.598772321" transform="translate(1428, 53)">
                <ellipse
                  fill="url(#radialGradient-5)"
                  opacity="0.400000006"
                  filter="url(#filter-6)"
                  cx="45.5"
                  cy="11.5"
                  rx="45.5"
                  ry="11.5"
                />
                <ellipse
                  fill="#0E14DE"
                  opacity="0.560000002"
                  filter="url(#filter-7)"
                  cx="45.5"
                  cy="7.5"
                  rx="38.5"
                  ry="6.5"
                />
                <ellipse
                  fill="#6580FF"
                  filter="url(#filter-8)"
                  cx="46"
                  cy="7.5"
                  rx="21"
                  ry="6.5"
                />
              </g>
              <path
                d="M1966.5,10 L1966.5,33.7765021 L1463,33.7765021 L1389.35652,33.7765021 C1373.51418,33.7765021 1357.89851,37.540472 1343.79595,44.7583369 L1266.19902,84.4733839 C1252.09646,91.6912489 1236.48079,95.4552188 1220.63845,95.4552188 L879.807193,95.4552188 L879.807193,95.4552188 L879.807193,10"
                stroke="url(#linearGradient-9)"
                strokeWidth="1.2"
              />
              <path
                d="M879.807193,40.7765021 L1383.30719,40.7765021 L1456.95067,40.7765021 C1472.79302,40.7765021 1488.40868,44.540472 1502.51125,51.7583369 L1580.10817,91.4733839 C1594.21073,98.6912489 1609.8264,102.455219 1625.66875,102.455219 L1966.5,102.455219 L1966.5,102.455219"
                stroke="url(#linearGradient-10)"
                strokeWidth="1.2"
                transform="translate(1423.153596, 71.615860) scale(-1, 1) translate(-1423.153596, -71.615860) "
              />
              <path
                d="M1118.86343,37.7765021 L1622.36343,37.7765021 L1696.00691,37.7765021 C1711.84925,37.7765021 1727.46492,41.540472 1741.56748,48.7583369 L1819.16441,88.4733839 C1833.26697,95.6912489 1848.88264,99.4552188 1864.72498,99.4552188 C1909.95832,99.4552188 1943.88333,99.4552188 1966.5,99.4552188"
                stroke="url(#linearGradient-11)"
                strokeWidth="1.2"
                strokeLinecap="round"
                transform="translate(1542.681715, 68.615860) scale(-1, 1) translate(-1542.681715, -68.615860) "
              />
              <line
                x1="778"
                y1="102.495"
                x2="1197.5"
                y2="102.5"
                stroke="url(#linearGradient-12)"
                strokeWidth="2.5"
              />
              <line
                x1="1433.5"
                y1="35"
                x2="1965"
                y2="34.5"
                stroke="url(#linearGradient-15)"
                strokeWidth="2"
                transform="translate(1699.5, 35) scale(-1, 1) translate(-1699.5, -35) "
              />
              <line
                x1="0.5"
                y1="31"
                x2="531.5"
                y2="34.5"
                stroke="url(#linearGradient-15)"
                strokeWidth="2"
              />
              {tabList?.length && (
                <>
                  <g
                    transform="translate(1301, 48)"
                    fill="url(#linearGradient-13)"
                    opacity="0.7"
                  >
                    <path d="M87.2678257,0 L665.492446,0 L665.492446,0 L665.492446,32 L0,32 L42.2611526,10.7005074 C56.2207863,3.66489441 71.6354483,-1.13392336e-14 87.2678257,0 Z" />
                  </g>
                  <g
                    transform="translate(332.746223, 64) scale(-1, 1) translate(-332.746223, -64.000000) translate(0.000000, 48.000000)"
                    fill="url(#linearGradient-14)"
                    opacity="0.7"
                  >
                    <path d="M87.2678257,0 L665.492446,0 L665.492446,0 L665.492446,32 L0,32 L42.2611526,10.7005074 C56.2207863,3.66489441 71.6354483,-1.13392336e-14 87.2678257,0 Z" />
                  </g>
                </>
              )}
              <line
                x1="1440"
                y1="34.5"
                x2="1890"
                y2="34.5"
                stroke="url(#linearGradient-15)"
                strokeWidth="2"
                transform="translate(1665.000000, 34.500000) scale(-1, 1) translate(-1665.000000, -34.500000) "
              />
              <line
                x1="778"
                y1="95.495"
                x2="1197.5"
                y2="95.5"
                stroke="url(#linearGradient-16)"
                strokeWidth="2"
              />
              <path
                d="M1088.69281,10 L1088.69281,33.7765021 L585.192807,33.7765021 L511.549332,33.7765021 C495.706985,33.7765021 480.091321,37.540472 465.988754,44.7583369 L388.391832,84.4733839 C374.289265,91.6912489 358.673601,95.4552188 342.831254,95.4552188 L2,95.4552188 L2,95.4552188 L2,10"
                stroke="url(#linearGradient-9)"
                strokeWidth="1.2"
                transform="translate(545.346404, 52.727609) scale(-1, 1) translate(-545.346404, -52.727609) "
              />
              <g>
                <use fill="url(#linearGradient-17)" xlinkHref="#path-20" />
                <use fill="url(#linearGradient-18)" xlinkHref="#path-20" />
                <use fill="url(#linearGradient-19)" xlinkHref="#path-20" />
              </g>
              <path
                d="M2,40.7765021 L505.5,40.7765021 L579.143475,40.7765021 C594.985822,40.7765021 610.601486,44.540472 624.704053,51.7583369 L702.300975,91.4733839 C716.403542,98.6912489 732.019206,102.455219 747.861553,102.455219 L1088.69281,102.455219 L1088.69281,102.455219"
                stroke="url(#linearGradient-10)"
                strokeWidth="1.2"
              />
              <path
                d="M2,37.7765021 L505.5,37.7765021 L579.143475,37.7765021 C594.985822,37.7765021 610.601486,41.540472 624.704053,48.7583369 L702.300975,88.4733839 C716.403542,95.6912489 732.019206,99.4552188 747.861553,99.4552188 C793.094894,99.4552188 827.019899,99.4552188 849.636569,99.4552188"
                stroke="url(#linearGradient-11)"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <line
                x1="770.5"
                y1="102.495"
                x2="1190"
                y2="102.5"
                stroke="url(#linearGradient-21)"
                strokeWidth="3"
                transform="translate(980.500000, 102.000000) scale(-1, 1) translate(-980.500000, -102.000000) "
              />
              <line
                x1="78.5"
                y1="34.5"
                x2="528.5"
                y2="34.5"
                stroke="url(#linearGradient-15)"
                strokeWidth="2"
              />
              <line
                x1="770.5"
                y1="95.495"
                x2="1190"
                y2="95.5"
                stroke="url(#linearGradient-22)"
                strokeWidth="2"
                transform="translate(980.500000, 95.000000) scale(-1, 1) translate(-980.500000, -95.000000) "
              />
            </g>
          </g>
        </svg>
        <div className="toolbar">
          <slot name="start" />
          <slot name="end" />
        </div>
        {tabElement}
      </div>
      {tabList?.length && (
        <div className="content" ref={contentRef}>
          {tabList.map((item, index) => (
            <slot name={item.key} key={`slot-${index}`} className="tabSlot" />
          ))}
        </div>
      )}
    </div>
  );
}
