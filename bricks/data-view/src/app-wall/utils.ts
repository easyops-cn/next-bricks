import { MathUtils, EllipseCurve, LineCurve, Vector2, Vector3, Object3D, Quaternion, Euler } from "three";
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import "./card-item/index.js";
import "./relation-line/index.js";
import "./system-card/index.js";
import type { AppWallCardItem, AppWallCardItemProps } from "./card-item/index.js";
import type { AppWallRelationLine, AppWallRelationLineProps } from "./relation-line/index.js";
import type { SystemCard, SystemCardProps } from "./system-card/index.js";
import { TrapezoidalObjectProps, TrapezoidalProps } from "./interface.js";

export interface AppData {
  key: string;
  status: "normal" | "warning";
  cardItemProps: AppWallCardItemProps,
  systemCardProps: SystemCardProps,
  trapezoidalProps: TrapezoidalProps;
}

export interface Relation {
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
  systemCardObject: CSS3DObject,
  css3DObjects: CSS3DObject[],
}

export const vector3ToXYZ = (vector: Vector3) => {
  return { x: vector.x, y: vector.y, z: vector.z };
}

export const eulerToXYZ = (euler: Euler) => {
  return { x: euler.x, y: euler.y, z: euler.z };
}

export const xyzToVector3 = (xyz: { x: number, y: number, z: number }) => {
  return new Vector3(xyz.x, xyz.y, xyz.z);
}

const getRowsAndColumnsNum = (total: number) => {
  const row = Math.ceil(Math.sqrt(total / 3));
  const column = Math.ceil(total / row);
  return { row, column };
}

export const getCoordinates = (columnNum: number, rowNum: number) => {
  const padding = 10
  const deg = 55;
  const rad = MathUtils.degToRad(deg);
  const xRadius = 2400;
  const yRadius = 1800;
  const ellipseHeight = 1800;
  // const ellipseHeight = 2000;

  const ellipseCurve = new EllipseCurve(
    0, 0,
    xRadius, yRadius,
    -Math.PI / 2 - rad, -Math.PI / 2 + rad,
    false, 0
  );
  const ellipseCurveLength = ellipseCurve.getLength();

  const verticalLineCurve = new LineCurve(new Vector2(0, ellipseHeight / 2), new Vector2(0, -ellipseHeight / 2));
  const horizontalLineCurve = new LineCurve(new Vector2(-ellipseCurveLength / 2, 0), new Vector2(ellipseCurveLength / 2, 0));

  const elementWidth = ellipseCurve.getLength() / columnNum - padding;
  const elementHeight = ellipseHeight / rowNum - padding;
  const columnPoints = ellipseCurve.getSpacedPoints(2 * columnNum);
  const rowPoints = verticalLineCurve.getSpacedPoints(2 * rowNum);
  const flatColumnPoints = horizontalLineCurve.getSpacedPoints(2 * columnNum);

  const leftControlVector3 = new Vector3(ellipseCurve.getPoint(0.3).x, verticalLineCurve.getPoint(0.5).y, -yRadius / 2);
  const leftControlPoint = new Object3D();
  leftControlPoint.position.copy(leftControlVector3);
  leftControlPoint.lookAt(new Vector3().multiplyVectors(leftControlVector3, new Vector3(-1, 1, 1)));

  const rightControlVector3 = new Vector3(ellipseCurve.getPoint(0.7).x, verticalLineCurve.getPoint(0.5).y, -yRadius / 2);
  const rightControlPoint = new Object3D();
  rightControlPoint.position.copy(rightControlVector3);
  rightControlPoint.lookAt(new Vector3().multiplyVectors(rightControlVector3, new Vector3(-1, 1, 1)));

  const coordinates: { object3D: Object3D, flatObject3D: Object3D }[] = [];

  for (let ri = 0; ri < rowNum; ri++) {
    const rowPoint = rowPoints[2 * ri + 1];

    for (let ci = 0; ci < columnNum; ci++) {
      const object3D = new Object3D();
      const columnPoint = columnPoints[2 * ci + 1];
      const position = new Vector3(columnPoint.x, rowPoint.y, columnPoint.y);
      // console.log(ellipseCurve.getTangentAt(0));
      // const lookAt = new Vector3(0, rowPoint.y, ellipseCurve.getTangentAt(0).y);
      const lookAt = new Vector3().multiplyVectors(position, new Vector3(-2, 1, -2));
      object3D.position.copy(position);
      object3D.lookAt(lookAt);

      const flatObject3D = new Object3D();
      const flatColumnPoint = flatColumnPoints[2 * ci + 1];
      const flatPosition = new Vector3(flatColumnPoint.x, rowPoint.y, -xRadius);
      const flatLookAt = new Vector3(flatColumnPoint.x, rowPoint.y, 0);
      // const _rotateAngleX = new Euler( 0, 0, 0, 'XYZ' );

      flatObject3D.position.copy(flatPosition);
      flatObject3D.lookAt(flatLookAt);
      // flatObject3D.position.applyEuler(_rotateAngleX);

      coordinates.push({ object3D, flatObject3D });
    }
  }

  return { elementWidth, elementHeight, coordinates, leftControlPoint, rightControlPoint };
}

const createSystemCard = (props: AppData) => {
  const { key, status, systemCardProps } = props;
  const systemCardElement = document.createElement("data-view.app-wall-system-card") as SystemCard;
  systemCardElement.status = status;
  systemCardElement.cardTitle = systemCardProps.cardTitle;
  systemCardElement.itemList = systemCardProps.itemList;
  systemCardElement.buttonName = systemCardProps.buttonName;
  systemCardElement.handleClick = systemCardProps.handleClick;
  systemCardElement.containerStyle = systemCardProps.containerStyle;

  const object = new CSS3DObject(systemCardElement);
  object.name = `system-card-${key}`;

  return object;
}

export const createCardItems = (dataSource: AppData[]) => {
  const css3DObjects: CSS3DObject[] = [];
  const totalRowNum = 9;
  const totalColumnNum = 24;

  // const coordinates = computeCoordinate(dataSource.length);
  const { elementWidth, elementHeight, coordinates, leftControlPoint, rightControlPoint } = getCoordinates(totalColumnNum, totalRowNum);
  const { row, column } = getRowsAndColumnsNum(dataSource.length);

  const columnStart = Math.floor((totalColumnNum - column) / 2);
  const rowStart = Math.floor((totalRowNum - row) / 2);

  const startIndex = rowStart * totalColumnNum + columnStart;

  dataSource.map((item, index) => {
    const _index = startIndex + index % column + totalColumnNum * Math.floor(index / column);

    const element = document.createElement(
      "data-view.app-wall-card-item"
    ) as AppWallCardItem;
    element.status = item.status;
    element.cardTitle = item.cardItemProps?.cardTitle;
    element.description = item.cardItemProps?.description;
    element.style.width = elementWidth + "px";
    element.style.height = elementHeight + "px";
    element.classList.add("card-item");

    const systemCardObject = createSystemCard(item);
    const css3DObject = new CSS3DObject(element);
    css3DObject.name = `card-item-${item.key}`;
    css3DObject.position.set(MathUtils.randFloatSpread(4000), MathUtils.randFloatSpread(4000), 0);

    if (!coordinates[_index]) return;
    const { object3D, flatObject3D } = coordinates[_index];

    const turnObject3D = object3D.position.x < 0 ? rightControlPoint : leftControlPoint

    const userData: UserData = {
      css3DObjects,
      appData: item,
      elementStyle: {
        width: elementWidth,
        height: elementHeight,
      },
      turningStyle: { width: elementWidth * 1.2, height: elementHeight * 1.2 },
      /* Todo: 百丽1.5? */
      hoverStyle: { width: elementWidth * 1.2, height: elementHeight * 1.2 },
      systemCardStyle: { width: 280, height: 382 },
      cardItemObject3D: {
        curve: object3D,
        flat: flatObject3D,
        hover: object3D.clone().translateZ(40),
        clickTurn: turnObject3D.clone(),
      },
      systemCardObject3D: {
        clickTurn: turnObject3D.clone().rotateY(Math.PI),
        front: (() => {
          const ob = new Object3D();
          ob.position.set(0, 0, 600);
          ob.rotation.set(0, 0, 0);
          return ob;
        })(),
      },
      systemCardObject,
    }

    css3DObject.userData = userData;
    (element as any)._css3DObject = css3DObject
    css3DObjects.push(css3DObject);
  })

  return {
    css3DObjects,
  };
};

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

export const getCenterPointOrSubPoint = (start: [number, number, number], end: [number, number, number]) => {
  const pointA = new Vector3(start[0], start[1], start[2]);
  const pointB = new Vector3(end[0], end[1], end[2]);
  return {
    centerVector: new Vector3().lerpVectors(pointA, pointB, 0.5), //中心点坐标
    subVector: new Vector3().subVectors(pointA, pointB) // a-b向量
  }
}
export const createTrapezoidalObject = (props: TrapezoidalObjectProps) => {
  const { objectData, leftBtnName, leftOnClick, rightBtnName, rightOnClick } = props;
  const d = 230;
  const container = document.createElement('div');
  const objectContainer = new CSS3DObject(container);
  objectContainer.position.set(...objectData.point);
  // 模型为梯形 , 底部和顶部的宽高成一定的比例计算，  bw: tw = 1:11; bh:th= 1:4.5
  const BW = objectData.width, BH = objectData.height, TW = BW * 8, TH = BH * 3;
  // 底部
  const bottomCard = document.createElement('div');
  bottomCard.style.cssText = `
                   width: ${BW}px;
                   height: ${BH}px;
                   box-shadow: inset 0px 1px 2px 0px rgba(255,255,255,0.45);
                   border: 1px solid rgba(118,255,255,0.58);
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
                   padding: 2% 10%;
                   `;
  const topoCard = document.createElement("div");
  topoCard.style.cssText = `
                background: linear-gradient(180deg, #6598FF 0%, #063EE8 100%);
                opacity: 0.5;
                width: 100%;
                height: 100%;
            `;
  topoCard.innerText = "应用部署架构";
  topCard.appendChild(topoCard);
  const objectTopModel = new CSS3DObject(topCard);
  objectTopModel.position.set(0, 0, d);
  // objectContainer.add(objectTopModel);
  const cantModelContainer = document.createElement('div'); //斜边模型外层
  const objectCantModel = new CSS3DObject(cantModelContainer);

  //斜面左边
  const height = Math.sqrt(Math.pow((TW / 2 - BW / 2), 2) + Math.pow(d, 2)); //斜边
  const cantLeftOrRightCardCss = `
                   width: ${height}px;
                   height:${TH}px;
                   background: linear-gradient(180deg, rgba(51,102,255,0.4) 0%, #99CCFF 100%);
                   clip-path: polygon(0 0, ${height}px ${(TH / 2 - BH / 2)}px, ${height}px ${(TH / 2 - BH / 2) + BH}px, 0 ${TH}px);
                   opacity: 0.2;
                   `;
  const cantLeftCard = document.createElement("div");
  cantLeftCard.style.cssText = cantLeftOrRightCardCss;
  const objectCantLeftModel = new CSS3DObject(cantLeftCard);
  const { centerVector, subVector } = getCenterPointOrSubPoint([-BW / 2, 0, 0], [-TW / 2, 0, d]);
  objectCantLeftModel.position.copy(centerVector);
  const quaternion = new Quaternion().setFromUnitVectors(new Vector3(1, 0, 0).normalize(), subVector.clone().normalize());
  objectCantLeftModel.setRotationFromQuaternion(quaternion);
  objectCantModel.add(objectCantLeftModel);
  //斜面右边
  const cantRightCard = document.createElement("div");
  cantRightCard.style.cssText = cantLeftOrRightCardCss;
  const objectCantRightModel = new CSS3DObject(cantRightCard);
  const {
    centerVector: _centerVector,
    subVector: _subVector
  } = getCenterPointOrSubPoint([BW / 2, 0, 0], [TW / 2, 0, d]);
  objectCantRightModel.position.copy(_centerVector)
  const _quaternion = new Quaternion().setFromUnitVectors(new Vector3(1, 0, 0).normalize(), _subVector.clone().normalize());
  objectCantRightModel.setRotationFromQuaternion(_quaternion);
  objectCantModel.add(objectCantRightModel);
  //斜面前面
  const h1 = Math.sqrt(Math.pow((TH / 2 - BH / 2), 2) + Math.pow(d, 2)); //斜边
  const cantTopOrBottomCardCss = `
                   width: ${TW}px;
                   height:${h1}px;
                   background: linear-gradient(180deg, rgba(51,102,255,0.4) 0%, #99CCFF 100%);
                   clip-path: polygon(0 0, ${TW}px 0, ${(TW / 2 - BW / 2) + BW}px ${h1}px, ${TW / 2 - BW / 2}px ${h1}px);
                   opacity: 0.2;
                   `;
  const cantTopCard = document.createElement("div");
  cantTopCard.style.cssText = cantTopOrBottomCardCss;
  const objectCantTopModel = new CSS3DObject(cantTopCard);
  const {
    centerVector: _topCenterVector,
    subVector: _topSubVector
  } = getCenterPointOrSubPoint([0, -BH / 2, 0], [0, -TH / 2, d]);
  objectCantTopModel.position.copy(_topCenterVector)
  const _topQuaternion = new Quaternion().setFromUnitVectors(new Vector3(0, -1, 0).normalize(), _topSubVector.clone().normalize());
  objectCantTopModel.setRotationFromQuaternion(_topQuaternion);
  objectCantModel.add(objectCantTopModel);

  //斜面后面
  const cantBottomCard = document.createElement("div");
  cantBottomCard.style.cssText = cantTopOrBottomCardCss;
  const objectCantBottomModel = new CSS3DObject(cantBottomCard);
  const {
    centerVector: _bottomCenterVector,
    subVector: _bottomSubVector
  } = getCenterPointOrSubPoint([0, BH / 2, 0], [0, TH / 2, d]);
  objectCantBottomModel.position.copy(_bottomCenterVector)
  const _bottomQuaternion = new Quaternion().setFromUnitVectors(new Vector3(0, -1, 0).normalize(), _bottomSubVector.clone().normalize());
  objectCantBottomModel.setRotationFromQuaternion(_bottomQuaternion);
  objectCantModel.add(objectCantBottomModel);
  // 文字按钮
  if (leftBtnName) {
    const btnLeft = document.createElement("div");
    btnLeft.style.cssText = `
                 color: #6BE0FA;
                 font-size: 16px;
                 font-weight: 500;
                 width: ${TW / 2}px;
                 line-height: 16px;
                 `;
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
  return {
    objectContainer,
    objectTopModel,
    objectCantModel
  };
}
