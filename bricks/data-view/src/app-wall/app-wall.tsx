import React, { useCallback, useEffect, useRef } from "react";
import { Vector3, Object3D, PerspectiveCamera, Scene, MathUtils, Quaternion } from "three";
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { Tween, Easing, Group } from "@tweenjs/tween.js";


import { createHelper } from "./helpers.js";
import { computeCoordinate } from "./util.js";
import { dataSource, relations } from "./mockData.js";

import "./card-item/index.js";
import "./relation-line/index.js";
import "./system-card/index.js";
import { AppWallCardItem } from "./card-item/index.js";
import { SystemCard } from "./system-card/index.js";
import { AppWallRelationLine, AppWallRelationLineProps } from "./relation-line/index.js";

const lineCiCodes = new Set<string>(); // 生成线的标识集合


export function AppWallElement(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>();
  const maskRef = useRef<HTMLDivElement>();

  const rendererRef = useRef<CSS3DRenderer>();
  const sceneRef = useRef<Scene>();
  const cameraRef = useRef<PerspectiveCamera>();
  const controlsRef = useRef<TrackballControls>();
  const tweenGroupRef = useRef<Group>(new Group());

  const render = useCallback(() => {
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  }, []);

  const init = useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const fov = 45 // TODO
    const aspect = width / height;

    const originZ = 1800;

    // renderer
    const renderer = new CSS3DRenderer();
    renderer.setSize(width, height);

    // scene
    const scene = new Scene();

    // camera
    const camera = new PerspectiveCamera(fov, aspect, 0.1, 20000);
    camera.position.z = originZ + 500;
    // camera.lookAt(scene.position);

    // controls
    // controls = new TrackballControls(camera, renderer.domElement);
    const controls = new TrackballControls(camera, containerRef.current);
    controls.zoomSpeed = 10;
    controls.rotateSpeed = 10;
    controls.staticMoving = true;
    controls.minDistance = 500; // 摄像机向内最多能移动多少
    controls.maxDistance = 6000;  // 摄像机向外最多能移动多少;
    // controls.target.set(0, 0, -originZ);

    // containerRef.current.innerHTML = null;
    containerRef.current.appendChild(renderer.domElement);

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    controlsRef.current = controls;
  }, []);

  const getLayout = useCallback(() => {
    const css3DObjects: CSS3DObject[] = [];

    const coordinates = computeCoordinate(dataSource.length);

    dataSource.map((item, index) => {
      // .card-item-container.large1231312 {
      //   /* Todo: 百丽1.5? */
      //   width: 120%;
      //   height: 120%;
      // }
      const element = document.createElement(
        "data-view.app-wall-card-item"
      ) as AppWallCardItem;
      element.status = item.isError ? "warning" : "normal";
      element.cardTitle = item.key;
      element.description = item.name;
      element.style.width = "120px";
      element.style.height = "160px";
      element.classList.add("card-item");

      const css3DObject = new CSS3DObject(element);
      css3DObject.position.set(MathUtils.randFloatSpread(4000), MathUtils.randFloatSpread(4000), 0);

      const object3D = new Object3D();
      let position;
      if (coordinates[index]) {
        position = coordinates[index].position;
        const { lookAt } = coordinates[index];
        object3D.position.set(position.x, position.y, position.z);
        // 元素朝向
        const vector = new Vector3(lookAt.x, lookAt.y, lookAt.z);
        object3D.lookAt(vector);
      }

      css3DObject.userData = {
        // rotation: { x: object3D.rotation.x, y: object3D.rotation.y, z: object3D.rotation.z },
        // position,
        object3D,
        ...item
      };

      css3DObjects.push(css3DObject);
    })

    return css3DObjects;
  }, []);





  const createLine = useCallback((sourceVector: Vector3, targetVector: Vector3, lightColor: AppWallRelationLineProps["lightColor"]): CSS3DObject => {
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
  }, []);

  const onElementMouseEnter = useCallback((curCss3DObject: CSS3DObject, css3DObjects: CSS3DObject[]) => {
    const { userData } = curCss3DObject;
    const { ciCode, object3D } = userData;
    // const newPosition = { x: userData.position.x, y: userData.position.y, z: userData.position.z + 40 };
    const newPosition = { x: object3D.position.x, y: object3D.position.y, z: object3D.position.z + 40 };
    const newRotation = { x: object3D.rotation.x, y: object3D.rotation.y, z: object3D.rotation.z };

    // // Todo: map first
    const filteredRelations = relations.reduce((pre, cur) => {
      if (cur.sourceCiCode === ciCode) {
        pre.out.add(cur.targetCiCode);
      } else if (cur.targetCiCode === ciCode) {
        pre.in.add(cur.sourceCiCode);
      }
      return pre;
    }, { in: new Set<string>(), out: new Set<string>() });

    css3DObjects.map(v => {
      if (v === curCss3DObject) {
        new Tween(curCss3DObject.position, tweenGroupRef.current)
          .to(newPosition, 200)
          .easing(Easing.Linear.None)
          .start();
        new Tween(curCss3DObject.rotation, tweenGroupRef.current)
          .to(newRotation, 200)
          .easing(Easing.Linear.None)
          .start();
        new Tween({}, tweenGroupRef.current)
          .to({}, 200)
          .onUpdate(render)
          .start();
        v.element.classList.add("large");
      } else {
        const curVector = new Vector3(newPosition.x, newPosition.y, newPosition.z);
        const relatedObject3D = v.userData.object3D;
        const relatedCiCode = v.userData.ciCode;
        const relatedVector = new Vector3(relatedObject3D.position.x, relatedObject3D.position.y, relatedObject3D.position.z);

        if (filteredRelations.in.has(relatedCiCode)) {
          const lineId = `${ciCode}-${relatedCiCode}`;
          const line = createLine(curVector, relatedVector, "purple");
          line.name = lineId;
          lineCiCodes.add(lineId);
          sceneRef.current.add(line);
        } else if (filteredRelations.out.has(relatedCiCode)) {
          const lineId = `${relatedCiCode}-${ciCode}`;
          const line = createLine(relatedVector, curVector, "blue");
          line.name = lineId;
          lineCiCodes.add(lineId);
          sceneRef.current.add(line);
        } else {
          v.element.classList.add("dark");
        }
      }
    });
  }, []);


  const onElementMouseLeave = useCallback((curCss3DObject: CSS3DObject, css3DObjects: CSS3DObject[]) => {
    const { userData } = curCss3DObject;
    const { object3D } = userData;
    const newPosition = { x: object3D.position.x, y: object3D.position.y, z: object3D.position.z };
    const newRotation = { x: object3D.rotation.x, y: object3D.rotation.y, z: object3D.rotation.z };

    css3DObjects.map(v => {
      v.element.classList.remove("dark", "large");

      if (v === curCss3DObject) {
        new Tween(curCss3DObject.position, tweenGroupRef.current)
          .to(newPosition, 200)
          .easing(Easing.Exponential.InOut)
          .start();
        new Tween(curCss3DObject.rotation, tweenGroupRef.current)
          .to(newRotation, 200)
          .easing(Easing.Exponential.InOut)
          .start();
        new Tween({}, tweenGroupRef.current)
          .to({}, 200)
          .onUpdate(render)
          .start();
      }
    });

    lineCiCodes.forEach((item) => {
      const currentLine = sceneRef.current.getObjectByName(item);
      sceneRef.current.remove(currentLine);
    });
    lineCiCodes.clear();
  }, []);



  const onMaskClick = useCallback((curCss3DObject: CSS3DObject, css3DObjects: CSS3DObject[], systemCardObject: CSS3DObject) => {
    // maskRef.current.style.display = "none";
    // detailRef.current.style.display = "none";
    const { userData, rotation, position } = curCss3DObject;
    console.log(123);
    const turningPosition = { ...curCss3DObject.position };
    const turningRotation = { ...curCss3DObject.rotation };
    // const turningRotation = { x: 0, y: Math.PI / 2, z: 0 };



    new Tween({ width: systemCardObject.element.clientWidth, height: systemCardObject.element.clientHeight }, tweenGroupRef.current)
      .to({ width: 120, height: 160 }, 500)
      // .to({ width: curCss3DObject.element.clientWidth, height: curCss3DObject.element.clientHeight }, 500)
      .onUpdate((e) => {
        systemCardObject.element.containerStyle = { ...e };
      })
      .easing(Easing.Linear.None)
      .start();
    new Tween(systemCardObject.position, tweenGroupRef.current)
      .to(turningPosition, 500)
      .easing(Easing.Linear.None)
      .start()
      .chain(
        new Tween(curCss3DObject.position, tweenGroupRef.current)
          .to(curCss3DObject.userData.object3D.position, 500)
          .easing(Easing.Linear.None)
      )
      .onComplete(() => {
        curCss3DObject.visible = true;
        systemCardObject.visible = false;
      })
    new Tween(systemCardObject.rotation, tweenGroupRef.current)
      .to({ x: turningRotation.x, y: turningRotation.y, z: turningRotation.z }, 500)
      .easing(Easing.Linear.None)
      .start()
      .chain(
        new Tween(curCss3DObject.rotation, tweenGroupRef.current)
          .to(curCss3DObject.userData.object3D.rotation, 500)
          .easing(Easing.Linear.None)
          .onComplete(() => {
            // curCss3DObject.visible = false;
            // detailRef.current.style.display = "block";
            // setDetailInfos(userData);
          })
      )







    new Tween({}, tweenGroupRef.current)
      .to({}, 1000)
      .onUpdate(render)
      .start()

    // const newPosition = { x: [60, -position.x / 2, v.position.x], y: v.position.y, z: v.position.z }
    // new Tween(position)
    //   .to({ ...newPosition }, 1000)
    //   .easing(Easing.Linear.None)
    //   .start()
    // new Tween(rotation)
    //   .to({ x: v.rotation.x, y: [-(180 * Math.PI / 180), -(90 * Math.PI / 180), v.rotation.y], z: v.rotation.z }, 1000)
    //   .easing(Easing.Linear.None)
    //   .start()
    // new Tween({})
    //   .to({}, 1000)
    //   .onUpdate(render)
    //   .start()
  }, []);


  const onElementMouseClick = useCallback((curCss3DObject: CSS3DObject, css3DObjects: CSS3DObject[]) => {
    // controls.reset();
    // TWEEN.removeAll();
    const { userData } = curCss3DObject;
    // setCurrentObejct(object);
    // maskRef.current.style.display = "block";
    // const vector = new Vector3(position.x, position.y, position.z);
    // curCss3DObject.lookAt(vector);

    const turningPosition = { x: -curCss3DObject.position.x / 2, y: 400, z: 0 };
    const turningRotation = { x: 0, y: Math.PI / 2, z: 0 };

    const systemCardElement = document.createElement("data-view.app-wall-system-card") as SystemCard;
    systemCardElement.cardTitle = "A系统";
    systemCardElement.itemList = [
      {
        "key": "实例ID",
        "value": "5d570a851bef6"
      },
      {
        "key": "系统英文缩写",
        "value": "system-fms"
      },
      {
        "key": "实例ID",
        "value": "5d570a851bef6"
      },
      {
        "key": "系统英文名称",
        "value": "app-fms"
      },
      {
        "key": "系统中文名称",
        "value": "A财务系统"
      },
      {
        "key": "归属部门",
        "value": "财务系统部"
      },
      {
        "key": "系统类型",
        "value": "应用系统"
      },
      {
        "key": "系统描述",
        "value": "1、使用场景概述：财务应收和应付结算"
      }
    ];
    systemCardElement.buttonName = "应用墙大屏";
    const systemCardObject = new CSS3DObject(systemCardElement);
    systemCardObject.position.set(turningPosition.x, turningPosition.y, turningPosition.z);
    systemCardObject.rotation.set(turningRotation.x, turningRotation.y, turningRotation.z);
    systemCardElement.containerStyle = { width: curCss3DObject.element.clientWidth, height: curCss3DObject.element.clientHeight };
    systemCardObject.visible = false;

    sceneRef.current.add(systemCardObject);

    new Tween(curCss3DObject.position, tweenGroupRef.current)
      .to(turningPosition, 500)
      .easing(Easing.Linear.None)
      .start()
      .chain(
        new Tween(systemCardObject.position, tweenGroupRef.current)
          .to({ x: 0, y: 0, z: 0 }, 500)
          .easing(Easing.Linear.None),
        new Tween({ width: curCss3DObject.element.clientWidth, height: curCss3DObject.element.clientHeight }, tweenGroupRef.current)
          .to({ width: 260, height: 354 }, 500)
          .onUpdate((e) => {
            systemCardElement.containerStyle = { ...e };
          })
          .easing(Easing.Linear.None)
      )
      .onComplete(() => {
        curCss3DObject.visible = false;
        systemCardObject.visible = true;
      })
    new Tween(curCss3DObject.rotation, tweenGroupRef.current)
      .to({ x: turningRotation.x, y: turningRotation.y, z: turningRotation.z }, 500)
      .easing(Easing.Linear.None)
      .start()
      .chain(
        new Tween(systemCardObject.rotation, tweenGroupRef.current)
          .to(object3D.position.x < 0 ? { x: 0, y: - Math.PI, z: 0 } : { x: 0, y: Math.PI, z: 0 }, 500)
          .easing(Easing.Linear.None)
      )

    new Tween({}, tweenGroupRef.current)
      .to({}, 1000)
      .onUpdate(render)
      .start();


    systemCardElement.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      onMaskClick(curCss3DObject, css3DObjects, systemCardObject)
    }, false);

  }, []);




  const entranceAnimation = useCallback((css3DObjects: CSS3DObject[]) => {
    const duration = 2000;

    css3DObjects.map(object => {
      const { object3D } = object.userData as UserData;

      new Tween(object.position, tweenGroupRef.current)
        .to({ x: object3D.position.x, y: object3D.position.y, z: object3D.position.z }, MathUtils.randFloat(duration, duration * 2))
        .easing(Easing.Exponential.InOut)
        .start();

      new Tween(object.rotation, tweenGroupRef.current)
        .to({ x: object3D.rotation.x, y: object3D.rotation.y, z: object3D.rotation.z }, MathUtils.randFloat(duration, duration * 2))
        .easing(Easing.Exponential.InOut)
        .start();
    });

    new Tween({}, tweenGroupRef.current)
      .to({}, duration * 2)
      .onUpdate(render)
      .start()
      .onComplete(() => {
        css3DObjects.map((object) => {
          const element = object.element;

          // 鼠标移入
          element.addEventListener('mouseenter', (e) => {
            onElementMouseEnter(object, css3DObjects);
          }, false);
          // 鼠标移出
          element.addEventListener('mouseleave', (e) => {
            onElementMouseLeave(object, css3DObjects);
          }, false)
          // 鼠标点击
          // element.addEventListener('pointerdown', (e) => {
          //   e.preventDefault();
          //   onElementMouseClick(object, css3DObjects);
          // }, false);
          // 鼠标双击
          element.addEventListener('dblclick', (e) => {
            onElementDblclick(object, css3DObjects);
          }, false)
        })
      });
  }, [])

  useEffect(() => {
    init();
    const tweenGroup = tweenGroupRef.current;

    let cancel: number;

    const css3DObjects = getLayout();
    sceneRef.current.add(...createHelper(), ...css3DObjects);
    entranceAnimation(css3DObjects);

    const animate = () => {
      cancel = requestAnimationFrame(animate);
      tweenGroup.update();
      controlsRef.current.update();
    }

    render();
    animate();
    controlsRef.current.addEventListener('change', render);

    return () => {
      controlsRef.current.removeEventListener('change', render);
      tweenGroup.removeAll();
      cancelAnimationFrame(cancel);
    }
  }, [])

  return (<>
    <div className="container" ref={containerRef} >
      <div className="mask" ref={maskRef} onClick={handleMaskClick} />
    </div>
    <div style={systemCardStyle}></div>
  </>
  );
}
