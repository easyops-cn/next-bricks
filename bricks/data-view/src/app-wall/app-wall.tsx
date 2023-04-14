import React, { useCallback, useEffect, useRef, useState } from "react";
import { wrapBrick } from "@next-core/react-element";
import { Vector3, PerspectiveCamera, Scene, MathUtils, Group as ThreeGroup } from "three";
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
  const closeBtnRef = useRef<HTMLDivElement>()

  const rendererRef = useRef<CSS3DRenderer>();
  const sceneRef = useRef<Scene>();
  const cameraRef = useRef<PerspectiveCamera>();
  const controlsRef = useRef<TrackballControls>();
  const tweenGroupRef = useRef<Group>(new Group());
  const trapezoidalTweenRef = useRef<Group>(new Group()); //梯形内部的动画组
  const trapezoidalRef = useRef<CSS3DObject>(); // 梯形模型
  const threeGroupRef = useRef<ThreeGroup>(new ThreeGroup()); //整体模型
  const timerRef = useRef<number>(); // 双击事件禁止单击事件触发定时器
  const isDBClickRef = useRef<boolean>(false);//是否是双击
  const dbClickTweenGroupRef = useRef<Group>(new Group()); // 双击后的动画组

  const clickAnimationRunning = useRef(false);


  const [curClickCardItemObject, setCurClickCardItemObject] = useState<CSS3DObject>(null);
  const systemCardRef = useRef<SystemCard>();

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
    // camera.position.y = 100;
    // camera.lookAt(scene.position);
    // camera.lookAt(new Vector3(0, -100, 0));


    // containerRef.current.innerHTML = null;
    containerRef.current.appendChild(renderer.domElement);

    // controls
    const controls = new TrackballControls(camera, renderer.domElement);
    // const controls = new TrackballControls(camera, containerRef.current);
    controls.zoomSpeed = 10;
    controls.rotateSpeed = 10;
    controls.staticMoving = true;
    controls.minDistance = 500; // 摄像机向内最多能移动多少
    controls.maxDistance = 6000;  // 摄像机向外最多能移动多少;
    // controls.target.set(0, 0, -originZ);


    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    controlsRef.current = controls;
  }, []);

  const onElementMouseEnter = (curCss3DObject: CSS3DObject, css3DObjects: CSS3DObject[]) => {
    const { appData, cardItemObject3D } = curCss3DObject.userData as UserData;

    // Todo: map first
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
  };

  const onElementMouseLeave = (curCss3DObject: CSS3DObject, css3DObjects: CSS3DObject[]) => {
    const { appData, cardItemObject3D } = curCss3DObject.userData as UserData;
    console.log(clickAnimationRunning.current);
    css3DObjects.map(v => {
      if (clickAnimationRunning.current) return;

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
  };

  const onElementDblclick = useCallback((curCss3DObject: CSS3DObject, css3DObjects: CSS3DObject[]) => {
    css3DObjects.map(object => {
      const { cardItemObject3D } = object.userData as UserData;

      new Tween(object.position, tweenGroupRef.current)
        .to(cardItemObject3D.flat.position, 1000)
        .easing(Easing.Exponential.InOut)
        // .chain(new Tween(object.position, tweenGroupRef.current).to(cardItemObject3D.curve.position, 1000).easing(Easing.Exponential.InOut))
        .start();

      new Tween(object.rotation, tweenGroupRef.current)
        .to(eulerToXYZ(cardItemObject3D.flat.rotation), 1000)
        .easing(Easing.Exponential.InOut)
        // .chain(new Tween(object.rotation, tweenGroupRef.current).to(eulerToXYZ(cardItemObject3D.curve.rotation), 1000).easing(Easing.Exponential.InOut))
        .start();

    })

    new Tween({}, tweenGroupRef.current)
      .to({}, 6000)
      .onUpdate(render)
      .start();

    // 由于展示台用于都要在target位置，但是我们需要整个模型都去移动,
    // 所以是 展示台 source - target 向量 归一 的平行向量 是模型中心 移动 到最终目的的位置；
    const sourceVector = curCss3DObject.position.clone();
    const targetVector = new Vector3(0, threeGroupRef.current.position.y, threeGroupRef.current.position.z).clone();
    const subVector = new Vector3().subVectors(sourceVector, targetVector).normalize();
    const moveVector = new Vector3().addVectors(subVector, threeGroupRef.current.position);

    const { elementStyle, cardItemObject3D } = curCss3DObject.userData as UserData;
    const { objectContainer, objectTopModel, objectCantModel } = createTrapezoidalObject({
      objectData: {
        width: elementStyle.width,
        height: elementStyle.height,
        point: [cardItemObject3D.flat.position.x, cardItemObject3D.flat.position.y, cardItemObject3D.flat.position.z]
      },
      leftBtnName: "应用健康监控大屏",
      rightBtnName: "应用部署架构"
    });
    const centerTween = new Tween(threeGroupRef.current.position, tweenGroupRef.current)
      .to(moveVector, 1000)
      .easing(Easing.Linear.None).onUpdate(render)
    new Tween(threeGroupRef.current.rotation, tweenGroupRef.current)
      .to({ x: -Math.PI / 4, y: 0, z: 0 }, 1000).easing(Easing.Exponential.InOut)
      .start().onComplete(() => {
        trapezoidalRef.current = objectContainer;
        objectContainer.add(objectCantModel);
        objectContainer.add(objectTopModel);
        threeGroupRef.current.add(trapezoidalRef.current);
        centerTween.start()
        render()
      });

    // 双击后的遮罩层

    // const closeBtn = document.createElement("div");
    // closeBtn.style.cssText = `
    //    position: fixed;
    //    top: 50px;
    //    right: 50px;
    //    width: 46px;
    //    height: 46px;
    //    text-align: center;
    //    border: 1px solid;
    //    color: #8ABDFF21;
    //    font-size: 20px;
    //    line-height: 46px;
    //    cursor: pointer;
    //    background: rgba(138,189,255,0.13);
    //    border-image: linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.33)) 1 1;
    // `;
    // document.body.appendChild(closeBtn);
    closeBtnRef.current.style.visibility = "visible";
    closeBtnRef.current.onclick = () =>handleDBClickEventClose(css3DObjects)

  }, []);
  const handleDBClickEventClose = (css3DObjects: CSS3DObject[])=>{
    threeGroupRef.current.remove(trapezoidalRef.current);
    closeBtnRef.current.style.visibility = "hidden";
    new Tween(threeGroupRef.current.rotation, tweenGroupRef.current)
        .to({ x: 0, y: 0, z: 0 }, 1000).easing(Easing.Exponential.InOut)
        .start().onComplete(() => {
      css3DObjects.map(object => {
        const { cardItemObject3D } = object.userData as UserData;
        new Tween(object.position, tweenGroupRef.current)
            .to(cardItemObject3D.curve.position, 1000)
            .easing(Easing.Exponential.InOut)
            .start();
        new Tween(object.rotation, tweenGroupRef.current)
            .to(eulerToXYZ(cardItemObject3D.curve.rotation), 1000)
            .easing(Easing.Exponential.InOut)
            .start();
      })
    });

  }

  const onElementMouseClick = (curCss3DObject: CSS3DObject, css3DObjects: CSS3DObject[]) => {
    if (clickAnimationRunning.current) return;
    clickAnimationRunning.current = true;
    tweenGroupRef.current.removeAll();
    controlsRef.current.reset();

    const { appData, elementStyle, turningStyle, systemCardObject, cardItemObject3D, systemCardObject3D } = curCss3DObject.userData as UserData;

    const systemCardElement = systemCardObject.element as SystemCard;
    systemCardObject.position.copy(systemCardObject3D.clickTurn.position);
    systemCardObject.rotation.copy(systemCardObject3D.clickTurn.rotation);
    systemCardElement.containerStyle = turningStyle;

    maskRef.current.classList.remove("hidden");
    systemCardRef.current.hidden = true;
    systemCardObject.visible = false;

    sceneRef.current.add(systemCardObject);

    setCurClickCardItemObject(curCss3DObject);

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
        clickAnimationRunning.current = false;
      })
      .start();
  };

  const handleMaskClick = () => {
    if (clickAnimationRunning.current) return;
    clickAnimationRunning.current = true;
    tweenGroupRef.current.removeAll();
    controlsRef.current.reset();

    const { appData, elementStyle,turningStyle, cardItemObject3D, systemCardObject3D, systemCardObject } = curClickCardItemObject.userData as UserData;

    const systemCardElement = systemCardObject.element as SystemCard;

    systemCardRef.current.hidden = true;
    systemCardObject.visible = true;

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

    new Tween({}, tweenGroupRef.current)
      .to({}, 1000)
      .onUpdate(render)
      .start()
      .onComplete(() => {
        maskRef.current.classList.add("hidden");
        sceneRef.current.remove(systemCardObject);
        setCurClickCardItemObject(null);
        clickAnimationRunning.current = false;
      })
  };

  const entranceAnimation = useCallback((css3DObjects: CSS3DObject[]) => {
    containerRef.current.classList.add("loading");
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
            controlsRef.current.enabled = false;
            console.log(object.userData.appData.key, "mouseenter");
            onElementMouseEnter(object, css3DObjects);
          }, false);
          // 鼠标移出
          element.addEventListener('mouseleave', (e) => {
            controlsRef.current.enabled = true;
            console.log(object.userData.appData.key, "mouseleave");
            onElementMouseLeave(object, css3DObjects);
          }, false)
          // 鼠标点击
          // element.addEventListener('click', (e) => {
          //   isDBClickRef.current = false;
          //   timerRef.current = window.setTimeout(() => {
          //     if (!isDBClickRef.current) {
          //       // onElementMouseClick(object, css3DObjects);
          //     }
          //   }
          //     , 500);
          // }, false);
          // // 鼠标双击
          // element.addEventListener('dblclick', (e) => {
          //   isDBClickRef.current = true;
          //   window.clearTimeout(timerRef.current);
          //   onElementDblclick(object, css3DObjects);
          // }, false)
        });

        containerRef.current.classList.remove("loading");
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
              console.log('单击')
              // onElementMouseClick(object, css3DObjects);
            } else {
              console.log('双击')
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
      <div className="mask hidden" ref={maskRef} onClick={handleMaskClick} >
        <WrappedSystemCard {...(curClickCardItemObject?.userData as UserData)?.appData?.systemCardProps}
          onClick={(e) => e.stopPropagation()}
          ref={systemCardRef}
        />
      </div>
      <div className="closeBtn" ref={closeBtnRef} >X</div>
    </>
  );
}
