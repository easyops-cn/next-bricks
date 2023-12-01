import { Vector3Tuple, Object3D } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { CabinetThumbnailProps } from "../cabinet/cabinet-thumbnail/index.jsx";
import { AppData } from "./utils.js";
import { AppWallCardItem } from "./card-item/index.js";
import {
  SimpleCardItem,
  SimpleCardItemProps,
} from "../simple-card-item/index.js";

interface TrapezoidalObjectData {
  width: number;
  height: number;
  point: Vector3Tuple;
}
export interface TrapezoidalProps extends CabinetThumbnailProps {
  leftBtnName?: string | undefined;
  rightBtnName?: string | undefined;
}
export interface TrapezoidalObjectProps extends TrapezoidalProps {
  objectData: TrapezoidalObjectData;
  leftOnClick?: () => void;
  rightOnClick?: () => void;
}
export type AnimationEventType =
  | "click"
  | "dbClick"
  | "mouseenter"
  | "mouseleave"
  | "other";

export type Position = {
  x: number;
  y: number;
  z: number;
};
export type Grid = Omit<Position, "z">;
export type Target = AppData & Grid;
export interface Targets {
  table: Object3D[];
  curve: Object3D[];
}
export interface CardSize {
  width: number; //卡片宽度
  height: number;
  outerWidth: number; //卡片宽度+边距
  outerHeight: number;
  lgWidth: number;
  lgHeight: number;
}

export type DistanceConfig = {
  numRange: number[];
  distance: number;
};
export type bounds = {
  width: number;
  height: number;
  margin: number;
  z: number;
};
export interface BaseConfig {
  maxX: number;
  maxY: number;
  radius: number;
  bounds: bounds;
}

export interface Ele extends HTMLElement {
  __userData: Target;
  __objectCSS: CSS3DObject;
  __curve: Object3D;
}
export interface RegisterEvents {
  element: Ele;
  mouseoverTimer: number;
  mouseoutTimer: number;
  clickTimer: number;
  dblClickTimer: number;
  isShowGraph3D: boolean;
  isShowAppInfo: boolean;
  isShowRelations: boolean;
  enable: boolean;
}
export type AppWallCardBrickNameType =
  | "data-view.app-wall-card-item"
  | "data-view.simple-card-item";

export type AppWallCardBrickEleType = AppWallCardItem & SimpleCardItem;
