import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import React from "react";
import {Group} from "@tweenjs/tween.js";
import {Vector3} from "three/src/math/Vector3.js";
interface TrapezoidalObjectData {
     width: number;
     height: number;
     point: Vector3
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
