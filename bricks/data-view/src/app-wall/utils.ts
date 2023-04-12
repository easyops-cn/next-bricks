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
  appData: AppData,
}

export const getCoordinates = (columnNum: number, rowNum: number) => {
  const padding = 10
  const deg = 40;
  const rad = MathUtils.degToRad(deg);
  const xRadius = 1800;
  const yRadius = 1800;
  const ellipseHeight = 1200;

  const ellipseCurve = new EllipseCurve(
    0, 0,
    xRadius, yRadius,
    -Math.PI / 2 - rad, -Math.PI / 2 + rad,
    false, 0
  );
  const lineCurve = new LineCurve(new Vector2(0, ellipseHeight / 2), new Vector2(0, -ellipseHeight / 2));

  const elementWidth = ellipseCurve.getLength() / columnNum - padding;
  const elementHeight = ellipseHeight / rowNum - padding;
  const columnPoints = ellipseCurve.getSpacedPoints(2 * columnNum);
  const rowPoints = lineCurve.getSpacedPoints(2 * rowNum);

  const coordinates: { position: Vector3, lookAt: Vector3 }[] = [];

  for (let ri = 0; ri < rowNum; ri++) {
    const rowPoint = rowPoints[2 * ri + 1];

    for (let ci = 0; ci < columnNum; ci++) {
      const columnPoint = columnPoints[2 * ci + 1];
      const position = new Vector3(columnPoint.x, rowPoint.y, columnPoint.y);
      const lookAt = new Vector3().multiplyVectors(position, new Vector3(-2, 1, -2));

      coordinates.push({ position, lookAt });
    }
  }

  return { elementWidth, elementHeight, coordinates };
}

export const createCardItems = (dataSource: AppData[]) => {
  const css3DObjects: CSS3DObject[] = [];

  // const coordinates = computeCoordinate(dataSource.length);
  const { elementWidth, elementHeight, coordinates } = getCoordinates(17, 4);

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

    const object3D = new Object3D();
    const { position, lookAt } = coordinates[index];
    object3D.position.copy(position);
    object3D.lookAt(lookAt);

    css3DObject.userData = {
      object3D,
      appData: item,
    };

    css3DObjects.push(css3DObject);
  })

  return { css3DObjects, elementHeight, elementWidth };
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

  const quaternion = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0).normalize(), subVector.clone().normalize());
  lineObject.setRotationFromQuaternion(quaternion);

  return lineObject;
};

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
