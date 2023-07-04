import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import styleText from "./styles.shadow.css";
const { defineElement, property } = createDecorators();

interface LightsComponentTitleProps {
  componentTitle: string;
}
/**
 * 构件 `data-view.lights-component-title`
 * @author astrid
 */

export
@defineElement("data-view.lights-component-title", {
  styleTexts: [styleText],
})
class LightsComponentTitle
  extends ReactNextElement
  implements LightsComponentTitleProps
{
  /**
   * 组件标题
   * @default -
   */
  @property()
  accessor componentTitle: string;
  render() {
    return (
      <LightsComponentTitleComponent componentTitle={this.componentTitle} />
    );
  }
}

export function LightsComponentTitleComponent(
  props: LightsComponentTitleProps
) {
  return (
    <div className="wrapper">
      <svg
        width="100%"
        height="100%"
        className="backgroundSvg"
        preserveAspectRatio="none"
        viewBox="0 0 568 38.5075"
        version="1.1"
      >
        <defs>
          <polygon
            id="path-1"
            points="-4.83397465e-13 0 568 0 568 38 -4.83397465e-13 38"
          />
          <radialGradient
            cx="5.49951298%"
            cy="142.661675%"
            fx="5.49951298%"
            fy="142.661675%"
            r="10572.0343%"
            gradientTransform="translate(0.055, 1.4266), scale(0.0021, 1), rotate(87.6881), scale(1, 2.6857), translate(-0.055, -1.4266)"
            id="radialGradient-3"
          >
            <stop stopColor="#99B3CF" offset="0%" />
            <stop stopColor="#8CB3F8" stopOpacity="0" offset="100%" />
          </radialGradient>
          <linearGradient
            x1="8.25189688%"
            y1="100%"
            x2="0.341667393%"
            y2="100%"
            id="linearGradient-4"
          >
            <stop stopColor="#8197B3" stopOpacity="0" offset="0%" />
            <stop stopColor="#226CBF" offset="100%" />
          </linearGradient>
          <polygon
            id="path-5"
            points="-4.79142205e-13 37 483.30127 37 483.30127 38 -4.79142205e-13 38"
          />
          <linearGradient
            x1="26.2355307%"
            y1="100%"
            x2="100%"
            y2="100%"
            id="linearGradient-6"
          >
            <stop stopColor="#BCFFFC" stopOpacity="0.05" offset="0%" />
            <stop stopColor="#BCFFFC" offset="40.2671547%" />
            <stop
              stopColor="#D2FFFD"
              stopOpacity="0.928149407"
              offset="48.3528191%"
            />
            <stop
              stopColor="#BCFFFC"
              stopOpacity="0.860654311"
              offset="56.7498907%"
            />
            <stop stopColor="#BCFFFC" stopOpacity="0" offset="100%" />
          </linearGradient>
          <polyline
            id="path-7"
            points="9 37.51 22.3877726 37.510053 357 38.01"
          />
          <filter
            x="-3.4%"
            y="-3300.0%"
            width="106.9%"
            height="5500.0%"
            filterUnits="objectBoundingBox"
            id="filter-8"
          >
            <feMorphology
              radius="1.5"
              operator="dilate"
              in="SourceAlpha"
              result="shadowSpreadOuter1"
            />
            <feOffset
              dx="0"
              dy="-3"
              in="shadowSpreadOuter1"
              result="shadowOffsetOuter1"
            />
            <feMorphology
              radius="1.5"
              operator="erode"
              in="SourceAlpha"
              result="shadowInner"
            />
            <feOffset dx="0" dy="-3" in="shadowInner" result="shadowInner" />
            <feComposite
              in="shadowOffsetOuter1"
              in2="shadowInner"
              operator="out"
              result="shadowOffsetOuter1"
            />
            <feGaussianBlur
              stdDeviation="3.5"
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
            />
            <feColorMatrix
              values="0 0 0 0 0.276   0 0 0 0 0.4182   0 0 0 0 0.69  0 0 0 0.31 0"
              type="matrix"
              in="shadowBlurOuter1"
            />
          </filter>
          <linearGradient
            x1="47.7970217%"
            y1="50.000399%"
            x2="76.3017589%"
            y2="50.0002374%"
            id="linearGradient-9"
          >
            <stop stopColor="#BCFFFC" stopOpacity="0.05" offset="0%" />
            <stop stopColor="#BCFFFC" offset="40.2671547%" />
            <stop
              stopColor="#FFFFFF"
              stopOpacity="0.928149407"
              offset="48.3528191%"
            />
            <stop
              stopColor="#BCFFFC"
              stopOpacity="0.860654311"
              offset="56.7498907%"
            />
            <stop stopColor="#BCFFFC" stopOpacity="0" offset="100%" />
          </linearGradient>
          <polyline
            id="path-10"
            points="8.5 38.5 17.1919999 38.5 362.5 37.515"
          />
          <filter
            x="-3.4%"
            y="-1649.2%"
            width="106.8%"
            height="2798.5%"
            filterUnits="objectBoundingBox"
            id="filter-11"
          >
            <feMorphology
              radius="1.5"
              operator="dilate"
              in="SourceAlpha"
              result="shadowSpreadOuter1"
            />
            <feOffset
              dx="0"
              dy="-3"
              in="shadowSpreadOuter1"
              result="shadowOffsetOuter1"
            />
            <feMorphology
              radius="1.5"
              operator="erode"
              in="SourceAlpha"
              result="shadowInner"
            />
            <feOffset dx="0" dy="-3" in="shadowInner" result="shadowInner" />
            <feComposite
              in="shadowOffsetOuter1"
              in2="shadowInner"
              operator="out"
              result="shadowOffsetOuter1"
            />
            <feGaussianBlur
              stdDeviation="3.5"
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
            />
            <feColorMatrix
              values="0 0 0 0 0.276   0 0 0 0 0.4182   0 0 0 0 0.69  0 0 0 0.31 0"
              type="matrix"
              in="shadowBlurOuter1"
            />
          </filter>
          <linearGradient
            x1="26.2355307%"
            y1="100%"
            x2="100%"
            y2="100%"
            id="linearGradient-12"
          >
            <stop stopColor="#1F87FF" stopOpacity="0.05" offset="0%" />
            <stop stopColor="#1F87FF" offset="51.2723483%" />
            <stop stopColor="#1F87FF" stopOpacity="0" offset="100%" />
          </linearGradient>
          <polyline
            id="path-13"
            points="9 38 22.0085017 34.51 377.639473 34.51"
          />
          <filter
            x="-5.3%"
            y="-673.4%"
            width="110.4%"
            height="1273.3%"
            filterUnits="objectBoundingBox"
            id="filter-14"
          >
            <feGaussianBlur stdDeviation="4" in="SourceGraphic" />
          </filter>
          <filter
            x="-6.6%"
            y="-816.6%"
            width="113.1%"
            height="1559.9%"
            filterUnits="objectBoundingBox"
            id="filter-15"
          >
            <feMorphology
              radius="1.5"
              operator="dilate"
              in="SourceAlpha"
              result="shadowSpreadOuter1"
            />
            <feOffset
              dx="0"
              dy="-3"
              in="shadowSpreadOuter1"
              result="shadowOffsetOuter1"
            />
            <feMorphology
              radius="1.5"
              operator="erode"
              in="SourceAlpha"
              result="shadowInner"
            />
            <feOffset dx="0" dy="-3" in="shadowInner" result="shadowInner" />
            <feComposite
              in="shadowOffsetOuter1"
              in2="shadowInner"
              operator="out"
              result="shadowOffsetOuter1"
            />
            <feGaussianBlur
              stdDeviation="3.5"
              in="shadowOffsetOuter1"
              result="shadowBlurOuter1"
            />
            <feColorMatrix
              values="0 0 0 0 0.276   0 0 0 0 0.4182   0 0 0 0 0.69  0 0 0 0.31 0"
              type="matrix"
              in="shadowBlurOuter1"
            />
          </filter>
        </defs>
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g>
            <mask id="mask-2" fill="white">
              <use xlinkHref="#path-1" />
            </mask>
            <use fillOpacity="0.28" fill="#062E77" xlinkHref="#path-1" />
            <g mask="url(#mask-2)">
              <g>
                <use fill="url(#radialGradient-3)" xlinkHref="#path-5" />
                <use fill="url(#linearGradient-4)" xlinkHref="#path-5" />
              </g>
              <polygon fill="#0D2B6C" points="12 0 563 0 563 1 12 1" />
              <polygon
                fill="#388BDB"
                points="-1.58623115e-14 0 16 0 16 1 -1.58623115e-14 1"
              />
              <rect fill="#388BDB" x="552" y="0" width="16" height="1" />
            </g>
          </g>
          <g
            opacity="0.827566964"
            transform="translate(183, 37.76) scale(-1, 1) translate(-183, -37.76)"
          >
            <use
              fill="black"
              fillOpacity="1"
              filter="url(#filter-8)"
              xlinkHref="#path-7"
            />
            <use
              stroke="url(#linearGradient-6)"
              strokeWidth="3"
              xlinkHref="#path-7"
            />
          </g>
          <g
            opacity="0.324614025"
            transform="translate(185.5, 38.0075) scale(-1, -1) translate(-185.5, -38.0075)"
          >
            <use
              fill="black"
              fillOpacity="1"
              filter="url(#filter-11)"
              xlinkHref="#path-10"
            />
            <use
              stroke="url(#linearGradient-9)"
              strokeWidth="3"
              xlinkHref="#path-10"
            />
          </g>
          <g
            filter="url(#filter-14)"
            transform="translate(193.3197, 36.255) scale(-1, 1) translate(-193.3197, -36.255)"
          >
            <use
              fill="black"
              fillOpacity="1"
              filter="url(#filter-15)"
              xlinkHref="#path-13"
            />
            <use
              stroke="url(#linearGradient-12)"
              strokeWidth="3"
              xlinkHref="#path-13"
            />
          </g>
        </g>
      </svg>
      <div className="content">
        <svg
          width="38px"
          height="38px"
          viewBox="0 0 38 38"
          version="1.1"
          preserveAspectRatio="none"
        >
          <defs>
            <filter
              x="-37.5%"
              y="-37.5%"
              width="175.0%"
              height="175.0%"
              filterUnits="objectBoundingBox"
              id="filter-1"
            >
              <feGaussianBlur stdDeviation="3" in="SourceGraphic" />
            </filter>
          </defs>
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(-97, -692)">
              <g transform="translate(102, 699)">
                <polygon
                  fillOpacity="0.44"
                  fill="#04BAE1"
                  filter="url(#filter-1)"
                  points="0 12.6002217 12 0 24 12.6002217 12 24"
                />
                <path
                  d="M12,0 L24,12.6002217 L12,24 L12,20.2 L20,12.6002217 L12,4.2 L12,0 Z"
                  id="形状结合"
                  fill="#04BAE1"
                  opacity="0.599999964"
                />
                <rect fill="#9CC9FF" x="5" y="10" width="3" height="3" />
                <polygon fill="#C9F4FF" points="10 7 15 12.4001478 10 17" />
              </g>
            </g>
          </g>
        </svg>
        <div className="title">{props.componentTitle}</div>
      </div>
    </div>
  );
}
