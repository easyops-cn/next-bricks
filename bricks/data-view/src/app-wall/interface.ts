import { Vector3Tuple } from "three";
interface TrapezoidalObjectData {
     width: number;
     height: number;
     point: Vector3Tuple
}
export interface TrapezoidalProps {
     leftBtnName?: string | undefined;
     rightBtnName?: string | undefined;
}
export interface TrapezoidalObjectProps extends TrapezoidalProps{
     objectData: TrapezoidalObjectData;
     leftOnClick?: () => void;
     rightOnClick?: () => void;

 }
