import React from "react";
import {Group} from "@tweenjs/tween.js";
import { Vector3Tuple } from "three";
interface TrapezoidalObjectData {
     width: number;
     height: number;
     point: Vector3Tuple
}
export interface TrapezoidalObjectProps {
     // objectRef?: React.RefObject<CSS3DObject>;
     trapezoidalTweenRef: React.RefObject<Group>;
     objectData: TrapezoidalObjectData;
     leftBtnName?: string | undefined;
     rightBtnName?: string | undefined;
     leftOnClick?: () => void;
     rightOnClick?: () => void;

 }
