import { Vector3, Object3D, Quaternion, Vector3Tuple, PerspectiveCamera } from "three";
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import "./card-item/index.js";
import "./relation-line/index.js";
import "./system-card/index.js";
import type { AppWallCardItemProps } from "./card-item/index.js";
import type { AppWallRelationLine, AppWallRelationLineProps } from "./relation-line/index.js";
import type { SystemCardProps } from "./system-card/index.js";
import { TrapezoidalObjectProps, TrapezoidalProps, bounds, CardSize, DistanceConfig, Position, Target } from "./interface.js";
import { CabinetThumbnail } from "../cabinet/cabinet-thumbnail/index.jsx";


export interface AppData {
  key: string;
  status: "normal" | "warning";
  cardItemProps: AppWallCardItemProps,
  systemCardProps: SystemCardProps,
  trapezoidalProps: TrapezoidalProps;
}

export type Relation = {
  source: string;
  target: string;
}

export interface UserData {
  appData: AppData,
  elementStyle: {
    width: number,
    height: number,
  },
  turningStyle: {
    width: number,
    height: number,
  },
  systemCardStyle: {
    width: number,
    height: number,
  },
  hoverStyle: {
    width: number,
    height: number,
  },
  cardItemObject3D: {
    curve: Object3D,
    flat: Object3D,
    hover: Object3D,
    clickTurn: Object3D,
  },
  systemCardObject3D: {
    clickTurn: Object3D,
    front: Object3D,
  }
}
export const createRelationLine = (sourceVector: Vector3, targetVector: Vector3, lightColor: AppWallRelationLineProps["lightColor"]): CSS3DObject => {
  const subVector = new Vector3().subVectors(targetVector, sourceVector);
  const lineLength = subVector.length();

  const lineElement = document.createElement('data-view.app-wall-relation-line') as AppWallRelationLine;
  lineElement.style.height = `${lineLength}px`;
  lineElement.classList.add("relation-line");
  lineElement.lightColor = lightColor;
  const lineObject = new CSS3DObject(lineElement);

  const centerVector = new Vector3().lerpVectors(sourceVector, targetVector, 0.5);
  lineObject.position.copy(centerVector);
  // lineObject.lookAt(new Vector3(0, 0, 10).add(centerVector));
  // lineObject.lookAt(new Vector3(0, 10000, 0));

  const quaternion = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0).normalize(), subVector.clone().normalize());
  lineObject.setRotationFromQuaternion(quaternion);

  return lineObject;
};

export const getCenterPointOrSubPoint = (start: Vector3Tuple, end: Vector3Tuple) => {
  const pointA = new Vector3(start[0], start[1], start[2]);
  const pointB = new Vector3(end[0], end[1], end[2]);
  return {
    centerVector: new Vector3().lerpVectors(pointA, pointB, 0.5), //中心点坐标
    subVector: new Vector3().subVectors(pointA, pointB) // a-b向量
  }
}
export const createTrapezoidalRightOrLeftElement = (props: {
  BW: number;
  TW: number;
  d: number;
  TH: number;
  BH: number;
  isLeft: boolean
}): CSS3DObject => {
  const { BW, TW, d, TH, BH, isLeft } = props;
  const height = Math.sqrt(Math.pow((TW / 2 - BW / 2), 2) + Math.pow(d, 2)); //斜边
  const wrapper = document.createElement("div");
  wrapper.style.cssText = `
                   width: ${height}px;
                   height:${TH}px;
                   position: relative;
                   clip-path: polygon(0 0, ${height}px ${(TH / 2 - BH / 2)}px, ${height}px ${(TH / 2 - BH / 2) + BH}px, 0 ${TH}px);
                    `;
  const cantCard = document.createElement("div");
  cantCard.className = "trapezoidalLeftOrRightAnimation";
  wrapper.appendChild(cantCard);
  const start: Vector3Tuple = isLeft ? [-BW / 2, 0, 0] : [BW / 2, 0, 0];
  const end: Vector3Tuple = isLeft ? [-TW / 2, 0, d] : [TW / 2, 0, d];
  const objectCantModel = new CSS3DObject(wrapper);
  const { centerVector, subVector } = getCenterPointOrSubPoint(start, end);
  objectCantModel.position.copy(centerVector);
  const quaternion = new Quaternion().setFromUnitVectors(new Vector3(1, 0, 0).normalize(), subVector.clone().normalize());
  objectCantModel.setRotationFromQuaternion(quaternion);
  return objectCantModel;
}

export const createTrapezoidalTopOrBottomElement = (props: {
  BW: number;
  TW: number;
  d: number;
  TH: number;
  BH: number;
  isTop: boolean
}): CSS3DObject => {
  const { BW, TW, d, TH, BH, isTop } = props;
  const height = Math.sqrt(Math.pow((TH / 2 - BH / 2), 2) + Math.pow(d, 2)); //斜边
  const wrapper = document.createElement("div");
  wrapper.style.cssText = `
                   width: ${TW}px;
                   height:${height}px;
                   position: relative;
                   clip-path: polygon(0 0, ${TW}px 0, ${(TW / 2 - BW / 2) + BW}px ${height}px, ${TW / 2 - BW / 2}px ${height}px);
                   `;
  const cantCard = document.createElement("div");
  cantCard.className = "trapezoidalTopOrBottomAnimation";
  wrapper.appendChild(cantCard);
  const objectCantModel = new CSS3DObject(wrapper);
  const start: Vector3Tuple = isTop ? [0, -BH / 2, 0] : [0, BH / 2, 0];
  const end: Vector3Tuple = isTop ? [0, -TH / 2, d] : [0, TH / 2, d];
  const {
    centerVector,
    subVector
  } = getCenterPointOrSubPoint(start, end);
  objectCantModel.position.copy(centerVector)
  const topQuaternion = new Quaternion().setFromUnitVectors(new Vector3(0, -1, 0).normalize(), subVector.clone().normalize());
  objectCantModel.setRotationFromQuaternion(topQuaternion);
  return objectCantModel;
}
/**
 * 创建梯台模型
 * @param props
 * @returns
 */
export const createTrapezoidalObject = (props: TrapezoidalObjectProps) => {
  const { objectData, leftBtnName, clusters, columns, leftOnClick, rightBtnName, rightOnClick,appName } = props;
  const d = 450;
  const container = document.createElement('div');
  const objectContainer = new CSS3DObject(container);
  objectContainer.position.set(...objectData.point);
  // 模型为梯形 , 底部和顶部的宽高成一定的比例计算，  bw: tw = 1:11; bh:th= 1:4.5
  const BW: number = objectData.width, BH: number = objectData.height, TW: number = BW * 11, TH: number = BH * 4.5;
  // 底部
  const bottomCard = document.createElement('div');
  bottomCard.style.cssText = `
                   width: ${BW}px;
                   height: ${BH}px;
                   box-shadow: inset 0px 1px 2px 0px rgba(255,255,255,0.45);
                   border: 1px solid rgba(118,255,255,0.58);
                   padding: 16px;
                   `
  const objectBottomModel = new CSS3DObject(bottomCard);
  objectBottomModel.position.z = 0;
  objectContainer.add(objectBottomModel);

  // 顶部
  const topCard = document.createElement('div');
  topCard.style.cssText = `
                   width: ${TW}px;
                   height:${TH}px;
                   background: linear-gradient(rgb(13, 54, 179,0.6) 0%, rgb(74, 108, 156,0.6) 100%);
                   box-sizing: border-box;
                   padding: 16px;
                   `;
  const thumbnailEle = document.createElement("data-view.cabinet-thumbnail") as CabinetThumbnail;
  thumbnailEle.clusters = clusters ?? [];
  thumbnailEle.columns = columns ?? 4;
  thumbnailEle.appName = appName;
  topCard.className = "visibilityAnimate";
  topCard.appendChild(thumbnailEle);
  const objectTopModel = new CSS3DObject(topCard);
  objectTopModel.position.set(0, 0, d);

  const objectCantLeftModel = createTrapezoidalRightOrLeftElement({
    BW, TW, BH, TH, d, isLeft: true
  });   //斜面右边
  const objectCantRightModel = createTrapezoidalRightOrLeftElement({
    BW, TW, BH, TH, d, isLeft: false
  });   //斜面右边
  const objectCantTopModel = createTrapezoidalTopOrBottomElement({
    BW, TW, BH, TH, d, isTop: true
  }); //斜面前边
  const objectCantBottomModel = createTrapezoidalTopOrBottomElement({
    BW, TW, BH, TH, d, isTop: false
  }); //斜面后面
  objectContainer.add(objectCantLeftModel, objectCantRightModel, objectCantBottomModel, objectCantTopModel)
  if (leftBtnName) {
    const btnLeft = document.createElement("div");
    btnLeft.style.cssText = `
                 color: #6BE0FA;
                 font-size: 16px;
                 font-weight: 500;
                 width: ${TW / 2}px;
                 line-height: 16px;
                 `;
    btnLeft.className = "visibilityAnimate";
    const wordNode = document.createElement("span");
    wordNode.style.cursor = "pointer";
    wordNode.innerText = leftBtnName;
    btnLeft.appendChild(wordNode);
    const btnLeftObject = new CSS3DObject(btnLeft);
    btnLeftObject.position.set(-TW / 4 + 10, -TH / 2, 14);
    btnLeftObject.rotateX(Math.PI / 2);
    objectTopModel.add(btnLeftObject);
    wordNode.onclick = leftOnClick;
  }
  if (rightBtnName) {
    const btnRight = document.createElement("div");
    btnRight.style.cssText = `
                 color: #FFFFFF;
                 font-size: 20px;
                 font-weight: 500;
                 width: ${TW / 2}px;
                 text-shadow: 0px 1px 4px #3366FF;
                 text-align: right;
                 `;
    btnRight.className = "visibilityAnimate";
    const textNode = document.createElement("span");
    textNode.style.cursor = "pointer";
    textNode.innerText = rightBtnName;


    btnRight.appendChild(textNode);
    const btnRightObject = new CSS3DObject(btnRight);
    btnRightObject.position.set(TW / 4 - 10, -TH / 2, 14);
    btnRightObject.rotateX(Math.PI / 2);
    objectTopModel.add(btnRightObject);
    textNode.onclick = rightOnClick
  }
  objectContainer.add(objectTopModel);
  return objectContainer;
}
/**
 *  布局计算
 * @param dataSource
 * @param maxX
 * @param maxY
 * @returns
 */
export const setAppPosition = (dataSource: AppData[], maxX: number, maxY: number) => {
  if (!dataSource?.length) return [];
  let appData: Target[] = dataSource.map(d => ({ ...d, x: 0, y: 0 }));
  if (appData.length === maxX * maxY) {
    appData = appData.map((d, i) => ({
      ...d,
      x: i % maxX + 1,
      y: parseInt(`${i / maxX}`) + 1
    }));
  } else {
    const offset = maxX * (maxY - 1);
    const leng = appData.length - offset;
    for (let d = 0; d < offset; d++) {
      const u = appData[d];
      u.x = d % maxX + 1;
      u.y = parseInt(`${d / maxX}`) + 1
    }
    for (let h = 0; h < leng / 2; h++) {
      const g = appData[h + offset],
        m = appData[appData.length - 1 - h];
      g.x = h + 1;
      g.y = maxY;
      if (g !== m) {
        m.x = maxX - h;
        m.y = maxY
      }
    }
  }
  return appData
}
export const createTableTarget = (data: Target, cardSize: CardSize, maxX: number, maxY: number) => {
  const object3D = new Object3D();
  object3D.position.x = data.x * cardSize.outerWidth - (maxX / 2 + .5) * cardSize.outerWidth
  object3D.position.y = -data.y * cardSize.outerHeight + (maxY / 2 + .5) * cardSize.outerHeight
  return object3D
}
export const createCurveTarget = (data: Target, cardSize: CardSize, maxX: number, maxY: number, angle: number, radius: number) => {
  const object3D = new Object3D();
  const vector = new Vector3();
  const position = computeCurvePosition(data, cardSize, maxX, maxY, angle);
  object3D.position.x = position.x;
  object3D.position.y = position.y;
  object3D.position.z = position.z;
  vector.x = 0;
  vector.y = object3D.position.y;
  vector.z = radius;
  object3D.lookAt(vector)
  return object3D
}
export const computeCurvePosition = (data: Target, cardSize: CardSize, maxX: number, maxY: number, angle: number) => {
  const position: Position = {
    x: 0, y: 0, z: 0
  },
    n = parseInt(`${maxX * cardSize.outerWidth * 180}`) / (angle * Math.PI),
    a = maxX / 2 + .5;
  position.x = n * Math.sin(Math.PI / (180 / ((data.x - a) * (angle / maxX))));
  position.y = -data.y * cardSize
    .outerHeight + (maxY / 2 + .5) * cardSize.outerHeight;
  position.z = n - Math.sqrt(n * n - position.x * position.x);
  return position
}
export const computeCameraDistance = (camera: PerspectiveCamera, bounds: bounds, distanceConfig: DistanceConfig[], length: number) => {
  let n = bounds.height + 2 * bounds.margin,
    a = (bounds.width + 2 * bounds.margin) / camera.aspect,
    i = .5 * Math.max(a, n) / Math.tan(camera.fov * Math.PI / 360) + bounds.z,
    o = 0;
  distanceConfig.forEach(function (t) {
    length >= Math.min.apply(null, t.numRange) && length < Math.max.apply(null, t.numRange) && (o = t
      .distance)
  })
  if (o > 0) return Math.max(o, i);
  const s = 200 * Math.ceil((length - 160) / 40) + 3200;
  return Math.max(s, i)

}
export const getAppRelations = (object: CSS3DObject, relationsData: Relation[]) => {
  const relations: Relation[] = [];
  const userData = object.userData;
  Array.isArray(relationsData) && relationsData.length && relationsData.forEach(function (i) {
    userData.key !== i.source && userData.key !== i.target || relations.push(i)
  });
  return relations
}
export const findElementByEvent = (e: MouseEvent) => {
  const path = (e.composedPath() as Element[]).find(node => node?.shadowRoot);
  if (path?.tagName === 'DATA-VIEW.APP-WALL-CARD-ITEM') return path
  const customEle = document.elementFromPoint(e.clientX, e.clientY)
  const target = customEle?.shadowRoot.elementFromPoint(e.clientX, e.clientY);
  if (target?.tagName === 'DATA-VIEW.APP-WALL-CARD-ITEM') return target
  return null
}
