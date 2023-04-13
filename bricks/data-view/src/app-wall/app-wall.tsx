import React, { useCallback, useEffect, useRef, useState } from "react";
import { wrapBrick } from "@next-core/react-element";
import { Vector3, PerspectiveCamera, Scene, MathUtils, CameraHelper, Group as ThreeGroup } from "three";
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { Tween, Easing, Group } from "@tweenjs/tween.js";

import { createHelper } from "./helpers.js";
import { createCardItems, createRelationLine, type UserData, systemCardStyle, createTrapezoidalObject, eulerToXYZ } from "./utils.js";
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
  const trapezoidalTweenRef = useRef<Group>(new Group()); //梯形内部的动画组
  const trapezoidalRef = useRef<CSS3DObject>(); // 梯形模型
  const threeGroupRef = useRef<ThreeGroup>(new ThreeGroup()); //整体模型
  const timerRef = useRef<number>(); // 双击事件禁止单击事件触发定时器
  const isDBClickRef = useRef<boolean>(false);//是否是双击
  const dbClickTweenGroupRef = useRef<Group>(new Group()); // 双击后的动画组


  const [curClickCardItemObject, setCurClickCardItemObject] = useState<CSS3DObject>(null);
  const systemCardRef = useRef<SystemCard>();

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
    const { appData, cardItemObject3D } = curCss3DObject.userData as UserData;

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
          .to(cardItemObject3D.hover.position, 200)
          .easing(Easing.Linear.None)
          .start();
        new Tween(curCss3DObject.rotation, tweenGroupRef.current)
          .to(eulerToXYZ(cardItemObject3D.hover.rotation), 200)
          .easing(Easing.Linear.None)
          .start();
        new Tween({}, tweenGroupRef.current)
          .to({}, 200)
          .onUpdate(render)
          .start();
        v.element.classList.add("large");
      } else {
        const { appData: relatedAppData, cardItemObject3D: relatedCardItemObject3D } = v.userData as UserData;

        if (filteredRelations.in.has(relatedAppData.key)) {
          const lineId = `${appData.key}-${relatedAppData.key}`;
          const line = createRelationLine(cardItemObject3D.hover.position, relatedCardItemObject3D.curve.position, "purple");
          line.name = lineId;
          lineCiCodes.add(lineId);
          sceneRef.current.add(line);
        } else if (filteredRelations.out.has(relatedAppData.key)) {
          const lineId = `${relatedAppData.key}-${appData.key}`;
          const line = createRelationLine(relatedCardItemObject3D.curve.position, cardItemObject3D.hover.position, "blue");
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
    const { appData, cardItemObject3D } = curCss3DObject.userData as UserData;

    css3DObjects.map(v => {
      v.element.classList.remove("dark", "large");

      if (v === curCss3DObject) {
        new Tween(curCss3DObject.position, tweenGroupRef.current)
          .to(cardItemObject3D.curve.position, 200)
          .easing(Easing.Exponential.InOut)
          .start();
        new Tween(curCss3DObject.rotation, tweenGroupRef.current)
          .to(eulerToXYZ(cardItemObject3D.curve.rotation), 200)
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
      const { cardItemObject3D } = object.userData as UserData;

      new Tween(object.position, tweenGroupRef.current)
        .to(cardItemObject3D.flat.position, 1000)
        .easing(Easing.Exponential.InOut)
        // .chain(new Tween( threeGroupRef.current.position, dbClickTweenGroupRef.current).to(new Vector3(0 ,0,0)).easing(Easing.Exponential.InOut))
        // .to({},1000)
        .easing(Easing.Exponential.InOut)
        .start();

      new Tween(object.rotation, tweenGroupRef.current)
        .to(eulerToXYZ(cardItemObject3D.flat.rotation), 1000)
        .easing(Easing.Exponential.InOut)
        .start();
    })

    new Tween({}, tweenGroupRef.current)
      .to({}, 1000)
      .onUpdate(render)
      .start();

    // threeGroupRef.current.rotateX(-Math.PI/2);
    // threeGroupRef.current.add(trapezoidalRef.current);
    const { elementStyle, cardItemObject3D } = curCss3DObject.userData as UserData;


    new Tween(threeGroupRef.current.rotation, dbClickTweenGroupRef.current)
      .to({ x: -Math.PI / 4, y: 0, z: 0 }, 1000).easing(Easing.Exponential.InOut)
      .start().onComplete(() => {
        trapezoidalRef.current = createTrapezoidalObject({
          objectData: {
            width: elementStyle.width,
            height: elementStyle.height,
            point: [cardItemObject3D.flat.position.x, cardItemObject3D.flat.position.y, cardItemObject3D.flat.position.z]
          },
          trapezoidalTweenRef,
          leftBtnName: "应用健康监控大屏",
          rightBtnName: "应用部署架构"
        })
        threeGroupRef.current.add(trapezoidalRef.current);
        render()
        maskRef.current.classList.remove("show");
      })
  }, []);

  const onElementMouseClick = useCallback((curCss3DObject: CSS3DObject, css3DObjects: CSS3DObject[]) => {
    controlsRef.current.reset();
    maskRef.current.classList.add("show");
    maskRef.current.classList.remove("transparent");
    systemCardRef.current.hidden = true;
    tweenGroupRef.current.removeAll();

    setCurClickCardItemObject(curCss3DObject);
    const { appData, elementStyle, systemCardObject, cardItemObject3D, systemCardObject3D } = curCss3DObject.userData as UserData;

    const turningStyle = { width: elementStyle.width * 1.2, height: elementStyle.height * 1.2 };

    const systemCardElement = systemCardObject.element as SystemCard;
    systemCardObject.position.copy(systemCardObject3D.clickTurn.position);
    systemCardObject.rotation.copy(systemCardObject3D.clickTurn.rotation);
    systemCardElement.containerStyle = turningStyle;
    systemCardObject.visible = false;

    sceneRef.current.add(systemCardObject);

    new Tween(curCss3DObject.position, tweenGroupRef.current)
      .to(cardItemObject3D.clickTurn.position, 500)
      .easing(Easing.Linear.None)
      .start()
      .chain(
        new Tween(systemCardObject.position, tweenGroupRef.current)
          .to(systemCardObject3D.front.position, 500)
          .easing(Easing.Linear.None),
      )
      .onComplete(() => {
        curCss3DObject.visible = false;
        systemCardObject.visible = true;
      })
    new Tween(curCss3DObject.rotation, tweenGroupRef.current)
      .to(eulerToXYZ(cardItemObject3D.clickTurn.rotation), 500)
      .easing(Easing.Linear.None)
      .start()
      .chain(
        new Tween(systemCardObject.rotation, tweenGroupRef.current)
          .to(eulerToXYZ(systemCardObject3D.front.rotation), 500)
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
      .onComplete(() => {
        systemCardRef.current.hidden = false;
        systemCardObject.visible = false;
        render();
      })
      .start();

    // systemCardElement.addEventListener('pointerdown', (e: PointerEvent) => {
    //   e.preventDefault();
    //   onMaskClick(curCss3DObject, css3DObjects, systemCardObject)
    // }, false);
  }, []);

  const handleMaskClick = () => {
    maskRef.current.classList.add("transparent");
    systemCardRef.current.hidden = true;

    const { appData, elementStyle, cardItemObject3D, systemCardObject3D, systemCardObject } = curClickCardItemObject.userData as UserData;

    const systemCardElement = systemCardObject.element as SystemCard;
    systemCardObject.visible = true;

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
      .to(systemCardObject3D.clickTurn.position, 500)
      .easing(Easing.Linear.None)
      .start()
      .chain(
        new Tween(curClickCardItemObject.position, tweenGroupRef.current)
          .to(cardItemObject3D.curve.position, 500)
          .easing(Easing.Linear.None)
      )
      .onComplete(() => {
        curClickCardItemObject.visible = true;
        systemCardObject.visible = false;
      })
    new Tween(systemCardObject.rotation, tweenGroupRef.current)
      .to(eulerToXYZ(systemCardObject3D.clickTurn.rotation), 500)
      .easing(Easing.Linear.None)
      .start()
      .chain(
        new Tween(curClickCardItemObject.rotation, tweenGroupRef.current)
          .to(eulerToXYZ(cardItemObject3D.curve.rotation), 500)
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
      const { cardItemObject3D } = object.userData as UserData;
      const { position, rotation } = cardItemObject3D.curve;

      new Tween(object.position, tweenGroupRef.current)
        .to({ x: position.x, y: position.y, z: position.z }, MathUtils.randFloat(duration, duration * 2))
        .easing(Easing.Exponential.InOut)
        .start();

      new Tween(object.rotation, tweenGroupRef.current)
        .to({ x: rotation.x, y: rotation.y, z: rotation.z }, MathUtils.randFloat(duration, duration * 2))
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
          element.addEventListener('click', (e) => {
            isDBClickRef.current = false;
            timerRef.current = window.setTimeout(() => {
              if (!isDBClickRef.current) {
                // onElementMouseClick(object, css3DObjects);
              }
            }
              , 500);
          }, false);
          // // 鼠标双击
          // element.addEventListener('dblclick', (e) => {
          //   isDBClickRef.current = true;
          //   window.clearTimeout(timerRef.current);
          //   onElementDblclick(object, css3DObjects);
          // }, false)
        })
      });

    let clicks = 0;
    containerRef.current.addEventListener('click', (e) => {
      const customEle = document.elementFromPoint(e.clientX, e.clientY)
      const target = customEle?.shadowRoot.elementFromPoint(e.clientX, e.clientY);
      // console.log(target, target.tagName);
      if (target?.tagName === 'DATA-VIEW.APP-WALL-CARD-ITEM') {
        const object = (target as any)._css3DObject;
        clicks++;
        if (clicks === 1) {
          setTimeout(() => {
            if (clicks == 1) {
              // console.log('单击')
              // onElementMouseClick(object, css3DObjects);
            } else {
              // console.log('双击')
              onElementDblclick(object, css3DObjects);
            }
            clicks = 0;
          }, 200);
        }
      }
    }, false)
  }, [])

  useEffect(() => {
    init();
    const tweenGroup = tweenGroupRef.current;

    let cancel: number;

    const animate = () => {
      cancel = requestAnimationFrame(animate);
      tweenGroup.update();
      trapezoidalTweenRef.current.update();
      dbClickTweenGroupRef.current.update();
      controlsRef.current.update();
    }

    animate();
    controlsRef.current.addEventListener('change', render);

    return () => {
      controlsRef.current.removeEventListener('change', render);
      controlsRef.current.dispose();
      cameraRef.current.clear();
      tweenGroup.removeAll();
      trapezoidalTweenRef.current.removeAll();
      dbClickTweenGroupRef.current.removeAll();
      sceneRef.current.clear();
      cancelAnimationFrame(cancel);
    }
  }, [])

  useEffect(() => {
    const helpers = createHelper();
    const { css3DObjects } = createCardItems(dataSource);
    threeGroupRef.current.add(...css3DObjects);
    sceneRef.current.add(threeGroupRef.current, ...helpers);
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
          ref={systemCardRef}
        />
      </div>
    </>
  );
}
