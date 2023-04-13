import React, { useCallback, useEffect, useRef, useState } from "react";
import { wrapBrick } from "@next-core/react-element";
import { Vector3, PerspectiveCamera, Scene, MathUtils, CameraHelper, Object3D } from "three";
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { Tween, Easing, Group } from "@tweenjs/tween.js";

import { createHelper } from "./helpers.js";
import { createCardItems, createRelationLine, type AppData, type UserData, createSystemCard, systemCardStyle } from "./utils.js";
import type { AppWallProps } from "./index.jsx";
import type { SystemCard, SystemCardProps } from "./system-card/index.js";

// get set
const lineCiCodes = new Set<string>(); // 生成线的标识集合

const WrappedSystemCard = wrapBrick<SystemCard, SystemCardProps>(
  "data-view.app-wall-system-card"
);

export function AppWallElement(props: AppWallProps): React.ReactElement {
  const { relations, dataSource } = props;

  const containerRef = useRef<HTMLDivElement>();
  const maskRef = useRef<HTMLDivElement>();

  const rendererRef = useRef<CSS3DRenderer>();
  const sceneRef = useRef<Scene>();
  const cameraRef = useRef<PerspectiveCamera>();
  const cameraHelperRef = useRef<CameraHelper>();
  const controlsRef = useRef<TrackballControls>();
  const tweenGroupRef = useRef<Group>(new Group());

  const [curClickCardItemObject, setCurClickCardItemObject] = useState<CSS3DObject>(null);

  const render = useCallback(() => {
    cameraHelperRef.current.update();
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
    // camera.position.y = 100;
    // camera.lookAt(scene.position);
    // camera.lookAt(new Vector3(0, -100, 0));



    const cameraHelper = new CameraHelper(camera);
    scene.add(cameraHelper);
    cameraHelperRef.current = cameraHelper;

    // controls
    // const controls = new TrackballControls(camera, renderer.domElement);
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

  const onElementMouseEnter = useCallback((curCss3DObject: CSS3DObject, css3DObjects: CSS3DObject[]) => {
    const { appData, object3D } = curCss3DObject.userData as UserData;

    const newPosition = { x: object3D.position.x, y: object3D.position.y, z: object3D.position.z + 40 };
    const newVector = new Vector3(newPosition.x, newPosition.y, newPosition.z);
    const newRotation = { x: object3D.rotation.x, y: object3D.rotation.y, z: object3D.rotation.z };

    // // Todo: map first
    const filteredRelations = relations.reduce((pre, cur) => {
      if (cur.source === appData.key) {
        pre.out.add(cur.target);
      } else if (cur.target === appData.key) {
        pre.in.add(cur.source);
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
        const { appData: relatedAppData, object3D: relatedObject3D } = v.userData as UserData;
        const relatedVector = new Vector3(relatedObject3D.position.x, relatedObject3D.position.y, relatedObject3D.position.z);

        if (filteredRelations.in.has(relatedAppData.key)) {
          const lineId = `${appData.key}-${relatedAppData.key}`;
          const line = createRelationLine(newVector, relatedVector, "purple");
          line.name = lineId;
          lineCiCodes.add(lineId);
          sceneRef.current.add(line);
        } else if (filteredRelations.out.has(relatedAppData.key)) {
          const lineId = `${relatedAppData.key}-${appData.key}`;
          const line = createRelationLine(relatedVector, newVector, "blue");
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
    const { appData, object3D } = curCss3DObject.userData as UserData;

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
      lineCiCodes.delete(item);
    });
  }, []);

  const onMaskClick = useCallback((curCss3DObject: CSS3DObject, css3DObjects: CSS3DObject[], systemCardObject: CSS3DObject) => {
    // maskRef.current.style.display = "none";
    // detailRef.current.style.display = "none";

    const { appData, object3D, elementStyle, controlPoint } = curCss3DObject.userData as UserData;
    const systemCardElement = systemCardObject.element as SystemCard;

    const _controlPoint = controlPoint.clone();
    const turningPosition = _controlPoint.position;
    const turningRotation = _controlPoint.rotation;
    const turningStyle = { width: elementStyle.width * 1.2, height: elementStyle.height * 1.2 };

    new Tween({ ...systemCardStyle }, tweenGroupRef.current)
      .to(turningStyle, 500)
      .onUpdate((e) => {
        systemCardElement.containerStyle = { ...e };
      })
      .easing(Easing.Linear.None)
      .chain(
        new Tween({ ...turningStyle }, tweenGroupRef.current)
          .to(elementStyle, 500)
          .onUpdate((e) => {
            curCss3DObject.element.style.width = e.width + 'px';
            curCss3DObject.element.style.height = e.height + 'px';
          })
          .easing(Easing.Linear.None)
      )
      .start();
    new Tween(systemCardObject.position, tweenGroupRef.current)
      .to(turningPosition, 500)
      .easing(Easing.Linear.None)
      .start()
      .chain(
        new Tween(curCss3DObject.position, tweenGroupRef.current)
          .to({ x: object3D.position.x, y: object3D.position.y, z: object3D.position.z }, 500)
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
          .to({ x: object3D.rotation.x, y: object3D.rotation.y, z: object3D.rotation.z }, 500)
          .easing(Easing.Linear.None)
      )

    new Tween({}, tweenGroupRef.current)
      .to({}, 1000)
      .onUpdate(render)
      .start()
      .onComplete(() => {
      })

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

  const onElementDblclick = useCallback((curCss3DObject: CSS3DObject, css3DObjects: CSS3DObject[]) => {
    css3DObjects.map(object => {
      const { flatObject3D } = object.userData as UserData;

      new Tween(object.position, tweenGroupRef.current)
        .to({ x: flatObject3D.position.x, y: flatObject3D.position.y, z: flatObject3D.position.z }, 1000)
        .easing(Easing.Exponential.InOut)
        .start();

      new Tween(object.rotation, tweenGroupRef.current)
        .to({ x: flatObject3D.rotation.x, y: flatObject3D.rotation.y, z: flatObject3D.rotation.z }, 1000)
        .easing(Easing.Exponential.InOut)
        .start();
    })

    new Tween({}, tweenGroupRef.current)
      .to({}, 1000)
      .onUpdate(render)
      .start();
  }, []);

  const onElementMouseClick = useCallback((curCss3DObject: CSS3DObject, css3DObjects: CSS3DObject[]) => {
    controlsRef.current.reset();
    maskRef.current.classList.add("show");
    maskRef.current.classList.remove("transparent");
    // TWEEN.removeAll();

    setCurClickCardItemObject(curCss3DObject);
    const { appData, object3D, elementStyle, controlPoint } = curCss3DObject.userData as UserData;

    const _controlPoint = controlPoint.clone();
    const turningPosition = _controlPoint.position;
    const turningRotation = _controlPoint.rotation;
    const turningStyle = { width: elementStyle.width * 1.2, height: elementStyle.height * 1.2 };

    const systemCardObject = createSystemCard(appData);
    const systemCardElement = systemCardObject.element as SystemCard;
    systemCardObject.position.copy(turningPosition);
    systemCardObject.rotation.copy(turningRotation);
    systemCardElement.containerStyle = turningStyle;
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
    new Tween({ ...elementStyle }, tweenGroupRef.current)
      .to(turningStyle, 500)
      .onUpdate((e) => {
        curCss3DObject.element.style.width = e.width + 'px';
        curCss3DObject.element.style.height = e.height + 'px';
      })
      .easing(Easing.Linear.None)
      .start()
      .chain(
        new Tween({ ...turningStyle }, tweenGroupRef.current)
          .to(systemCardStyle, 500)
          .onUpdate((e) => {
            systemCardElement.containerStyle = { ...e };
          })
          .easing(Easing.Linear.None)
      )

    new Tween({}, tweenGroupRef.current)
      .to({}, 1000)
      .onUpdate(render)
      .start();

    // systemCardElement.addEventListener('pointerdown', (e: PointerEvent) => {
    //   e.preventDefault();
    //   onMaskClick(curCss3DObject, css3DObjects, systemCardObject)
    // }, false);
  }, []);

  const handleMaskClick = () => {
    maskRef.current.classList.add("transparent");

    const { appData, object3D, elementStyle ,controlPoint} = curClickCardItemObject.userData as UserData;
    const systemCardObject = sceneRef.current.getObjectByName(`system-card-${appData.key}`) as CSS3DObject;

    const systemCardElement = systemCardObject.element as SystemCard;

    const _controlPoint = controlPoint.clone();
    const turningPosition = _controlPoint.position;
    const turningRotation = _controlPoint.rotation;
    const turningStyle = { width: elementStyle.width * 1.2, height: elementStyle.height * 1.2 };

    new Tween({ ...systemCardStyle }, tweenGroupRef.current)
      .to(turningStyle, 500)
      .onUpdate((e) => {
        systemCardElement.containerStyle = { ...e };
      })
      .easing(Easing.Linear.None)
      .chain(
        new Tween({ ...turningStyle }, tweenGroupRef.current)
          .to(elementStyle, 500)
          .onUpdate((e) => {
            curClickCardItemObject.element.style.width = e.width + 'px';
            curClickCardItemObject.element.style.height = e.height + 'px';
          })
          .easing(Easing.Linear.None)
      )
      .start();
    new Tween(systemCardObject.position, tweenGroupRef.current)
      .to(turningPosition, 500)
      .easing(Easing.Linear.None)
      .start()
      .chain(
        new Tween(curClickCardItemObject.position, tweenGroupRef.current)
          .to({ x: object3D.position.x, y: object3D.position.y, z: object3D.position.z }, 500)
          .easing(Easing.Linear.None)
      )
      .onComplete(() => {
        curClickCardItemObject.visible = true;
        systemCardObject.visible = false;
      })
    new Tween(systemCardObject.rotation, tweenGroupRef.current)
      .to({ x: turningRotation.x, y: turningRotation.y, z: turningRotation.z }, 500)
      .easing(Easing.Linear.None)
      .start()
      .chain(
        new Tween(curClickCardItemObject.rotation, tweenGroupRef.current)
          .to({ x: object3D.rotation.x, y: object3D.rotation.y, z: object3D.rotation.z }, 500)
          .easing(Easing.Linear.None)
      )

    new Tween({}, tweenGroupRef.current)
      .to({}, 1000)
      .onUpdate(render)
      .start()
      .onComplete(() => {
        maskRef.current.classList.remove("show");
        sceneRef.current.remove(systemCardObject);
        setCurClickCardItemObject(null);
      })
  };

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
            console.log("mouseenter");
            onElementMouseEnter(object, css3DObjects);
          }, false);
          // 鼠标移出
          element.addEventListener('mouseleave', (e) => {
            console.log("mouseleave");
            onElementMouseLeave(object, css3DObjects);
          }, false)
          // 鼠标点击
          element.addEventListener('mousedown', (e) => {
            console.log("click");
            onElementMouseClick(object, css3DObjects);
          }, false);
          // 鼠标双击
          // element.addEventListener('dblclick', (e) => {
          //   onElementDblclick(object, css3DObjects);
          // }, false)
        })
      });
  }, [])

  useEffect(() => {
    init();
    const tweenGroup = tweenGroupRef.current;

    let cancel: number;

    const animate = () => {
      cancel = requestAnimationFrame(animate);
      tweenGroup.update();
      controlsRef.current.update();
    }

    animate();
    controlsRef.current.addEventListener('change', render);

    return () => {
      controlsRef.current.removeEventListener('change', render);
      controlsRef.current.dispose();
      cameraRef.current.clear();
      tweenGroup.removeAll();
      sceneRef.current.clear();
      cancelAnimationFrame(cancel);
    }
  }, [])

  useEffect(() => {
    const helpers = createHelper();
    const { css3DObjects } = createCardItems(dataSource);

    sceneRef.current.add(...css3DObjects, ...helpers);
    render();
    entranceAnimation(css3DObjects);

    return () => {
      sceneRef.current.remove(...css3DObjects, ...helpers);
      lineCiCodes.forEach((item) => {
        const currentLine = sceneRef.current.getObjectByName(item);
        sceneRef.current.remove(currentLine);
        lineCiCodes.delete(item);
      });
    }
  }, [dataSource]);

  return (
    <>
      <div className="container" ref={containerRef} ></div>
      <div className="mask" ref={maskRef} onClick={handleMaskClick} >
        <WrappedSystemCard {...(curClickCardItemObject?.userData as UserData)?.appData?.systemCardProps}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </>
  );
}
