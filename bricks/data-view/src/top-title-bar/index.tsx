import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import styleText from "./styles.shadow.css";
import variablesStyleText from "../data-view-variables.shadow.css";

type TitleBarType = "normal" | "sample" | "square";
const { defineElement, property } = createDecorators();
interface TopTitleBarProps {
  text: string;
  type?: TitleBarType;
}

/**
 * 大屏标题栏三种样式构件
 * @author jiezhou
 */
@defineElement("data-view.top-title-bar", {
  styleTexts: [variablesStyleText, styleText],
})
class TopTitleBar extends ReactNextElement implements TopTitleBarProps {
  /**
   * 标题文本
   * @default -
   */
  @property()
  accessor text: string;

  /**
   * 标题类型
   * @default normal
   */
  @property()
  accessor type: TitleBarType = "normal";

  render() {
    return <TopTitleBarComponent text={this.text} type={this.type} />;
  }
}

export function TopTitleBarComponent(props: TopTitleBarProps) {
  const { text, type } = props;
  return (
    <div>
      <div className={`wrapper ${type}Wrapper`}>
        {type === "normal" && (
          <svg
            className="svg"
            width="100%"
            height="100%"
            viewBox="0 0 2217.80427 240"
            preserveAspectRatio="none"
            version="1.1"
          >
            <defs>
              <linearGradient
                x1="121.823279%"
                y1="53.9346322%"
                x2="-21.823279%"
                y2="53.9346322%"
                id="linearGradient-1"
              >
                <stop stopColor="#0E5FFF" stopOpacity="0" offset="0%"></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0.2"
                  offset="63.6246579%"
                ></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0.05"
                  offset="100%"
                ></stop>
              </linearGradient>
              <radialGradient
                cx="50%"
                cy="30.055444%"
                fx="50%"
                fy="30.055444%"
                r="1304.75488%"
                gradientTransform="translate(0.500000,0.300554),scale(0.021475,1.000000),rotate(-1.327418),translate(-0.500000,-0.300554)"
                id="radialGradient-2"
              >
                <stop stopColor="#00E0DB" offset="0%"></stop>
                <stop stopColor="#3D7FFF" offset="100%"></stop>
              </radialGradient>
              <filter
                x="-9.8%"
                y="-456.5%"
                width="119.6%"
                height="1013.0%"
                filterUnits="objectBoundingBox"
                id="filter-3"
              >
                <feGaussianBlur
                  stdDeviation="35"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-9.3%"
                y="-646.2%"
                width="118.5%"
                height="1392.3%"
                filterUnits="objectBoundingBox"
                id="filter-4"
              >
                <feGaussianBlur
                  stdDeviation="28"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-21.3%"
                y="-807.7%"
                width="142.7%"
                height="1715.4%"
                filterUnits="objectBoundingBox"
                id="filter-5"
              >
                <feGaussianBlur
                  stdDeviation="35"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-9.8%"
                y="-456.5%"
                width="119.6%"
                height="1013.0%"
                filterUnits="objectBoundingBox"
                id="filter-6"
              >
                <feGaussianBlur
                  stdDeviation="35"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-9.3%"
                y="-646.2%"
                width="118.5%"
                height="1392.3%"
                filterUnits="objectBoundingBox"
                id="filter-7"
              >
                <feGaussianBlur
                  stdDeviation="28"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-21.3%"
                y="-807.7%"
                width="142.7%"
                height="1715.4%"
                filterUnits="objectBoundingBox"
                id="filter-8"
              >
                <feGaussianBlur
                  stdDeviation="35"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <radialGradient
                cx="50%"
                cy="30.055444%"
                fx="50%"
                fy="30.055444%"
                r="254.543036%"
                gradientTransform="translate(0.500000,0.300554),scale(0.110834,1.000000),rotate(-6.819655),translate(-0.500000,-0.300554)"
                id="radialGradient-9"
              >
                <stop stopColor="#00E0DB" offset="0%"></stop>
                <stop stopColor="#3D7FFF" offset="100%"></stop>
              </radialGradient>
              <filter
                x="-76.6%"
                y="-691.5%"
                width="253.3%"
                height="1483.1%"
                filterUnits="objectBoundingBox"
                id="filter-10"
              >
                <feGaussianBlur
                  stdDeviation="35"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-72.4%"
                y="-983.5%"
                width="244.8%"
                height="2067.0%"
                filterUnits="objectBoundingBox"
                id="filter-11"
              >
                <feGaussianBlur
                  stdDeviation="28"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-166.7%"
                y="-1229.4%"
                width="433.3%"
                height="2558.8%"
                filterUnits="objectBoundingBox"
                id="filter-12"
              >
                <feGaussianBlur
                  stdDeviation="35"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <linearGradient
                x1="12.7580373%"
                y1="50.14845%"
                x2="78.9824893%"
                y2="50.8811826%"
                id="linearGradient-13"
              >
                <stop stopColor="#3D7FFF" stopOpacity="0" offset="0%"></stop>
                <stop
                  stopColor="#3D75FF"
                  stopOpacity="0.698880262"
                  offset="51.6206928%"
                ></stop>
                <stop stopColor="#66FFFF" offset="72.4163966%"></stop>
                <stop
                  stopColor="#3D76FF"
                  stopOpacity="0.629205177"
                  offset="87.7911862%"
                ></stop>
                <stop stopColor="#3D7FFF" stopOpacity="0" offset="100%"></stop>
              </linearGradient>
              <linearGradient
                x1="-5.58940209%"
                y1="49.8500523%"
                x2="28.8339154%"
                y2="50.7262367%"
                id="linearGradient-14"
              >
                <stop stopColor="#3D7FFF" stopOpacity="0" offset="0%"></stop>
                <stop
                  stopColor="#3D7EFF"
                  stopOpacity="0.0978483851"
                  offset="5.49524841%"
                ></stop>
                <stop
                  stopColor="#3D7CFF"
                  stopOpacity="0.219366106"
                  offset="20.6432099%"
                ></stop>
                <stop
                  stopColor="#3D76FF"
                  stopOpacity="0.629205177"
                  offset="27.1295052%"
                ></stop>
                <stop stopColor="#66FFFF" offset="40.2718846%"></stop>
                <stop
                  stopColor="#3D75FF"
                  stopOpacity="0"
                  offset="60.1799339%"
                ></stop>
                <stop stopColor="#3D7FFF" stopOpacity="0" offset="100%"></stop>
              </linearGradient>
              <linearGradient
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
                id="linearGradient-15"
              >
                <stop stopColor="#0E5FFF" stopOpacity="0" offset="0%"></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0.1"
                  offset="25.830702%"
                ></stop>
                <stop stopColor="#0E5FFF" offset="60.4246107%"></stop>
                <stop stopColor="#0E5FFF" stopOpacity="0" offset="100%"></stop>
              </linearGradient>
              <linearGradient
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
                id="linearGradient-16"
              >
                <stop stopColor="#0E5FFF" stopOpacity="0" offset="0%"></stop>
                <stop stopColor="#1D89CE" offset="51.9003973%"></stop>
                <stop stopColor="#1871B4" offset="58.0467258%"></stop>
                <stop stopColor="#1777B7" offset="66.5050399%"></stop>
                <stop stopColor="#00FFFF" offset="74.7822335%"></stop>
                <stop stopColor="#0E5FFF" offset="93.4671552%"></stop>
                <stop stopColor="#0E5FFF" stopOpacity="0" offset="100%"></stop>
              </linearGradient>
              <linearGradient
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
                id="linearGradient-17"
              >
                <stop stopColor="#0E5FFF" stopOpacity="0" offset="0%"></stop>
                <stop stopColor="#0E5FFF" offset="21.3020387%"></stop>
                <stop stopColor="#0E5FFF" offset="60.4246107%"></stop>
                <stop stopColor="#0E5FFF" stopOpacity="0" offset="100%"></stop>
              </linearGradient>
              <linearGradient
                x1="-0.523693994%"
                y1="49.9915557%"
                x2="94.7087296%"
                y2="50%"
                id="linearGradient-18"
              >
                <stop stopColor="#3D7FFF" stopOpacity="0" offset="0%"></stop>
                <stop
                  stopColor="#3D75FF"
                  stopOpacity="0.698880262"
                  offset="18.75%"
                ></stop>
                <stop stopColor="#66FFFF" offset="48.5889698%"></stop>
                <stop
                  stopColor="#3D76FF"
                  stopOpacity="0.629205177"
                  offset="81.3155594%"
                ></stop>
                <stop stopColor="#3D7FFF" stopOpacity="0" offset="100%"></stop>
              </linearGradient>
              <linearGradient
                x1="-0.523693994%"
                y1="49.9926573%"
                x2="94.7087296%"
                y2="50%"
                id="linearGradient-19"
              >
                <stop stopColor="#3D7FFF" stopOpacity="0" offset="0%"></stop>
                <stop
                  stopColor="#3D75FF"
                  stopOpacity="0.698880262"
                  offset="18.75%"
                ></stop>
                <stop stopColor="#66FFFF" offset="48.5889698%"></stop>
                <stop
                  stopColor="#3D76FF"
                  stopOpacity="0.629205177"
                  offset="81.3155594%"
                ></stop>
                <stop stopColor="#3D7FFF" stopOpacity="0" offset="100%"></stop>
              </linearGradient>
              <linearGradient
                x1="-20.2424482%"
                y1="31.6059669%"
                x2="105.435461%"
                y2="65.1383097%"
                id="linearGradient-20"
              >
                <stop stopColor="#3D7FFF" stopOpacity="0" offset="0%"></stop>
                <stop
                  stopColor="#3D7EFF"
                  stopOpacity="0.0978483851"
                  offset="12.0585312%"
                ></stop>
                <stop
                  stopColor="#3D7CFF"
                  stopOpacity="0.219366106"
                  offset="29.0357369%"
                ></stop>
                <stop
                  stopColor="#3D76FF"
                  stopOpacity="0.629205177"
                  offset="38.5528284%"
                ></stop>
                <stop stopColor="#66FFFF" offset="65.3487657%"></stop>
                <stop
                  stopColor="#3D75FF"
                  stopOpacity="0"
                  offset="97.8847467%"
                ></stop>
                <stop stopColor="#3D7FFF" stopOpacity="0" offset="100%"></stop>
              </linearGradient>
              <linearGradient
                x1="7.46796795%"
                y1="50.7071096%"
                x2="100%"
                y2="50.7068707%"
                id="linearGradient-21"
              >
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0"
                  offset="0.0819493007%"
                ></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0.76"
                  offset="59.6181849%"
                ></stop>
                <stop
                  stopColor="#00FFFF"
                  stopOpacity="0.8"
                  offset="100%"
                ></stop>
              </linearGradient>
              <linearGradient
                x1="50%"
                y1="-17.8886468%"
                x2="50%"
                y2="125.757911%"
                id="linearGradient-22"
              >
                <stop stopColor="#0E5FFF" stopOpacity="0" offset="0%"></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0.2"
                  offset="63.6246579%"
                ></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0.7"
                  offset="100%"
                ></stop>
              </linearGradient>
              <linearGradient
                x1="50%"
                y1="-19.0793713%"
                x2="50%"
                y2="197.916872%"
                id="linearGradient-23"
              >
                <stop stopColor="#000000" stopOpacity="0.5" offset="0%"></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0.12"
                  offset="100%"
                ></stop>
              </linearGradient>
              <linearGradient
                x1="35.9694535%"
                y1="126.83927%"
                x2="35.9694535%"
                y2="50%"
                id="linearGradient-24"
              >
                <stop stopColor="#004BFF" offset="0%"></stop>
                <stop stopColor="#1C3A75" stopOpacity="0" offset="100%"></stop>
              </linearGradient>
              <path
                d="M820.97866,148.032269 L793.249955,121.315316 L673.236159,108.921487 L652.771821,89.5004936 L149.791919,51.7534484 L1108.90192,65.1604484 L2068.01226,51.7534484 L1565.03236,89.5004936 L1544.56802,108.921487 L1424.55422,121.315316 L1396.82552,148.032269 L820.97866,148.032269 Z"
                id="path-25"
              ></path>
              <linearGradient
                x1="50.0076988%"
                y1="49.9044114%"
                x2="50%"
                y2="50.1908502%"
                id="linearGradient-26"
              >
                <stop stopColor="#0E5FFF" stopOpacity="0" offset="0%"></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0.2"
                  offset="63.6246579%"
                ></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0.7"
                  offset="100%"
                ></stop>
              </linearGradient>
              <path
                d="M820.97866,148.032269 L793.249955,121.315316 L673.236159,108.921487 L652.771821,89.5004936 L149.791919,51.7534484 L1108.90192,65.1604484 L2068.01226,51.7534484 L1565.03236,89.5004936 L1544.56802,108.921487 L1424.55422,121.315316 L1396.82552,148.032269 L820.97866,148.032269 Z"
                id="path-27"
              ></path>
              <linearGradient
                x1="121.823279%"
                y1="53.9346322%"
                x2="-21.823279%"
                y2="53.9346322%"
                id="linearGradient-28"
              >
                <stop stopColor="#0E5FFF" stopOpacity="0" offset="0%"></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0.2"
                  offset="63.6246579%"
                ></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0.05"
                  offset="100%"
                ></stop>
              </linearGradient>
              <filter
                x="-76.6%"
                y="-691.5%"
                width="253.3%"
                height="1483.1%"
                filterUnits="objectBoundingBox"
                id="filter-29"
              >
                <feGaussianBlur
                  stdDeviation="35"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-72.4%"
                y="-983.5%"
                width="244.8%"
                height="2067.0%"
                filterUnits="objectBoundingBox"
                id="filter-30"
              >
                <feGaussianBlur
                  stdDeviation="28"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-166.7%"
                y="-1229.4%"
                width="433.3%"
                height="2558.8%"
                filterUnits="objectBoundingBox"
                id="filter-31"
              >
                <feGaussianBlur
                  stdDeviation="35"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <linearGradient
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
                id="linearGradient-32"
              >
                <stop stopColor="#0E5FFF" stopOpacity="0" offset="0%"></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0.1"
                  offset="25.830702%"
                ></stop>
                <stop stopColor="#0E5FFF" offset="60.4246107%"></stop>
                <stop stopColor="#0E5FFF" stopOpacity="0" offset="100%"></stop>
              </linearGradient>
              <linearGradient
                x1="121.823279%"
                y1="53.9346322%"
                x2="-21.823279%"
                y2="53.9346322%"
                id="linearGradient-33"
              >
                <stop stopColor="#0E5FFF" stopOpacity="0" offset="0%"></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0.2"
                  offset="63.6246579%"
                ></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0.05"
                  offset="100%"
                ></stop>
              </linearGradient>
              <linearGradient
                x1="0%"
                y1="50%"
                x2="100%"
                y2="49.9988716%"
                id="linearGradient-34"
              >
                <stop stopColor="#C8C8C8" stopOpacity="0" offset="0%"></stop>
                <stop stopColor="#00FFF4" offset="51.2723483%"></stop>
                <stop
                  stopColor="#979797"
                  stopOpacity="0"
                  offset="84.7628934%"
                ></stop>
                <stop stopColor="#FFFFFF" stopOpacity="0" offset="100%"></stop>
              </linearGradient>
              <linearGradient
                x1="26.2355307%"
                y1="100%"
                x2="69.0344979%"
                y2="100%"
                id="linearGradient-35"
              >
                <stop stopColor="#FFFFFF" stopOpacity="0.05" offset="0%"></stop>
                <stop stopColor="#FFFFFF" offset="51.2723483%"></stop>
                <stop
                  stopColor="#FFFFFF"
                  stopOpacity="0.05"
                  offset="100%"
                ></stop>
              </linearGradient>
            </defs>
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g transform="translate(0, 0)">
                <g transform="translate(0, 0)">
                  <polygon
                    fill="url(#linearGradient-1)"
                    opacity="0.7"
                    transform="translate(1901.604704, 48.760301) rotate(-4.000000) translate(-1901.604704, -48.760301) "
                    points="1585.80725 32.0591318 2217.40216 32.0591318 2217.40216 64.0591318 1607.01948 65.4614705"
                  ></polygon>
                  <ellipse
                    fill="url(#radialGradient-2)"
                    opacity="0.400000006"
                    filter="url(#filter-3)"
                    cx="1091.40209"
                    cy="152.743126"
                    rx="535.5"
                    ry="11.5"
                  ></ellipse>
                  <ellipse
                    fill="#0E14DE"
                    opacity="0.560000002"
                    filter="url(#filter-4)"
                    cx="1092.90209"
                    cy="148.743126"
                    rx="453"
                    ry="6.5"
                  ></ellipse>
                  <ellipse
                    fill="#6580FF"
                    filter="url(#filter-5)"
                    cx="1092.90209"
                    cy="148.743126"
                    rx="246"
                    ry="6.5"
                  ></ellipse>
                  <ellipse
                    fill="url(#radialGradient-2)"
                    opacity="0.400000006"
                    filter="url(#filter-6)"
                    transform="translate(1125.894535, 152.743126) scale(-1, 1) translate(-1125.894535, -152.743126) "
                    cx="1125.89454"
                    cy="152.743126"
                    rx="535.5"
                    ry="11.5"
                  ></ellipse>
                  <ellipse
                    fill="#0E14DE"
                    opacity="0.560000002"
                    filter="url(#filter-7)"
                    transform="translate(1124.394535, 148.743126) scale(-1, 1) translate(-1124.394535, -148.743126) "
                    cx="1124.39454"
                    cy="148.743126"
                    rx="453"
                    ry="6.5"
                  ></ellipse>
                  <ellipse
                    fill="#6580FF"
                    filter="url(#filter-8)"
                    transform="translate(1124.394535, 148.743126) scale(-1, 1) translate(-1124.394535, -148.743126) "
                    cx="1124.39454"
                    cy="148.743126"
                    rx="246"
                    ry="6.5"
                  ></ellipse>
                  <g transform="translate(0.000000, 0.000000)">
                    <ellipse
                      fill="url(#radialGradient-9)"
                      opacity="0.400000006"
                      filter="url(#filter-10)"
                      cx="1598.53102"
                      cy="135.263556"
                      rx="68.497263"
                      ry="7.59182797"
                    ></ellipse>
                    <ellipse
                      fill="#0E14DE"
                      opacity="0.326102121"
                      filter="url(#filter-11)"
                      cx="1599.031"
                      cy="132.89111"
                      rx="57.9976826"
                      ry="4.27040323"
                    ></ellipse>
                    <ellipse
                      fill="#6580FF"
                      filter="url(#filter-12)"
                      cx="1598.53102"
                      cy="132.89111"
                      rx="31.4987414"
                      ry="4.27040323"
                    ></ellipse>
                    <path
                      d="M1014.69063,116.758475 C994.767098,115.471104 1016.47631,117.685388 1079.81825,123.401325 L1133.00766,128.27268 L1160.22727,154.243126 L1557.13018,154.243126"
                      stroke="url(#linearGradient-13)"
                      strokeWidth="1.2"
                      transform="translate(1282.334969, 135.323314) scale(-1, 1) translate(-1282.334969, -135.323314) "
                    ></path>
                    <polyline
                      stroke="url(#linearGradient-14)"
                      strokeWidth="1.2"
                      transform="translate(1275.748015, 131.467642) scale(-1, 1) translate(-1275.748015, -131.467642) "
                      points="1007.53976 108.692158 1101.708 119.130922 1130.06298 154.243126 1543.95627 154.243126"
                    ></polyline>
                    <polyline
                      stroke="url(#linearGradient-15)"
                      strokeWidth="2"
                      transform="translate(1763.880796, 94.263570) scale(-1, 1) rotate(4.000000) translate(-1763.880796, -94.263570) "
                      points="1458.45763 86.4119318 1624.34488 87.7216836 1936.70436 90.456024 1954.99079 90.548599 1965.28573 101.204651 2069.30396 102.115208"
                    ></polyline>
                    <polyline
                      stroke="url(#linearGradient-16)"
                      strokeWidth="2"
                      transform="translate(1323.788737, 127.887725) scale(-1, 1) translate(-1323.788737, -127.887725) "
                      points="1090.5448 107.74318 1223.02325 121.315316 1251.75192 148.032269 1557.03268 148.032269"
                    ></polyline>
                    <line
                      x1="2024.64666"
                      y1="52.4480598"
                      x2="1573.843"
                      y2="89.401165"
                      stroke="url(#linearGradient-17)"
                      strokeWidth="2"
                      opacity="0.298851376"
                    ></line>
                    <polygon
                      fill="#00B5D7"
                      opacity="0.389113653"
                      transform="translate(2051.975519, 77.654193) scale(-1, 1) rotate(4.000000) translate(-2051.975519, -77.654193) "
                      points="2048.98703 74.817156 2054.9853 74.7958702 2054.96401 80.4912297 2048.96574 80.5125154"
                    ></polygon>
                    <polygon
                      fill="#0D58EC"
                      opacity="0.389113653"
                      transform="translate(2028.034938, 79.242930) scale(-1, 1) rotate(4.000000) translate(-2028.034938, -79.242930) "
                      points="2025.04645 76.4058935 2031.04472 76.3846077 2031.02343 82.0799671 2025.02516 82.1012529"
                    ></polygon>
                    <polygon
                      fill="#3C7DFB"
                      opacity="0.389113653"
                      transform="translate(2040.005229, 78.448562) scale(-1, 1) rotate(4.000000) translate(-2040.005229, -78.448562) "
                      points="2037.01674 75.6115247 2043.01501 75.590239 2042.99372 81.2855984 2036.99545 81.3068842"
                    ></polygon>
                    <path
                      d="M1440.91256,113.867476 L1683.96695,115.156393 C1685.01911,115.161972 1685.87075,116.01338 1685.87663,117.065535 L1685.87663,117.065535 L1685.87663,117.065535 L1439.02408,115.756477 C1439.01829,114.719003 1439.85464,113.87327 1440.89211,113.867479 C1440.89893,113.867441 1440.90574,113.86744 1440.91256,113.867476 Z"
                      fillOpacity="0.53"
                      fill="url(#linearGradient-18)"
                      transform="translate(1562.445054, 115.461470) rotate(-6.000000) translate(-1562.445054, -115.461470) "
                    ></path>
                    <path
                      d="M1575.88673,92.1473434 L1818.98374,93.2238544 C1820.03516,93.2285104 1820.88642,94.0795731 1820.89133,95.1309941 L1820.89133,95.1309941 L1820.89133,95.1309941 L1573.99685,94.0376668 C1573.992,92.9985162 1574.83047,92.1521905 1575.86962,92.1473454 C1575.87533,92.1473189 1575.88103,92.1473182 1575.88673,92.1473434 Z"
                      fillOpacity="0.53"
                      fill="url(#linearGradient-19)"
                      transform="translate(1697.439660, 93.634965) rotate(-5.000000) translate(-1697.439660, -93.634965) "
                    ></path>
                    <polyline
                      stroke="url(#linearGradient-20)"
                      transform="translate(1403.466823, 149.177725) scale(-1, 1) translate(-1403.466823, -149.177725) "
                      points="1391.83397 144.112325 1402.49098 154.243126 1415.09968 154.243126"
                    ></polyline>
                    <path
                      d="M1682.26247,53.3638469 L1698.75967,68.9270943 L1694.35985,68.9270943 L1677.86264,53.3638469 L1682.26247,53.3638469 Z M1671.4629,53.3638469 L1687.9601,68.9270943 L1683.56028,68.9270943 L1667.06307,53.3638469 L1671.4629,53.3638469 Z M1649.46378,53.3638469 L1665.96098,68.9270943 L1661.56116,68.9270943 L1645.06395,53.3638469 L1649.46378,53.3638469 Z M1660.26334,53.3638469 L1676.76055,68.9270943 L1672.36073,68.9270943 L1655.86352,53.3638469 L1660.26334,53.3638469 Z M1627.46465,53.3638469 L1643.96186,68.9270943 L1639.56204,68.9270943 L1623.06483,53.3638469 L1627.46465,53.3638469 Z M1638.26422,53.3638469 L1654.76143,68.9270943 L1650.36161,68.9270943 L1633.8644,53.3638469 L1638.26422,53.3638469 Z M1616.2651,53.3638469 L1632.76231,68.9270943 L1628.36249,68.9270943 L1611.86528,53.3638469 L1616.2651,53.3638469 Z M1594.26598,53.3638469 L1610.76319,68.9270943 L1606.36336,68.9270943 L1589.86616,53.3638469 L1594.26598,53.3638469 Z M1605.46553,53.3638469 L1621.96274,68.9270943 L1617.56292,68.9270943 L1601.06571,53.3638469 L1605.46553,53.3638469 Z M1572.26686,53.3638469 L1588.76407,68.9270943 L1584.36424,68.9270943 L1567.86704,53.3638469 L1572.26686,53.3638469 Z M1583.46641,53.3638469 L1599.96362,68.9270943 L1595.5638,68.9270943 L1579.06659,53.3638469 L1583.46641,53.3638469 Z"
                      fill="url(#linearGradient-21)"
                      transform="translate(1633.313355, 61.145471) scale(-1, -1) rotate(-5.000000) translate(-1633.313355, -61.145471) "
                    ></path>
                    <path
                      d="M633.439934,53.3638469 L649.937142,68.9270943 L645.537318,68.9270943 L629.04011,53.3638469 L633.439934,53.3638469 Z M622.640366,53.3638469 L639.137573,68.9270943 L634.737749,68.9270943 L618.240541,53.3638469 L622.640366,53.3638469 Z M600.641245,53.3638469 L617.138452,68.9270943 L612.738628,68.9270943 L596.24142,53.3638469 L600.641245,53.3638469 Z M611.440813,53.3638469 L627.938021,68.9270943 L623.538197,68.9270943 L607.040989,53.3638469 L611.440813,53.3638469 Z M578.642124,53.3638469 L595.139331,68.9270943 L590.739507,68.9270943 L574.2423,53.3638469 L578.642124,53.3638469 Z M589.441692,53.3638469 L605.9389,68.9270943 L601.539076,68.9270943 L585.041868,53.3638469 L589.441692,53.3638469 Z M567.442571,53.3638469 L583.939779,68.9270943 L579.539955,68.9270943 L563.042747,53.3638469 L567.442571,53.3638469 Z M545.44345,53.3638469 L561.940658,68.9270943 L557.540834,68.9270943 L541.043626,53.3638469 L545.44345,53.3638469 Z M556.643003,53.3638469 L573.14021,68.9270943 L568.740386,68.9270943 L552.243179,53.3638469 L556.643003,53.3638469 Z M523.444329,53.3638469 L539.941537,68.9270943 L535.541713,68.9270943 L519.044505,53.3638469 L523.444329,53.3638469 Z M534.643882,53.3638469 L551.141089,68.9270943 L546.741265,68.9270943 L530.244058,53.3638469 L534.643882,53.3638469 Z"
                      fill="url(#linearGradient-21)"
                      transform="translate(584.490823, 61.145471) scale(1, -1) rotate(-5.000000) translate(-584.490823, -61.145471) "
                    ></path>
                    <g>
                      <use
                        fill="url(#linearGradient-22)"
                        xmlnsXlink="#path-25"
                      ></use>
                      <use
                        fill="url(#linearGradient-23)"
                        xmlnsXlink="#path-25"
                      ></use>
                      <use
                        fill="url(#linearGradient-24)"
                        xmlnsXlink="#path-25"
                      ></use>
                    </g>
                    <g>
                      <use
                        fill="url(#linearGradient-26)"
                        xmlnsXlink="#path-27"
                      ></use>
                      <use
                        fill="url(#linearGradient-23)"
                        xmlnsXlink="#path-27"
                      ></use>
                      <use
                        fill="url(#linearGradient-24)"
                        xmlnsXlink="#path-27"
                      ></use>
                    </g>
                    <polygon
                      fill="url(#linearGradient-28)"
                      opacity="0.7"
                      transform="translate(1901.672610, 38.294764) rotate(-4.000000) translate(-1901.672610, -38.294764) "
                      points="1585.90935 21.9868061 2217.32234 24.2274712 2217.43587 54.6027215 1607.23397 53.7684467"
                    ></polygon>
                    <ellipse
                      fill="url(#radialGradient-9)"
                      opacity="0.400000006"
                      filter="url(#filter-29)"
                      transform="translate(619.273159, 135.263556) scale(-1, 1) translate(-619.273159, -135.263556) "
                      cx="619.273159"
                      cy="135.263556"
                      rx="68.497263"
                      ry="7.59182797"
                    ></ellipse>
                    <ellipse
                      fill="#0E14DE"
                      opacity="0.326102121"
                      filter="url(#filter-30)"
                      transform="translate(618.773179, 132.891110) scale(-1, 1) translate(-618.773179, -132.891110) "
                      cx="618.773179"
                      cy="132.89111"
                      rx="57.9976826"
                      ry="4.27040323"
                    ></ellipse>
                    <ellipse
                      fill="#6580FF"
                      filter="url(#filter-31)"
                      transform="translate(619.273159, 132.891110) scale(-1, 1) translate(-619.273159, -132.891110) "
                      cx="619.273159"
                      cy="132.89111"
                      rx="31.4987414"
                      ry="4.27040323"
                    ></ellipse>
                    <path
                      d="M667.824866,116.758475 C647.901338,115.471104 669.610545,117.685388 732.952488,123.401325 L786.141898,128.27268 L813.361511,154.243126 L1210.26442,154.243126"
                      stroke="url(#linearGradient-13)"
                      strokeWidth="1.2"
                    ></path>
                    <polyline
                      stroke="url(#linearGradient-14)"
                      strokeWidth="1.2"
                      points="673.847906 108.692158 768.016149 119.130922 796.371127 154.243126 1210.26442 154.243126"
                    ></polyline>
                    <polyline
                      stroke="url(#linearGradient-32)"
                      strokeWidth="2"
                      transform="translate(453.926362, 94.263768) rotate(4.000000) translate(-453.926362, -94.263768) "
                      points="148.506187 86.4121189 314.391811 87.7218765 626.74824 90.4562277 645.034488 90.5488034 655.329322 101.204856 759.346537 102.115417"
                    ></polyline>
                    <polyline
                      stroke="url(#linearGradient-16)"
                      strokeWidth="2"
                      points="660.771501 107.74318 793.249955 121.315316 821.97862 148.032269 1127.25938 148.032269"
                    ></polyline>
                    <line
                      x1="643.961181"
                      y1="52.4480598"
                      x2="193.157516"
                      y2="89.401165"
                      stroke="url(#linearGradient-17)"
                      strokeWidth="2"
                      opacity="0.298851376"
                      transform="translate(418.559348, 70.924612) scale(-1, 1) translate(-418.559348, -70.924612) "
                    ></line>
                    <polygon
                      fill="#00B5D7"
                      opacity="0.389113653"
                      transform="translate(165.828659, 77.654193) rotate(4.000000) translate(-165.828659, -77.654193) "
                      points="162.840166 74.817156 168.838438 74.7958702 168.817152 80.4912297 162.81888 80.5125154"
                    ></polygon>
                    <polygon
                      fill="#0D58EC"
                      opacity="0.389113653"
                      transform="translate(189.769240, 79.242930) rotate(4.000000) translate(-189.769240, -79.242930) "
                      points="186.780747 76.4058935 192.779018 76.3846077 192.757733 82.0799671 186.759461 82.1012529"
                    ></polygon>
                    <polygon
                      fill="#3C7DFB"
                      opacity="0.389113653"
                      transform="translate(177.798949, 78.448562) rotate(4.000000) translate(-177.798949, -78.448562) "
                      points="174.810456 75.6115247 180.808728 75.590239 180.787442 81.2855984 174.78917 81.3068842"
                    ></polygon>
                    <path
                      d="M533.826626,113.867476 L776.881022,115.156393 C777.933178,115.161972 778.784823,116.01338 778.790695,117.065535 L778.790695,117.065535 L778.790695,117.065535 L531.938152,115.756477 C531.932361,114.719003 532.768706,113.87327 533.80618,113.867479 C533.812995,113.867441 533.819811,113.86744 533.826626,113.867476 Z"
                      fillOpacity="0.53"
                      fill="url(#linearGradient-18)"
                      transform="translate(655.359124, 115.461470) scale(-1, 1) rotate(-6.000000) translate(-655.359124, -115.461470) "
                    ></path>
                    <path
                      d="M398.811586,92.1473434 L641.908596,93.2238544 C642.960019,93.2285104 643.811281,94.0795731 643.816183,95.1309941 L643.816183,95.1309941 L643.816183,95.1309941 L396.921706,94.0376668 C396.916861,92.9985162 397.755331,92.1521905 398.794481,92.1473454 C398.800183,92.1473189 398.805885,92.1473182 398.811586,92.1473434 Z"
                      fillOpacity="0.53"
                      fill="url(#linearGradient-19)"
                      transform="translate(520.364518, 93.634965) scale(-1, 1) rotate(-5.000000) translate(-520.364518, -93.634965) "
                    ></path>
                    <polyline
                      stroke="url(#linearGradient-20)"
                      points="802.704499 144.112325 813.361511 154.243126 825.970211 154.243126"
                    ></polyline>
                    <polygon
                      fill="url(#linearGradient-33)"
                      opacity="0.7"
                      transform="translate(316.131615, 38.294764) scale(-1, 1) rotate(-4.000000) translate(-316.131615, -38.294764) "
                      points="0.368402501 21.9868032 631.781303 24.227468 631.894827 54.6027241 21.6930202 53.7684499"
                    ></polygon>
                  </g>
                  <g transform="translate(835.402089, 146.253126)">
                    <line
                      x1="43.5"
                      y1="1.99"
                      x2="464"
                      y2="1.74"
                      stroke="url(#linearGradient-34)"
                      strokeWidth="2"
                    ></line>
                    <line
                      x1="0"
                      y1="1.495"
                      x2="419.5"
                      y2="1.5"
                      stroke="url(#linearGradient-35)"
                      strokeWidth="5"
                      transform="translate(210.000000, 1.000000) scale(-1, 1) translate(-210.000000, -1.000000) "
                    ></line>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        )}
        {type === "sample" && (
          <svg
            className="svg"
            width="100%"
            height="100%"
            viewBox="0 0 1920 90"
            preserveAspectRatio="none"
            version="1.1"
          >
            <defs>
              <linearGradient
                x1="50%"
                y1="-121.612961%"
                x2="50%"
                y2="100%"
                id="linearGradient-1"
              >
                <stop stopColor="#125192" offset="0%"></stop>
                <stop stopColor="#041A37" offset="100%"></stop>
              </linearGradient>
              <linearGradient
                x1="94.4482299%"
                y1="49.5593262%"
                x2="93.0498559%"
                y2="49.8957202%"
                id="linearGradient-2"
              >
                <stop stopColor="#629EFC" stopOpacity="0.5" offset="0%"></stop>
                <stop stopColor="#629EFC" stopOpacity="0" offset="100%"></stop>
              </linearGradient>
              <linearGradient
                x1="5.75577763%"
                y1="49.6119212%"
                x2="7.34938808%"
                y2="49.8667724%"
                id="linearGradient-3"
              >
                <stop stopColor="#629EFC" stopOpacity="0.5" offset="0%"></stop>
                <stop stopColor="#629EFC" stopOpacity="0" offset="100%"></stop>
              </linearGradient>
              <path
                d="M960.380666,75.9212488 L957.24257,75.9162088 C899.134626,75.7515688 721.935926,71.5532488 625.646468,63.3212488 C599.564292,63.0204549 601.854257,36.9587021 576.275039,21.5549988 C568.264612,17.8180474 560.629124,15.4189916 553.368575,14.3578312 L551.649231,13.9548622 C523.752127,7.49396669 504.915695,6.87639585 490.780666,0 L960.578152,2.1609 L1430.37635,0 C1416.23987,6.87709753 1397.40104,7.49409266 1369.49924,13.9568402 L1367.78844,14.3578312 C1360.52789,15.4189916 1352.8924,17.8180474 1344.88197,21.5549988 C1319.30275,36.9587021 1321.59272,63.0204549 1295.51054,63.3212488 L1289.63912,63.8202088 C1194.12888,71.8875688 1017.7094,75.9212488 960.380666,75.9212488 Z"
                id="path-4"
              ></path>
              <linearGradient
                x1="50%"
                y1="0%"
                x2="50%"
                y2="145.866912%"
                id="linearGradient-5"
              >
                <stop stopColor="#142132" offset="0%"></stop>
                <stop stopColor="#0A45C4" offset="100%"></stop>
              </linearGradient>
              <path
                d="M625.646468,63.3212488 C599.564292,63.0204549 599.141762,29.5489904 589.989325,21.5549988 C587.834838,19.090317 584.919078,16.7774596 581.242045,14.6164264 L580.797147,14.3578312 C576.352516,11.8026742 566.918451,7.01673046 552.494952,0 L945.666633,2.83840766 L1362.18009,0 L1356.36964,2.83840766 C1345.49852,8.17331531 1338.10862,11.9517668 1334.19992,14.173762 L1333.87789,14.3578312 C1329.99044,16.5926739 1326.92638,18.9917298 1324.68571,21.5549988 C1315.53328,29.5489904 1315.11075,63.0204549 1289.02857,63.3212488 C1120.91647,71.7212488 1011.49906,75.9212488 960.776345,75.9212488 C902.277642,75.9212488 790.567683,71.7212488 625.646468,63.3212488 Z"
                id="path-6"
              ></path>
              <filter
                x="-0.8%"
                y="-9.1%"
                width="101.6%"
                height="118.3%"
                filterUnits="objectBoundingBox"
                id="filter-8"
              >
                <feGaussianBlur
                  stdDeviation="2"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <radialGradient
                cx="48.7863339%"
                cy="100%"
                fx="48.7863339%"
                fy="100%"
                r="798.051696%"
                gradientTransform="translate(0.487863,1.000000),scale(0.056251,1.000000),rotate(97.428189),translate(-0.487863,-1.000000)"
                id="radialGradient-9"
              >
                <stop stopColor="#4780DA" offset="0%"></stop>
                <stop
                  stopColor="#4780DA"
                  stopOpacity="0.488658841"
                  offset="77.1131131%"
                ></stop>
                <stop stopColor="#4780DA" stopOpacity="0" offset="100%"></stop>
              </radialGradient>
              <filter
                x="-0.8%"
                y="-17.5%"
                width="101.6%"
                height="135.0%"
                filterUnits="objectBoundingBox"
                id="filter-10"
              >
                <feGaussianBlur
                  stdDeviation="3"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <radialGradient
                cx="48.7863339%"
                cy="100%"
                fx="48.7863339%"
                fy="100%"
                r="798.051696%"
                gradientTransform="translate(0.487863,1.000000),scale(0.056251,1.000000),rotate(97.428189),translate(-0.487863,-1.000000)"
                id="radialGradient-11"
              >
                <stop stopColor="#5390F1" offset="0%"></stop>
                <stop
                  stopColor="#4780DA"
                  stopOpacity="0.488658841"
                  offset="77.1131131%"
                ></stop>
                <stop stopColor="#4780DA" stopOpacity="0" offset="100%"></stop>
              </radialGradient>
              <linearGradient
                x1="100%"
                y1="50.1179185%"
                x2="-2.95410545%"
                y2="49.9460327%"
                id="linearGradient-12"
              >
                <stop stopColor="#ABD7FC" stopOpacity="0" offset="0%"></stop>
                <stop
                  stopColor="#73AEF7"
                  stopOpacity="0.947208469"
                  offset="5.27915311%"
                ></stop>
                <stop stopColor="#73AEF7" offset="7.03614871%"></stop>
                <stop
                  stopColor="#73AEF7"
                  stopOpacity="0.260891132"
                  offset="83.0137857%"
                ></stop>
                <stop stopColor="#73AEF7" stopOpacity="0" offset="100%"></stop>
              </linearGradient>
            </defs>
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g transform="translate(-195.000000, -1083.679513)">
                <g transform="translate(195.000000, 1080)">
                  <path
                    d="M1920,0.321248834 L1920,79.5212488 L1919.694,79.5212488 L1919.69495,77.3035344 C1905.19721,65.0963014 1884.07505,57.7313023 1856.32848,55.2085371 L1855.38,55.1244096 C1741.78565,51.2251968 1232.41659,51.2251968 958.129983,55.1244096 L958.140061,55.2382824 C680.67223,51.5477166 187.515617,51.6168419 75.972092,55.4456585 C47.757948,57.8857901 26.3196316,65.2788317 11.6571429,77.6247832 L11.657,79.5212488 L0,79.5212488 L0,0.321248834 L1920,0.321248834 Z"
                    fill="#0E1122"
                  ></path>
                  <g>
                    <use
                      fill="url(#linearGradient-1)"
                      xlinkHref="#path-4"
                    ></use>
                    <use
                      fill="url(#linearGradient-2)"
                      xlinkHref="#path-4"
                    ></use>
                    <use
                      fill="url(#linearGradient-3)"
                      xlinkHref="#path-4"
                    ></use>
                  </g>
                  <mask fill="white">
                    <use xlinkHref="#path-6"></use>
                  </mask>
                  <g>
                    <use fill="#041A37" xlinkHref="#path-6"></use>
                    <use
                      fill="url(#linearGradient-5)"
                      xlinkHref="#path-6"
                    ></use>
                  </g>
                  <path
                    d="M1359.43723,-3.6 L1353.62678,-0.76159234 C1342.75567,4.57331531 1335.36576,8.35176676 1331.45706,10.573762 L1331.13504,10.7578312 C1327.24758,12.9926739 1324.18352,15.3917298 1321.94286,17.9549988 C1312.79042,25.9489904 1312.36789,59.4204549 1286.28571,59.7212488 C1186.66885,68.1212488 1011.49906,72.3212488 960.776345,72.3212488 C902.277642,72.3212488 724.815302,68.1212488 628.389325,59.7212488 C602.307149,59.4204549 601.884619,25.9489904 592.732182,17.9549988 C590.577695,15.490317 587.661935,13.1774596 583.984902,11.0164264 L583.540004,10.7578312 C579.095373,8.20267418 569.661308,3.41673046 555.237809,-3.6"
                    stroke="#184BAE"
                    strokeWidth="2"
                    mask="url(#mask-7)"
                  ></path>
                  <path
                    d="M1356.00866,-7.2 L1350.19821,-4.36159234 C1339.3271,0.973315305 1331.93719,4.75176676 1328.02849,6.97376203 L1327.70646,7.15783116 C1323.81901,9.39267391 1320.75495,11.7917298 1318.51429,14.3549988 C1309.36185,22.3489904 1308.93932,55.8204549 1282.85714,56.1212488 C1185.52599,64.5212488 1011.49906,68.7212488 960.776345,68.7212488 C902.277642,68.7212488 725.729588,64.5212488 631.132182,56.1212488 C605.050007,55.8204549 604.627476,22.3489904 595.475039,14.3549988 C593.320552,11.890317 590.404792,9.57745958 586.727759,7.41642639 L586.282861,7.15783116 C581.83823,4.60267418 572.404165,-0.183269537 557.980666,-7.2"
                    stroke="#184BAE"
                    strokeWidth="2"
                    mask="url(#mask-7)"
                  ></path>
                  <path
                    d="M1362.18009,0 L1356.36964,2.83840766 C1345.49852,8.17331531 1338.10862,11.9517668 1334.19992,14.173762 L1333.87789,14.3578312 C1329.99044,16.5926739 1326.92638,18.9917298 1324.68571,21.5549988 C1315.53328,29.5489904 1315.11075,63.0204549 1289.02857,63.3212488 C1187.58314,71.7212488 1011.49906,75.9212488 960.776345,75.9212488 C902.277642,75.9212488 723.901017,71.7212488 625.646468,63.3212488 C599.564292,63.0204549 599.141762,29.5489904 589.989325,21.5549988 C587.834838,19.090317 584.919078,16.7774596 581.242045,14.6164264 L580.797147,14.3578312 C576.352516,11.8026742 566.918451,7.01673046 552.494952,0"
                    stroke="#5396FF"
                    strokeWidth="2"
                    filter="url(#filter-8)"
                  ></path>
                  <path
                    d="M1362.18009,0 L1356.36964,2.83840766 C1345.49852,8.17331531 1338.10862,11.9517668 1334.19992,14.173762 L1333.87789,14.3578312 C1329.99044,16.5926739 1326.92638,18.9917298 1324.68571,21.5549988 C1315.53328,29.5489904 1315.11075,63.0204549 1289.02857,63.3212488 C1187.58314,71.7212488 1011.49906,75.9212488 960.776345,75.9212488 C902.277642,75.9212488 723.901017,71.7212488 625.646468,63.3212488 C599.564292,63.0204549 599.141762,29.5489904 589.989325,21.5549988 C587.834838,19.090317 584.919078,16.7774596 581.242045,14.6164264 L580.797147,14.3578312 C576.352516,11.8026742 566.918451,7.01673046 552.494952,0"
                    stroke="#629EFC"
                    strokeWidth="2"
                  ></path>
                  <path
                    d="M1327.29292,45.3617233 L1326.78948,45.8235416 C1315.18078,56.5373749 1308.39661,67.2924814 1295.88571,67.8212488 C1196.27824,76.0690599 1014.51055,80.2676812 963.564933,80.4171129 L960.789371,80.420403 L957.687302,80.4113497 C906.278125,80.1825027 718.679443,75.9858024 620.077458,67.8212488 C607.347068,67.2832047 600.546115,56.1568552 588.558198,45.2597492 L588.157602,44.8973233 M1327.29292,45.3617233 L1327.40497,45.2597492 C1335.87919,37.5566226 1346.94535,29.9680495 1364.53019,26.315201 L1365.82857,26.0549988 C1368.06924,23.4917298 1466.26511,9.01845463 1542.72968,17.0222933 M373.233488,17.0222933 C449.698063,9.01845463 547.893934,23.4917298 550.1346,26.0549988 C568.039756,29.5135876 579.330461,37.0011002 587.93345,44.6963657 L588.157602,44.8973233"
                    stroke="url(#radialGradient-9)"
                    strokeWidth="5"
                    filter="url(#filter-10)"
                  ></path>
                  <path
                    d="M1327.29292,46.2617233 L1326.78948,46.7235416 C1315.18078,57.4373749 1308.39661,68.1924814 1295.88571,68.7212488 C1196.27824,76.9690599 1014.51055,81.1676812 963.564933,81.3171129 L960.789371,81.320403 L957.687302,81.3113497 C906.278125,81.0825027 718.679443,76.8858024 620.077458,68.7212488 C607.347068,68.1832047 600.546115,57.0568552 588.558198,46.1597492 L588.157602,45.7973233 M1327.29292,46.2617233 L1327.40497,46.1597492 C1335.87919,38.4566226 1346.94535,30.8680495 1364.53019,27.215201 L1365.82857,26.9549988 C1368.06924,24.3917298 1466.26511,9.91845463 1542.72968,17.9222933 M373.233488,17.9222933 C449.698063,9.91845463 547.893934,24.3917298 550.1346,26.9549988 C568.039756,30.4135876 579.330461,37.9011002 587.93345,45.5963657 L588.157602,45.7973233"
                    stroke="url(#radialGradient-11)"
                    strokeWidth="3"
                  ></path>
                  <path
                    d="M1356.22857,55.4456585 C1563.84852,51.5464456 1724.45567,51.5464456 1838.05002,55.4456585 C1866.26416,57.8857901 1887.70248,65.2788317 1902.36497,77.6247832"
                    stroke="url(#linearGradient-12)"
                    strokeWidth="2.5"
                  ></path>
                  <path
                    d="M11.6571429,55.4456585 C219.277088,51.5464456 379.884238,51.5464456 493.478592,55.4456585 C521.692736,57.8857901 543.131052,65.2788317 557.793541,77.6247832"
                    stroke="url(#linearGradient-12)"
                    strokeWidth="2.5"
                    transform="translate(284.725342, 65.073016) scale(-1, 1) translate(-284.725342, -65.073016) "
                  ></path>
                </g>
              </g>
            </g>
          </svg>
        )}
        {type === "square" && (
          <svg
            className="svg"
            width="100%"
            height="100%"
            viewBox="0 0 1920 90"
            preserveAspectRatio="none"
            version="1.1"
          >
            <defs>
              <radialGradient
                cx="50%"
                cy="30.055444%"
                fx="50%"
                fy="30.055444%"
                r="713.130816%"
                gradientTransform="translate(0.5, 0.3006), scale(0.0393, 1), rotate(-2.4292), translate(-0.5, -0.3006)"
                id="radialGradient-1"
              >
                <stop stopColor="#00E0DB" offset="0%"></stop>
                <stop stopColor="#3D7FFF" offset="100%"></stop>
              </radialGradient>
              <filter
                x="-17.9%"
                y="-456.5%"
                width="135.9%"
                height="1013.0%"
                filterUnits="objectBoundingBox"
                id="filter-2"
              >
                <feGaussianBlur
                  stdDeviation="35"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-17.0%"
                y="-646.2%"
                width="133.9%"
                height="1392.3%"
                filterUnits="objectBoundingBox"
                id="filter-3"
              >
                <feGaussianBlur
                  stdDeviation="28"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-39.0%"
                y="-807.7%"
                width="178.1%"
                height="1715.4%"
                filterUnits="objectBoundingBox"
                id="filter-4"
              >
                <feGaussianBlur
                  stdDeviation="35"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <linearGradient
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
                id="linearGradient-5"
              >
                <stop stopColor="#0E5FFF" stopOpacity="0" offset="0%"></stop>
                <stop stopColor="#0E5FFF" offset="21.3020387%"></stop>
                <stop stopColor="#0E5FFF" offset="60.4246107%"></stop>
                <stop stopColor="#0E5FFF" stopOpacity="0" offset="100%"></stop>
              </linearGradient>
              <linearGradient
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
                id="linearGradient-6"
              >
                <stop stopColor="#0E5FFF" stopOpacity="0" offset="0%"></stop>
                <stop stopColor="#0E5FFF" offset="6.53284483%"></stop>
                <stop stopColor="#00FFFF" offset="25.2177665%"></stop>
                <stop stopColor="#1777B7" offset="33.4949601%"></stop>
                <stop stopColor="#1871B4" offset="41.9532742%"></stop>
                <stop stopColor="#1D89CE" offset="48.0996027%"></stop>
                <stop stopColor="#0E5FFF" stopOpacity="0" offset="100%"></stop>
              </linearGradient>
              <filter
                x="-0.5%"
                y="-19.7%"
                width="101.0%"
                height="139.4%"
                filterUnits="objectBoundingBox"
                id="filter-7"
              >
                <feGaussianBlur
                  stdDeviation="1"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-51.4%"
                y="-51.4%"
                width="202.9%"
                height="202.9%"
                filterUnits="objectBoundingBox"
                id="filter-8"
              >
                <feGaussianBlur
                  stdDeviation="1.2"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-51.4%"
                y="-51.4%"
                width="202.9%"
                height="202.9%"
                filterUnits="objectBoundingBox"
                id="filter-9"
              >
                <feGaussianBlur
                  stdDeviation="1.2"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-51.4%"
                y="-51.4%"
                width="202.9%"
                height="202.9%"
                filterUnits="objectBoundingBox"
                id="filter-10"
              >
                <feGaussianBlur
                  stdDeviation="1.2"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-51.4%"
                y="-51.4%"
                width="202.9%"
                height="202.9%"
                filterUnits="objectBoundingBox"
                id="filter-11"
              >
                <feGaussianBlur
                  stdDeviation="1.2"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <linearGradient
                x1="50%"
                y1="-17.8886468%"
                x2="50%"
                y2="125.757911%"
                id="linearGradient-12"
              >
                <stop stopColor="#0E5FFF" stopOpacity="0" offset="0%"></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0.2"
                  offset="63.6246579%"
                ></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0.7"
                  offset="100%"
                ></stop>
              </linearGradient>
              <linearGradient
                x1="50%"
                y1="-19.0793713%"
                x2="50%"
                y2="197.916872%"
                id="linearGradient-13"
              >
                <stop stopColor="#000000" stopOpacity="0.5" offset="0%"></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0.12"
                  offset="100%"
                ></stop>
              </linearGradient>
              <linearGradient
                x1="35.9694535%"
                y1="126.83927%"
                x2="35.9694535%"
                y2="50%"
                id="linearGradient-14"
              >
                <stop stopColor="#004BFF" offset="0%"></stop>
                <stop stopColor="#1C3A75" stopOpacity="0" offset="100%"></stop>
              </linearGradient>
              <polygon
                id="path-15"
                points="1191.00778 12 1296.00778 12 1336 70.0234278 1227.18439 70.0234278"
              ></polygon>
              <filter
                x="-6.2%"
                y="-15.5%"
                width="112.4%"
                height="131.0%"
                filterUnits="objectBoundingBox"
                id="filter-16"
              >
                <feGaussianBlur
                  stdDeviation="3"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-48.0%"
                y="-48.0%"
                width="196.0%"
                height="196.0%"
                filterUnits="objectBoundingBox"
                id="filter-17"
              >
                <feGaussianBlur
                  stdDeviation="0.96"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-48.0%"
                y="-48.0%"
                width="196.0%"
                height="196.0%"
                filterUnits="objectBoundingBox"
                id="filter-18"
              >
                <feGaussianBlur
                  stdDeviation="0.96"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-48.0%"
                y="-48.0%"
                width="196.0%"
                height="196.0%"
                filterUnits="objectBoundingBox"
                id="filter-19"
              >
                <feGaussianBlur
                  stdDeviation="0.96"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <linearGradient
                x1="34.8240472%"
                y1="-221.721997%"
                x2="34.8240472%"
                y2="165.175953%"
                id="linearGradient-20"
              >
                <stop stopColor="#00FFFF" stopOpacity="0.8" offset="0%"></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0.76"
                  offset="40.3818151%"
                ></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0"
                  offset="99.9180507%"
                ></stop>
              </linearGradient>
              <filter
                x="-23.5%"
                y="0.0%"
                width="147.1%"
                height="100.0%"
                filterUnits="objectBoundingBox"
                id="filter-21"
              >
                <feGaussianBlur
                  stdDeviation="36 0"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-0.5%"
                y="-19.7%"
                width="101.0%"
                height="139.4%"
                filterUnits="objectBoundingBox"
                id="filter-22"
              >
                <feGaussianBlur
                  stdDeviation="1"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-51.4%"
                y="-51.4%"
                width="202.9%"
                height="202.9%"
                filterUnits="objectBoundingBox"
                id="filter-23"
              >
                <feGaussianBlur
                  stdDeviation="1.2"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-51.4%"
                y="-51.4%"
                width="202.9%"
                height="202.9%"
                filterUnits="objectBoundingBox"
                id="filter-24"
              >
                <feGaussianBlur
                  stdDeviation="1.2"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-51.4%"
                y="-51.4%"
                width="202.9%"
                height="202.9%"
                filterUnits="objectBoundingBox"
                id="filter-25"
              >
                <feGaussianBlur
                  stdDeviation="1.2"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-51.4%"
                y="-51.4%"
                width="202.9%"
                height="202.9%"
                filterUnits="objectBoundingBox"
                id="filter-26"
              >
                <feGaussianBlur
                  stdDeviation="1.2"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <polygon
                id="path-27"
                points="584 12 689 12 728.992217 70.0234278 620.176609 70.0234278"
              ></polygon>
              <filter
                x="-6.2%"
                y="-15.5%"
                width="112.4%"
                height="131.0%"
                filterUnits="objectBoundingBox"
                id="filter-28"
              >
                <feGaussianBlur
                  stdDeviation="3"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-48.0%"
                y="-48.0%"
                width="196.0%"
                height="196.0%"
                filterUnits="objectBoundingBox"
                id="filter-29"
              >
                <feGaussianBlur
                  stdDeviation="0.96"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-48.0%"
                y="-48.0%"
                width="196.0%"
                height="196.0%"
                filterUnits="objectBoundingBox"
                id="filter-30"
              >
                <feGaussianBlur
                  stdDeviation="0.96"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-48.0%"
                y="-48.0%"
                width="196.0%"
                height="196.0%"
                filterUnits="objectBoundingBox"
                id="filter-31"
              >
                <feGaussianBlur
                  stdDeviation="0.96"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <filter
                x="-23.5%"
                y="0.0%"
                width="147.1%"
                height="100.0%"
                filterUnits="objectBoundingBox"
                id="filter-32"
              >
                <feGaussianBlur
                  stdDeviation="36 0"
                  in="SourceGraphic"
                ></feGaussianBlur>
              </filter>
              <linearGradient
                x1="50%"
                y1="-17.8886468%"
                x2="50%"
                y2="125.757911%"
                id="linearGradient-33"
              >
                <stop stopColor="#0E5FFF" stopOpacity="0" offset="0%"></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0.2"
                  offset="63.6246579%"
                ></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0.7"
                  offset="100%"
                ></stop>
              </linearGradient>
              <linearGradient
                x1="50%"
                y1="-19.0793713%"
                x2="50%"
                y2="197.916872%"
                id="linearGradient-34"
              >
                <stop stopColor="#000000" stopOpacity="0.5" offset="0%"></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0.12"
                  offset="100%"
                ></stop>
              </linearGradient>
              <linearGradient
                x1="35.9694535%"
                y1="126.83927%"
                x2="35.9694535%"
                y2="50%"
                id="linearGradient-35"
              >
                <stop stopColor="#004BFF" offset="0%"></stop>
                <stop stopColor="#1C3A75" stopOpacity="0" offset="100%"></stop>
              </linearGradient>
              <polygon
                id="path-36"
                points="694 0 737.82646 65.1665155 1181.00778 65.1665155 1225.87749 0"
              ></polygon>
              <linearGradient
                x1="-1.02240265e-14%"
                y1="-1.43982049e-13%"
                x2="100%"
                y2="0%"
                id="linearGradient-37"
              >
                <stop stopColor="#0E5FFF" stopOpacity="0" offset="0%"></stop>
                <stop
                  stopColor="#1D89CE"
                  stopOpacity="0.08"
                  offset="18.9496927%"
                ></stop>
                <stop stopColor="#1871B4" offset="38.7321779%"></stop>
                <stop stopColor="#1777B7" offset="51.0897959%"></stop>
                <stop
                  stopColor="#00FFFF"
                  stopOpacity="0.33"
                  offset="74.7822335%"
                ></stop>
                <stop
                  stopColor="#0E5FFF"
                  stopOpacity="0"
                  offset="93.4671552%"
                ></stop>
                <stop stopColor="#0E5FFF" stopOpacity="0" offset="100%"></stop>
              </linearGradient>
              <linearGradient
                x1="26.2355307%"
                y1="100%"
                x2="69.0344979%"
                y2="100%"
                id="linearGradient-38"
              >
                <stop stopColor="#FFFFFF" stopOpacity="0.05" offset="0%"></stop>
                <stop stopColor="#FFFFFF" offset="51.2723483%"></stop>
                <stop
                  stopColor="#FFFFFF"
                  stopOpacity="0.05"
                  offset="100%"
                ></stop>
              </linearGradient>
            </defs>
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g transform="translate(-172, -1385)">
                <g transform="translate(172, 1385)">
                  <ellipse
                    fill="url(#radialGradient-1)"
                    opacity="0.400000006"
                    filter="url(#filter-2)"
                    cx="943.5"
                    cy="79.5"
                    rx="292.5"
                    ry="11.5"
                  ></ellipse>
                  <ellipse
                    fill="#0E14DE"
                    opacity="0.560000002"
                    filter="url(#filter-3)"
                    cx="944.5"
                    cy="75.5"
                    rx="247.5"
                    ry="6.5"
                  ></ellipse>
                  <ellipse
                    fill="#6580FF"
                    filter="url(#filter-4)"
                    cx="944.5"
                    cy="75.5"
                    rx="134.5"
                    ry="6.5"
                  ></ellipse>
                  <line
                    x1="1199.5"
                    y1="68.5"
                    x2="1291.5"
                    y2="68.5"
                    stroke="url(#linearGradient-5)"
                    strokeWidth="3"
                    transform="translate(1245.5, 68.5) scale(-1, 1) translate(-1245.5, -68.5)"
                  ></line>
                  <line
                    x1="627.5"
                    y1="68.5"
                    x2="719.5"
                    y2="68.5"
                    stroke="url(#linearGradient-5)"
                    strokeWidth="3"
                    transform="translate(673.5, 68.5) scale(-1, 1) translate(-673.5, -68.5)"
                  ></line>
                  <polyline
                    stroke="url(#linearGradient-6)"
                    strokeWidth="2"
                    filter="url(#filter-7)"
                    transform="translate(1618.4883, 76.3068) scale(1, -1) translate(-1618.4883, -76.3068)"
                    points="1316.97657 86.4469958 1608.0496 86.4469958 1628.17984 66.1665155 1766.77185 66.1665155 1786.74666 78.6400134 1885.67976 78.6400134 1920 78.6400134"
                  ></polyline>
                  <circle
                    stroke="#00FFF4"
                    strokeWidth="1.2"
                    opacity="0.7"
                    filter="url(#filter-8)"
                    cx="1672.5"
                    cy="73.5"
                    r="2.9"
                  ></circle>
                  <circle
                    stroke="#00FFF4"
                    strokeWidth="1.2"
                    opacity="0.7"
                    filter="url(#filter-9)"
                    cx="1689.5"
                    cy="73.5"
                    r="2.9"
                  ></circle>
                  <circle
                    stroke="#00FFF4"
                    strokeWidth="1.2"
                    opacity="0.7"
                    filter="url(#filter-10)"
                    cx="1723.5"
                    cy="73.5"
                    r="2.9"
                  ></circle>
                  <circle
                    fill="#00FFF4"
                    opacity="0.7"
                    filter="url(#filter-11)"
                    cx="1706.5"
                    cy="73.5"
                    r="3.5"
                  ></circle>
                  <g
                    filter="url(#filter-16)"
                    transform="translate(1263.5039, 41.0117) scale(-1, 1) translate(-1263.5039, -41.0117)"
                  >
                    <use
                      fill="url(#linearGradient-12)"
                      xmlnsXlink="#path-15"
                    ></use>
                    <use
                      fill="url(#linearGradient-13)"
                      xmlnsXlink="#path-15"
                    ></use>
                    <use
                      fill="url(#linearGradient-14)"
                      xmlnsXlink="#path-15"
                    ></use>
                  </g>
                  <circle
                    stroke="#00FFF4"
                    strokeWidth="0.96"
                    opacity="0.7"
                    filter="url(#filter-17)"
                    transform="translate(1264, 41) scale(-1, 1) translate(-1264, -41)"
                    cx="1264"
                    cy="41"
                    r="2.52"
                  ></circle>
                  <circle
                    fill="#00FFF4"
                    opacity="0.7"
                    filter="url(#filter-18)"
                    transform="translate(1251, 41) scale(-1, 1) translate(-1251, -41)"
                    cx="1251"
                    cy="41"
                    r="3"
                  ></circle>
                  <circle
                    fill="#00FFF4"
                    opacity="0.7"
                    filter="url(#filter-19)"
                    transform="translate(1277, 41) scale(-1, 1) translate(-1277, -41)"
                    cx="1277"
                    cy="41"
                    r="3"
                  ></circle>
                  <path
                    d="M1405.19463,13 L1373.3237,61 L1365.29412,61 L1397.16504,13 L1405.19463,13 Z M1417.51816,13 L1385.64723,61 L1377.61765,61 L1409.48857,13 L1417.51816,13 Z M1429.84169,13 L1397.97076,61 L1389.94118,61 L1421.8121,13 L1429.84169,13 Z M1442.16522,13 L1410.29429,61 L1402.26471,61 L1434.13563,13 L1442.16522,13 Z M1368.22404,13 L1336.35312,61 L1328.32353,61 L1360.19446,13 L1368.22404,13 Z M1380.54757,13 L1348.67665,61 L1340.64706,61 L1372.51799,13 L1380.54757,13 Z M1392.8711,13 L1361.00017,61 L1352.97059,61 L1384.84151,13 L1392.8711,13 Z M1454.48875,13 L1422.61782,61 L1414.58824,61 L1446.45916,13 L1454.48875,13 Z M1466.81228,13 L1434.94135,61 L1426.91176,61 L1458.78269,13 L1466.81228,13 Z M1479.13581,13 L1447.26488,61 L1439.23529,61 L1471.10622,13 L1479.13581,13 Z M1491.45934,13 L1459.58841,61 L1451.55882,61 L1483.42975,13 L1491.45934,13 Z M1355.90051,13 L1324.02959,61 L1316,61 L1347.87093,13 L1355.90051,13 Z M1540.75345,13 L1508.88253,61 L1500.85294,61 L1532.72387,13 L1540.75345,13 Z M1553.07698,13 L1521.20606,61 L1513.17647,61 L1545.0474,13 L1553.07698,13 Z M1565.40051,13 L1533.52959,61 L1525.5,61 L1557.37093,13 L1565.40051,13 Z M1577.72404,13 L1545.85312,61 L1537.82353,61 L1569.69446,13 L1577.72404,13 Z M1503.78287,13 L1471.91194,61 L1463.88235,61 L1495.75328,13 L1503.78287,13 Z M1516.1064,13 L1484.23547,61 L1476.20588,61 L1508.07681,13 L1516.1064,13 Z M1528.42992,13 L1496.559,61 L1488.52941,61 L1520.40034,13 L1528.42992,13 Z M1590.04757,13 L1558.17665,61 L1550.14706,61 L1582.01799,13 L1590.04757,13 Z M1602.3711,13 L1570.50017,61 L1562.47059,61 L1594.34151,13 L1602.3711,13 Z M1614.69463,13 L1582.8237,61 L1574.79412,61 L1606.66504,13 L1614.69463,13 Z M1627.01816,13 L1595.14723,61 L1587.11765,61 L1618.98857,13 L1627.01816,13 Z M1737.92992,13 L1706.059,61 L1698.02941,61 L1729.90034,13 L1737.92992,13 Z M1750.25345,13 L1718.38253,61 L1710.35294,61 L1742.22387,13 L1750.25345,13 Z M1762.57698,13 L1730.70606,61 L1722.67647,61 L1754.5474,13 L1762.57698,13 Z M1700.95934,13 L1669.08841,61 L1661.05882,61 L1692.92975,13 L1700.95934,13 Z M1713.28287,13 L1681.41194,61 L1673.38235,61 L1705.25328,13 L1713.28287,13 Z M1725.6064,13 L1693.73547,61 L1685.70588,61 L1717.57681,13 L1725.6064,13 Z M1774.90051,13 L1743.02959,61 L1735,61 L1766.87093,13 L1774.90051,13 Z M1639.34169,13 L1607.47076,61 L1599.44118,61 L1631.3121,13 L1639.34169,13 Z M1651.66522,13 L1619.79429,61 L1611.76471,61 L1643.63563,13 L1651.66522,13 Z M1663.98875,13 L1632.11782,61 L1624.08824,61 L1655.95916,13 L1663.98875,13 Z M1676.31228,13 L1644.44135,61 L1636.41176,61 L1668.28269,13 L1676.31228,13 Z M1688.63581,13 L1656.76488,61 L1648.73529,61 L1680.60622,13 L1688.63581,13 Z"
                    fill="url(#linearGradient-20)"
                    filter="url(#filter-21)"
                  ></path>
                  <polyline
                    stroke="url(#linearGradient-6)"
                    strokeWidth="2"
                    filter="url(#filter-22)"
                    transform="translate(301.5117, 76.3068) scale(-1, -1) translate(-301.5117, -76.3068)"
                    points="0 86.4469958 291.073031 86.4469958 311.203271 66.1665155 449.795275 66.1665155 469.770089 78.6400134 568.703185 78.6400134 603.023428 78.6400134"
                  ></polyline>
                  <circle
                    stroke="#00FFF4"
                    strokeWidth="1.2"
                    opacity="0.701565"
                    filter="url(#filter-23)"
                    transform="translate(247.5, 73.5) scale(-1, 1) translate(-247.5, -73.5)"
                    cx="247.5"
                    cy="73.5"
                    r="2.9"
                  ></circle>
                  <circle
                    stroke="#00FFF4"
                    strokeWidth="1.2"
                    opacity="0.701565"
                    filter="url(#filter-24)"
                    transform="translate(230.5, 73.5) scale(-1, 1) translate(-230.5, -73.5)"
                    cx="230.5"
                    cy="73.5"
                    r="2.9"
                  ></circle>
                  <circle
                    stroke="#00FFF4"
                    strokeWidth="1.2"
                    opacity="0.701565"
                    filter="url(#filter-25)"
                    transform="translate(196.5, 73.5) scale(-1, 1) translate(-196.5, -73.5)"
                    cx="196.5"
                    cy="73.5"
                    r="2.9"
                  ></circle>
                  <circle
                    fill="#00FFF4"
                    opacity="0.701565"
                    filter="url(#filter-26)"
                    transform="translate(213.5, 73.5) scale(-1, 1) translate(-213.5, -73.5)"
                    cx="213.5"
                    cy="73.5"
                    r="3.5"
                  ></circle>
                  <g filter="url(#filter-28)">
                    <use
                      fill="url(#linearGradient-12)"
                      xmlnsXlink="#path-27"
                    ></use>
                    <use
                      fill="url(#linearGradient-13)"
                      xmlnsXlink="#path-27"
                    ></use>
                    <use
                      fill="url(#linearGradient-14)"
                      xmlnsXlink="#path-27"
                    ></use>
                  </g>
                  <circle
                    stroke="#00FFF4"
                    strokeWidth="0.96"
                    opacity="0.7"
                    filter="url(#filter-29)"
                    cx="656"
                    cy="41"
                    r="2.52"
                  ></circle>
                  <circle
                    fill="#00FFF4"
                    opacity="0.7"
                    filter="url(#filter-30)"
                    cx="669"
                    cy="41"
                    r="3"
                  ></circle>
                  <circle
                    fill="#00FFF4"
                    opacity="0.7"
                    filter="url(#filter-31)"
                    cx="643"
                    cy="41"
                    r="3"
                  ></circle>
                  <path
                    d="M234.294118,13 L202.423191,61 L194.393605,61 L226.264531,13 L234.294118,13 Z M246.617647,13 L214.746721,61 L206.717134,61 L238.58806,13 L246.617647,13 Z M258.941176,13 L227.07025,61 L219.040664,61 L250.91159,13 L258.941176,13 Z M271.264706,13 L239.39378,61 L231.364193,61 L263.235119,13 L271.264706,13 Z M197.323529,13 L165.452603,61 L157.423017,61 L189.293943,13 L197.323529,13 Z M209.647059,13 L177.776133,61 L169.746546,61 L201.617472,13 L209.647059,13 Z M221.970588,13 L190.099662,61 L182.070075,61 L213.941002,13 L221.970588,13 Z M283.588235,13 L251.717309,61 L243.687722,61 L275.558649,13 L283.588235,13 Z M295.911765,13 L264.040839,61 L256.011252,61 L287.882178,13 L295.911765,13 Z M308.235294,13 L276.364368,61 L268.334781,61 L300.205707,13 L308.235294,13 Z M320.558824,13 L288.687897,61 L280.658311,61 L312.529237,13 L320.558824,13 Z M185,13 L153.129074,61 L145.099487,61 L176.970413,13 L185,13 Z M369.852941,13 L337.982015,61 L329.952428,61 L361.823354,13 L369.852941,13 Z M382.176471,13 L350.305544,61 L342.275958,61 L374.146884,13 L382.176471,13 Z M394.5,13 L362.629074,61 L354.599487,61 L386.470413,13 L394.5,13 Z M406.823529,13 L374.952603,61 L366.923017,61 L398.793943,13 L406.823529,13 Z M332.882353,13 L301.011427,61 L292.98184,61 L324.852766,13 L332.882353,13 Z M345.205882,13 L313.334956,61 L305.305369,61 L337.176296,13 L345.205882,13 Z M357.529412,13 L325.658486,61 L317.628899,61 L349.499825,13 L357.529412,13 Z M419.147059,13 L387.276133,61 L379.246546,61 L411.117472,13 L419.147059,13 Z M431.470588,13 L399.599662,61 L391.570075,61 L423.441002,13 L431.470588,13 Z M443.794118,13 L411.923191,61 L403.893605,61 L435.764531,13 L443.794118,13 Z M456.117647,13 L424.246721,61 L416.217134,61 L448.08806,13 L456.117647,13 Z M567.029412,13 L535.158486,61 L527.128899,61 L558.999825,13 L567.029412,13 Z M579.352941,13 L547.482015,61 L539.452428,61 L571.323354,13 L579.352941,13 Z M591.676471,13 L559.805544,61 L551.775958,61 L583.646884,13 L591.676471,13 Z M530.058824,13 L498.187897,61 L490.158311,61 L522.029237,13 L530.058824,13 Z M542.382353,13 L510.511427,61 L502.48184,61 L534.352766,13 L542.382353,13 Z M554.705882,13 L522.834956,61 L514.805369,61 L546.676296,13 L554.705882,13 Z M604,13 L572.129074,61 L564.099487,61 L595.970413,13 L604,13 Z M468.441176,13 L436.57025,61 L428.540664,61 L460.41159,13 L468.441176,13 Z M480.764706,13 L448.89378,61 L440.864193,61 L472.735119,13 L480.764706,13 Z M493.088235,13 L461.217309,61 L453.187722,61 L485.058649,13 L493.088235,13 Z M505.411765,13 L473.540839,61 L465.511252,61 L497.382178,13 L505.411765,13 Z M517.735294,13 L485.864368,61 L477.834781,61 L509.705707,13 L517.735294,13 Z"
                    fill="url(#linearGradient-20)"
                    filter="url(#filter-32)"
                    transform="translate(374.5497, 37) scale(-1, 1) translate(-374.5497, -37)"
                  ></path>
                  <g>
                    <use
                      fill="url(#linearGradient-33)"
                      xmlnsXlink="#path-36"
                    ></use>
                    <use
                      fill="url(#linearGradient-34)"
                      xmlnsXlink="#path-36"
                    ></use>
                    <use
                      fill="url(#linearGradient-35)"
                      xmlnsXlink="#path-36"
                    ></use>
                  </g>
                  <polyline
                    stroke="url(#linearGradient-37)"
                    strokeWidth="2"
                    points="0 3 693.992217 3 737.384066 68.1665155 1181 68.1665155 1226.26962 3 1920 3"
                  ></polyline>
                  <line
                    x1="696"
                    y1="67.495"
                    x2="1184.5"
                    y2="67.5"
                    stroke="url(#linearGradient-38)"
                    strokeWidth="5"
                    transform="translate(940.5, 67) scale(-1, 1) translate(-940.5, -67)"
                  ></line>
                </g>
              </g>
            </g>
          </svg>
        )}
        <div className="text-container">
          <div className={`title-text ${type}Text`}>{text}</div>
        </div>
      </div>
    </div>
  );
}

export { TopTitleBar };
