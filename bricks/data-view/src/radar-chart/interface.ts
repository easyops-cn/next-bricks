type Color = React.CSSProperties["color"];
export type Colors = Color[][];
type NumArr = number[];
export type Axis = {
  x: number;
  y: number;
};
export interface DrawRadarBgOption {
  layer: number;
  n: number;
  r: number;
  ratio: number;
  origin: number[];
  lineWidth?: number;
}
export interface DrawPolygonOptions extends Omit<DrawRadarBgOption, "layer"> {
  fillStyle?: Color | Colors;
  strokeStyle?: string;
}

export interface GradientPolygon extends DrawPolygonOptions {}
export interface DataLineOptions {
  dataPoints: Axis[];
  strokeStyle?: Color;
  lineWidth?: number;
}
export interface DataCircleOptions extends DataLineOptions {
  r?: number;
  fillStyle?: Color;
}
export interface CircleOptions extends Axis {
  originX: number;
  originY: number;
  r: number;
  lineWidth?: number;
  strokeStyle?: Color;
  fillStyle?: Color;
}
export interface DataFillProps {
  dataPoints: Axis[];
  fillStyle?: Color;
}
export interface DataPolyProps {
  dataLineOptions: DataLineOptions;
  dataFillOptions: DataFillProps;
  dataCircleOptions: DataCircleOptions;
}
export interface BaseConfig {
  n: number;
  dataRadiusOfPercent: NumArr;
  dataRadius: NumArr;
  angleArr: NumArr;
  tooltipsContentArr: NumArr;
  radius: number;
  originDataSource: Data[];
}
export interface UserConfig {
  dataFill: DataFill;
  dataCircle: DataCircle;
  dataLine: DataLine;
}
export interface Data {
  value: number;
  maxValue: number;
  name?: string;
  color?: Color;
  percentValue?: number | string;
}
export type DataFill = {
  fillStyle?: Color;
};
export type DataLine = {
  lineWidth?: number;
  strokeStyle?: Color;
};
export type DataCircle = Omit<DataCircleOptions, "dataPoints">;
export interface RadarProps {
  dataSource: Data[];
  height?: number;
  width?: number;
  radius?: number;
  scale?: number;
  value?: number | string;
  dataFill?: DataFill;
  dataCircle?: DataCircle;
  dataLine?: DataLine;
}
