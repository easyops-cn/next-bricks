import { cloneDeep, merge } from "lodash";
import {
  Axis,
  BaseConfig,
  CircleOptions,
  Data,
  DataCircle,
  DataCircleOptions,
  DataFill,
  DataFillProps,
  DataLine,
  DataLineOptions,
  DataPolyProps,
  DrawPolygonOptions,
  DrawRadarBgOption,
  GradientPolygon,
  UserConfig,
} from "./interface.js";

export const colorMap = [
  "#5B8FF9",
  "#5AD8A6",
  "#5D7092",
  "#F6BD16",
  "#E86452",
  "#6DC8EC",
  "#945FB9",
  "#FF9845",
  "#1E9493",
  "#FF99C3",
]; //chart-v2 的主题色

export const baseUserConfig: UserConfig = {
  dataFill: {
    fillStyle: "rgba(76,132,250,0.67)",
  },
  dataCircle: {
    r: 2,
    strokeStyle: "#ccc",
    fillStyle: "#fff",
    lineWidth: 0.5,
  },
  dataLine: {
    strokeStyle: "#0B2EE7",
    lineWidth: 5,
  },
};
export const baseRadarConfig: BaseConfig = {
  n: 0,
  dataRadiusOfPercent: [],
  dataRadius: [],
  angleArr: [],
  tooltipsContentArr: [],
  originDataSource: [],
  radius: 1,
};
/**
 *  // 初始化参数配置
 * @param dataSource
 * @param radius
 * @returns BaseConfig
 */
export const constructBaseConfig = function (
  dataSource: Data[],
  radius: number
) {
  const baseConfig: BaseConfig = cloneDeep(baseRadarConfig);
  baseConfig.radius = radius;
  if (dataSource?.length < 1) return baseConfig;
  baseConfig.originDataSource = dataSource;
  baseConfig.n = dataSource.length;
  const disAngle = (Math.PI * 2) / baseConfig.n;
  dataSource.forEach((data, i) => {
    baseConfig.dataRadiusOfPercent[i] = data.value / data.maxValue;
    baseConfig.dataRadius[i] = baseConfig.dataRadiusOfPercent[i] * radius;
    baseConfig.angleArr[i] = i * disAngle;
  });
  return baseConfig;
};

export const constructUserConfig = function (
  dataFill: DataFill,
  dataCircle: DataCircle,
  dataLine: DataLine
) {
  const userConfig: UserConfig = cloneDeep(baseUserConfig);
  merge(userConfig.dataFill, dataFill);
  merge(userConfig.dataCircle, dataCircle);
  merge(userConfig.dataLine, dataLine);
  return userConfig;
};

/**
 * 获取数据点相对于原点的坐标
 * n：多边形边数
 * dataRadiusArr: 数据点的坐标数组
 * angleArr: 多边形的角度数组
 */
export const getDataPointsPos = function (
  n: number,
  dataRadiusArr: number[],
  angleArr: number[]
) {
  const dataPointsPosArray = [];
  for (let i = 0; i < n; i++) {
    const curPoinrPos: Axis = {
      x: 0,
      y: 0,
    };
    curPoinrPos.x = dataRadiusArr[i] * Math.sin(angleArr[i]);
    curPoinrPos.y = -dataRadiusArr[i] * Math.cos(angleArr[i]);
    dataPointsPosArray.push(curPoinrPos);
  }
  return dataPointsPosArray;
};

/**
 * 获取正多边形每个点的坐标位置数组（相对于原点）
 * n: 多边形的边数
 * r: 半径
 * origin: 原点位置
 */
export const getPolygonPos = function (n: number, r: number, origin: number[]) {
  const dotsArray = []; // 多边形每一个点的坐标数组，格式如[{x: 1, y: 2}]
  const angle = (Math.PI * 2) / n;
  for (let i = 0; i < n; i++) {
    const curPos: Axis = {
      x: 0,
      y: 0,
    };
    curPos.x = r * Math.sin(i * angle) + origin[0];
    curPos.y = -r * Math.cos(i * angle) + origin[1];
    dotsArray.push(curPos);
  }
  return dotsArray;
};

/**
 * 绘制闭合正多边形
 * n: 边数
 * r：半径
 * origin：正多边形的中心位置。数组形式[x, y]
 * fillStyle：填充样式
 * strokeStyle：线条样式
 * lineWidth: 线条宽度
 */
export const drawPolygon = function (
  context: CanvasRenderingContext2D,
  options: DrawPolygonOptions
) {
  // 对传入参数进行默认值设置
  const n = options.n,
    r = options.r,
    origin = options.origin,
    strokeStyle = options.strokeStyle,
    lineWidth = options.lineWidth * options.ratio,
    lineCap = "butt";

  context.save();
  context.beginPath();
  const angle = (Math.PI * 2) / n;
  context.translate(origin[0], origin[1]);
  context.moveTo(0, -r);
  for (let i = 0; i < n; i++) {
    context.rotate(angle);
    context.lineTo(0, -r);
  }
  context.closePath();
  context.stroke();

  if (options.strokeStyle) {
    context.strokeStyle = strokeStyle;
    context.lineWidth = lineWidth;
    context.lineCap = lineCap;
  }
  if (options.fillStyle) {
    if (typeof options.fillStyle === "string") {
      context.fillStyle = options.fillStyle;
    } else if (options.fillStyle instanceof Array) {
      // 创建线性渐变对象
      const gradient = context.createLinearGradient(-r, -r, r, r);
      options.fillStyle.forEach((colors) => {
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1]);
      });
      context.fillStyle = gradient;
    }

    context.fill();
  }
  context.restore();
};

/**
 * 绘制线性渐变的多边形,
 * n: 边数
 * r：半径
 * origin：正多边形的中心位置。数组形式[x, y]
 * strokeStyle：线条样式
 * lineWidth: 线条宽度
 */
export const drawGradientPolygon = function (
  context: CanvasRenderingContext2D,
  options: GradientPolygon
) {
  // 对传入参数进行默认值设置
  const { n, r, origin, strokeStyle } = options;
  const lineWidth = options.lineWidth * options.ratio,
    lineCap = "butt";
  context.save();
  const angle = (Math.PI * 2) / n;
  context.translate(origin[0], origin[1]);

  // 设置线条样式
  context.lineWidth = lineWidth;
  context.lineCap = lineCap;
  // 添加偏移量，使第一条边与正上方对齐
  context.rotate(-Math.PI / 2);

  for (let i = 0; i < n; i++) {
    // 计算当前边的起点和终点坐标
    const startX = r * Math.cos(angle * i),
      startY = r * Math.sin(angle * i),
      endX = r * Math.cos(angle * (i + 1)),
      endY = r * Math.sin(angle * (i + 1));
    // 开始一个新的路径
    context.beginPath();
    // 绘制多边形的一条边
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    // 创建线性渐变对象
    const gradient = context.createLinearGradient(startX, startY, endX, endY);
    gradient.addColorStop(0, strokeStyle);
    gradient.addColorStop(0.5, "#1D2B57");
    gradient.addColorStop(0.6, "#1D2B57");
    gradient.addColorStop(1, strokeStyle);
    // 设置当前路径的描边样式为线性渐变
    context.strokeStyle = gradient;
    context.stroke();
  }
  context.restore();
};

/**
 * 绘制数据点连接线条(一次性画完)
 * dataPoints: 数据的位置数组
 * strokeStyle: 线条样式
 * lineWidth: 线条宽度
 */
export const drawDataLine = function (
  context: CanvasRenderingContext2D,
  origin: number[],
  options: DataLineOptions
) {
  const { strokeStyle, lineWidth, dataPoints } = options;
  const dataPointsLen = dataPoints.length;
  context.save();
  context.beginPath();
  context.translate(origin[0], origin[1]);
  context.moveTo(dataPoints[0].x, dataPoints[0].y);
  for (let i = 1; i < dataPointsLen; i++) {
    context.lineTo(dataPoints[i].x, dataPoints[i].y);
  }
  context.closePath();
  context.strokeStyle = strokeStyle;
  context.lineWidth = lineWidth;
  context.lineJoin = "round";
  context.stroke();
  context.restore();
};
/**
 * 绘制放射性中心点到多边形顶点连线
 * @param context
 * @param origin
 * @param dataPoints 多边形顶点坐标
 */
export const drawVertexLine = function (
  context: CanvasRenderingContext2D,
  origin: number[],
  dataPoints: Axis[]
) {
  context.save();
  context.beginPath();
  dataPoints.map((point) => {
    context.moveTo(origin[0], origin[1]);
    context.lineTo(point.x, point.y);
  });
  context.strokeStyle = "#1D2B57";
  context.lineWidth = 2;
  context.stroke();
  context.restore();
};
export const drawLeadLineAndText = function (
  context: CanvasRenderingContext2D,
  origin: number[],
  r: number,
  dataPoints: Axis[],
  dataSource: Data[]
) {
  context.save();
  const offsetX = r / 2,
    offsetY = r / 4,
    offsetEndX = r / 12 > 10 ? r / 12 : 10,
    rectSize = 12;
  dataPoints.map((point, i) => {
    let curPosX = point.x,
      curPosMiddleX = point.x,
      curPosEndX = point.x,
      curPosY = point.y,
      rectX = point.x;
    const color = dataSource[i]?.color || colorMap[i] || "#ccc";
    context.beginPath();
    context.moveTo(point.x, point.y);

    if (point.x - origin[0] >= 0) {
      //引线方向往右
      curPosX += offsetX;
      curPosMiddleX = curPosX + offsetX;
      curPosEndX = curPosMiddleX + offsetEndX;
      rectX = curPosX + rectSize;
    } else if (point.x - origin[0] < 0) {
      //引线方向往左
      curPosX -= offsetX;
      curPosMiddleX = curPosX - offsetX;
      curPosEndX = curPosMiddleX - offsetEndX;
      rectX = curPosMiddleX + rectSize;
    }

    if (point.y - origin[1] < 0) {
      curPosY -= offsetY;
    } else if (point.y - origin[1] > 0) {
      curPosY += offsetY;
    }
    context.lineTo(curPosX, curPosY);
    context.lineTo(curPosEndX, curPosY);
    context.strokeStyle = "rgba(255, 255, 255, .1)";
    context.stroke();
    context.beginPath();
    context.moveTo(curPosMiddleX, curPosY);
    context.lineTo(curPosEndX, curPosY);
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();

    //文本
    const rectY = dataSource[i]?.percentValue
      ? curPosY - r / 3.5
      : curPosY - r / 5.5;
    const legendSize = r / 12;

    if (dataSource[i]?.name) {
      context.fillStyle = color;
      context.fillRect(rectX, rectY, rectSize, rectSize);

      context.textAlign = "left";
      context.font = `400 ${legendSize}px HarmonyOS_Sans_SC_Black`;
      context.fillStyle = "rgba(255, 255, 255, .4)";
      context.fillText(
        `${dataSource[i].name}`,
        rectX + rectSize * 1.5,
        rectY + rectSize / 2
      );
      context.stroke();
    }
    if (dataSource[i]?.percentValue) {
      const percentSize = r / 10;
      context.textAlign = "left";
      context.font = `500 ${percentSize}px HarmonyOS_Sans_SC_Black`;
      context.fillStyle = "#fff";
      context.fillText(
        `${dataSource[i]?.percentValue}`,
        rectX + rectSize * 1.5,
        rectY + rectSize / 2 + legendSize * 1.5
      );
      context.stroke();
    }
  });
  context.restore();
};

/**
 * 绘制数据点圆圈
 * dataPoints: 数据的位置数组
 * r: 圆圈半径
 * strokeStyle: 圆的描边样式
 * fillStyle: 圆的描边宽度
 * lineWidth: 圆的填充样式
 */
export const drawDataCircle = function (
  context: CanvasRenderingContext2D,
  origin: number[],
  ratio: number,
  options: DataCircleOptions
) {
  const { strokeStyle, fillStyle, dataPoints } = options;
  const r = options.r * ratio,
    lineWidth = options.lineWidth * ratio;

  const dataPointsPosArrayLen = dataPoints.length;
  for (let i = 0; i < dataPointsPosArrayLen; i++) {
    drawCircle(context, {
      x: dataPoints[i].x,
      y: dataPoints[i].y,
      r: r,
      originX: origin[0],
      originY: origin[1],
      strokeStyle: strokeStyle,
      lineWidth: lineWidth,
      fillStyle: fillStyle,
    });
  }
};

/**
 * 绘制圆圈
 * x: 圆心位置x
 * y: 圆心位置y
 * r: 半径
 * originX: 原点位置x
 * originY: 原点位置y
 * strokeStyle: 描边样式
 * lineWidth: 线条宽度
 * fillStyle: 填充样式
 */
export function drawCircle(
  context: CanvasRenderingContext2D,
  options: CircleOptions
) {
  const { x, y, r, originX, originY, strokeStyle, lineWidth, fillStyle } =
    options;
  context.save();
  context.beginPath();
  context.translate(originX, originY);
  context.arc(x, y, r, 0, Math.PI * 2);
  context.closePath();
  context.strokeStyle = strokeStyle;
  context.lineWidth = lineWidth;
  context.lineJoin = "round";
  context.fillStyle = fillStyle;
  context.stroke();
  context.fill();
  context.restore();
}

/**
 * 绘制数据多边形填充
 * dataPoints: 数据的位置数组
 * fillStyle: 填充样式
 */
export const drawDataFill = function (
  context: CanvasRenderingContext2D,
  origin: number[],
  options: DataFillProps
) {
  const { fillStyle, dataPoints } = options;
  const dataPointsPosArrayLen = dataPoints.length;
  context.save();
  context.beginPath();
  context.translate(origin[0], origin[1]);
  context.moveTo(dataPoints[0].x, dataPoints[0].y);
  for (let i = 1; i < dataPointsPosArrayLen; i++) {
    context.lineTo(dataPoints[i].x, dataPoints[i].y);
  }
  context.closePath();
  context.fillStyle = fillStyle;
  context.fill();
  context.restore();
};

/**
 * 绘制数据点组成的图案
 * dataLineOptions
 * dataFillOptions
 * dataCircleOptions
 */
export const drawDataPoly = function (
  context: CanvasRenderingContext2D,
  origin: number[],
  ratio: number,
  options: DataPolyProps
) {
  const { dataLineOptions, dataFillOptions, dataCircleOptions } = options;
  const dataPointsPosArrayLen = dataLineOptions.dataPoints.length;
  if (dataPointsPosArrayLen === 0) return;
  // 绘制数据点连接线条
  drawDataLine(context, origin, dataLineOptions);
  // 绘制数据多边形填充
  drawDataFill(context, origin, dataFillOptions);
  // 绘制数据点圆圈
  drawDataCircle(context, origin, ratio, dataCircleOptions);
};

/**
 * 绘制雷达的背景图
 * 参数options对象的属性如下：
 * layer: 多边形层数
 * n: 边数
 * r：半径
 * origin：正多边形的中心位置。数组形式[x, y]
 * oddStrokeStyle: index为奇数的多边形的描边颜色
 * oddFillStyle: index为奇数的多边形的填充颜色
 * evenStrokeStyle: index为偶数的多边形的描边颜色
 * evenFillStyle: index为偶数的多边形的填充颜色
 */
export const drawRadarBackground = function (
  context: CanvasRenderingContext2D,
  options: DrawRadarBgOption
) {
  const { layer, n, r, ratio, origin, lineWidth } = options;
  const evenStrokeStyle = "transparent",
    oddStrokeStyle = "transparent",
    evenFillStyle = [["#3366FF", "#83F5E1"]],
    oddFillStyle = "#29292d";
  // 由外向内绘画多边形
  for (let i = layer; i > 0; i--) {
    if (i === layer) {
      drawGradientPolygon(context, {
        n,
        r,
        origin,
        ratio,
        lineWidth,
        strokeStyle: "rgba(51, 102, 255)",
      });
      drawGradientPolygon(context, {
        n,
        r: r * 0.95,
        origin,
        ratio,
        strokeStyle: "rgba(76,132,250,0.1)",
        lineWidth,
      });
    } else {
      const layerDis = (r * 0.95) / layer;
      const fillStyle = i % 2 != 0 ? oddFillStyle : evenFillStyle,
        strokeStyle = i % 2 != 0 ? oddStrokeStyle : evenStrokeStyle,
        layerRadiu = layerDis * i;
      drawPolygon(context, {
        n,
        r: layerRadiu,
        origin,
        fillStyle,
        strokeStyle,
        lineWidth,
        ratio,
      });
    }
  }
};
