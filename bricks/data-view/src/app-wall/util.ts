// 元素宽度
const itemWidth = 128;
// 元素高度
const itemHeight = 168;
// 列数
const colNum = 17;
// 行数
// const rowNum = Math.max(Math.ceil(dataSource.length / colNum), colNum);
const width = window.innerWidth;
const height = window.innerHeight;
const aspect = width / height;
const nearPlane = 1;
const farPlane = 1000;
// 角度转弧度系数，弧度 = 角度 * 系数
const degToRadianConstant = 0.016453293;
const pageDeg = 80
// 单个元素的弧度
const radian = (pageDeg / colNum) * degToRadianConstant;
// 半径
const radius = itemWidth / 2 / Math.tan(radian / 2);
// 计算相机视野角度
const cameraToPlaneDistance = radius * Math.cos((pageDeg * degToRadianConstant - radian) / 2);
const fov = Math.atan(height / 2 / cameraToPlaneDistance) * 2 * (180 / Math.PI);

// 曲面：坐标类型
interface CurvedSurfaceCoordinateType {
  position: { x: number; y: number; z: number }
  lookAt: { x: number; y: number; z: number }
  deg: number
}

// 计算曲面坐标
export const computeCoordinate = (length: number): CurvedSurfaceCoordinateType[] => {
  const rowNum = Math.max(Math.ceil(length / colNum), colNum);

  const coordinates = [];
  // 半径(取负数)
  const newRadius = -radius;
  // 起始角度
  const startDeg = pageDeg * 0.5 * degToRadianConstant - radian / 2;
  // 起始坐标y = 容器高度 / 2 - 剩余高度 / 2 - 单个元素高度 / 2
  const positionY = height - (height % itemHeight) - itemHeight;
  for (let i = 0; i < rowNum; i++) {
    const y = positionY - i * itemHeight;
    for (let j = 0; j < colNum; j++) {
      const deg = startDeg - (j % colNum) * radian;
      const x = newRadius * Math.sin(deg);
      const z = newRadius * Math.cos(deg);
      coordinates.push({
        position: { x, y, z },
        lookAt: { x: -2 * x, y, z: -2 * z },
        deg
      })
    }
  }
  console.log(coordinates);
  return coordinates;
}
