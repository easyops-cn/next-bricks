import React, { ReactElement, useEffect, useRef, useState } from "react";
import {
  baseRadarConfig,
  baseUserConfig,
  constructBaseConfig,
  constructUserConfig,
  drawDataPoly,
  drawLeadLineAndText,
  drawRadarBackground,
  drawVertexLine,
  getDataPointsPos,
  getPolygonPos,
} from "./utils.js";
import { BaseConfig, RadarProps, UserConfig } from "./interface.js";

export function Radar({
  dataSource,
  radius,
  value,
  dataFill,
  dataCircle,
  dataLine,
  ...props
}: RadarProps): ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D>(null);
  const [baseConfig, setBaseConfig] = useState<BaseConfig>(baseRadarConfig);
  const [userConfig, setUserConfig] = useState<UserConfig>(baseUserConfig);

  const ratio = window.devicePixelRatio;
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const canvasWidth = canvas.clientWidth;
    const canvasHeight = canvas.clientHeight;
    // 根据设备像素比调整画布的实际像素大小
    canvas.width = canvasWidth * ratio;
    canvas.height = canvasHeight * ratio;

    const defaultRadius = Math.min(canvas.width, canvas.height) * 0.25; // 正多边形的默认半径

    contextRef.current = context;
    setBaseConfig(constructBaseConfig(dataSource, radius ?? defaultRadius));
  }, [dataSource, radius]);
  useEffect(() => {
    setUserConfig(constructUserConfig(dataFill, dataCircle, dataLine));
  }, [dataFill, dataCircle, dataLine]);

  useEffect(() => {
    let radiusPrecent = 0,
      timer = null;
    const canvas = canvasRef.current;
    const context = contextRef.current;
    const origin = [canvas.width / 2, canvas.height / 2];

    if (context) {
      // 起requestAnimationFrame为了数值绘制区域有过渡效果
      const drawFrame = () => {
        timer = window.requestAnimationFrame(drawFrame);
        // 数据点坐标元素
        radiusPrecent += 0.05;
        if (radiusPrecent >= 1) {
          window.cancelAnimationFrame(timer);
        }
        // 清空画布
        context.clearRect(0, 0, canvas.width, canvas.height);
        // 绘制背景图
        drawRadarBackground(context, {
          layer: 5,
          n: baseConfig.n,
          r: baseConfig.radius,
          ratio,
          origin,
          lineWidth: 2,
        });

        const dataRadius = baseConfig.dataRadius.map((value) => {
          return value * radiusPrecent;
        });
        const dataPointsPosArray = getDataPointsPos(
          baseConfig.n,
          dataRadius,
          baseConfig.angleArr
        );
        const dataLineOptions = {
          dataPoints: dataPointsPosArray,
          strokeStyle: userConfig.dataLine.strokeStyle,
          lineWidth: userConfig.dataLine.lineWidth,
        };
        const dataCircleOptions = {
          dataPoints: dataPointsPosArray,
          r: userConfig.dataCircle.r,
          strokeStyle: userConfig.dataCircle.strokeStyle,
          fillStyle: userConfig.dataCircle.fillStyle,
          lineWidth: userConfig.dataCircle.lineWidth,
        };
        const dataFillOptions = {
          dataPoints: dataPointsPosArray,
          fillStyle: userConfig.dataFill.fillStyle,
        };
        drawDataPoly(context, origin, ratio, {
          dataLineOptions: dataLineOptions,
          dataFillOptions: dataFillOptions,
          dataCircleOptions: dataCircleOptions,
        });

        //绘制放射性中心点到多边形顶点连线
        const polygonOuterPointsPosArr = getPolygonPos(
          baseConfig.n,
          baseConfig.radius,
          origin
        );
        drawVertexLine(context, origin, polygonOuterPointsPosArr);
        drawLeadLineAndText(
          context,
          origin,
          baseConfig.radius,
          polygonOuterPointsPosArr,
          baseConfig.originDataSource
        );
        if (value) {
          const fontSize = baseConfig.radius / 5;
          context.font = `bold ${fontSize}px HarmonyOS_Sans_SC_Black`;
          context.fillStyle = "#fff";
          context.textAlign = "center";
          context.textBaseline = "middle";
          context.fillText(`${value}`, origin[0], origin[1]);
        }
      };
      drawFrame();
    }
  }, [baseConfig, userConfig, value]);

  return (
    <div
      className="radarWrap"
      style={{ width: `${props.width}px`, height: `${props.height}px` }}
    >
      <canvas className="canvasWrap" ref={canvasRef} />
    </div>
  );
}
