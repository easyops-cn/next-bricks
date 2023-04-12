import { MathUtils, EllipseCurve, LineCurve, Vector2, Vector3, Object3D, Quaternion } from "three";
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';
import "./card-item/index.js";
import "./relation-line/index.js";
import "./system-card/index.js";
import type { AppWallCardItem, AppWallCardItemProps } from "./card-item/index.js";
import type { AppWallRelationLine, AppWallRelationLineProps } from "./relation-line/index.js";
import type { SystemCard, SystemCardProps } from "./system-card/index.js";

export interface AppData {
  key: string;
  status: "normal" | "warning";
  cardItemProps: AppWallCardItemProps,
  systemCardProps: SystemCardProps,
}

export interface Relation {
  source: string;
  target: string;
}

export interface UserData {
  object3D: Object3D,
  flatObject3D: Object3D,
  appData: AppData,
}

export const getCoordinates = (columnNum: number, rowNum: number) => {
  const padding = 10
  const deg = 55;
  const rad = MathUtils.degToRad(deg);
  const xRadius = 1800;
  const yRadius = 1800;
  const ellipseHeight = 2400;

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
      const lookAt = new Vector3().multiplyVectors(position, new Vector3(-2, 1, -2));
      object3D.position.copy(position);
      object3D.lookAt(lookAt);

      const flatObject3D = new Object3D();
      const flatColumnPoint = flatColumnPoints[2 * ci + 1];
      const flatPosition = new Vector3(flatColumnPoint.x, rowPoint.y, -xRadius);
      const flatLookAt = new Vector3(flatColumnPoint.x, rowPoint.y, 0);
      flatObject3D.position.copy(flatPosition);
      flatObject3D.lookAt(flatLookAt);

      coordinates.push({ object3D, flatObject3D });
    }
  }

  return { elementWidth, elementHeight, coordinates, leftControlPoint, rightControlPoint };
}

export const createCardItems = (dataSource: AppData[]) => {
  const css3DObjects: CSS3DObject[] = [];

  // const coordinates = computeCoordinate(dataSource.length);
  const { elementWidth, elementHeight, coordinates, leftControlPoint, rightControlPoint } = getCoordinates(17, 7);

  dataSource.map((item, index) => {
    // .card-item-container.large1231312 {
    //   /* Todo: 百丽1.5? */
    //   width: 120%;
    //   height: 120%;
    // }
    const element = document.createElement(
      "data-view.app-wall-card-item"
    ) as AppWallCardItem;
    element.status = item.status;
    element.cardTitle = item.cardItemProps?.cardTitle;
    element.description = item.cardItemProps?.description;
    element.style.width = elementWidth + "px";
    element.style.height = elementHeight + "px";
    element.classList.add("card-item");

    const css3DObject = new CSS3DObject(element);
    css3DObject.name = `card-item-${item.key}`;
    css3DObject.position.set(MathUtils.randFloatSpread(4000), MathUtils.randFloatSpread(4000), 0);

    const { object3D, flatObject3D } = coordinates[index];

    css3DObject.userData = {
      object3D,
      flatObject3D,
      appData: item,
    };

    css3DObjects.push(css3DObject);
  })

  return {
    css3DObjects,
    elementSize: { height: elementHeight, width: elementWidth },
    controlPoints: {
      leftControlPoint,
      rightControlPoint
    }
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

export const systemCardStyle = { width: 700, height: 1200 };

export const createSystemCard = (props: AppData) => {
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
