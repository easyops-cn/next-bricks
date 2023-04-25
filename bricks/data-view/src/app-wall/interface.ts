import { Vector3Tuple,Object3D } from "three";
import { CabinetContainerProps } from "../cabinet/cabinet-container/index.jsx";
import { Clusters } from "../cabinet/cabinet-thumbnail/index.jsx";
import { AppData } from "./utils.js";

interface TrapezoidalObjectData {
     width: number;
     height: number;
     point: Vector3Tuple
}
export interface TrapezoidalProps {
     leftBtnName?: string | undefined;
     rightBtnName?: string | undefined;
     clusters?: Clusters[];

}
export interface TrapezoidalObjectProps extends TrapezoidalProps{
     objectData: TrapezoidalObjectData;
     appData: AppData;
     leftOnClick?: () => void;
     rightOnClick?: () => void;

 }
export  type AnimationEventType = "click"|"dbClick"|"mouseenter"|"mouseleave"|"other"

export type Position = {
     x: number;
     y: number;
     z: number;
}
export type Grid = Omit<Position, 'z'>;
export type Target = AppData & Grid
export interface Targets {
     table: Object3D[];
     curve: Object3D[];
}
export interface CardSize {
     width: number;
     height: number;
     outerWidth: number;
     outerHeight: number;
     lgWidth: number;
     lgHeight: number;
}

export type DistanceConfig = {
     numRange: number[];
     distance: number;
}
export type bounds = {
     width: number;
     height: number;
     margin: number;
     z: number
}
export interface BaseConfig {
     maxX: number;
     maxY: number;
     radius: number;
     bounds: bounds
}