import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { debounce } from "lodash";
import { MathUtils, Object3D, PerspectiveCamera, Scene } from "three";
import {
  CSS3DObject,
  CSS3DRenderer,
} from "three/addons/renderers/CSS3DRenderer.js";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import TWEEN, { Tween, Easing } from "@tweenjs/tween.js";
import type { AppWallProps } from "./index.jsx";
import {
  AppWallCardBrickEleType,
  BaseConfig,
  CardSize,
  DistanceConfig,
  Ele,
  Position,
  RegisterEvents,
  Target,
  Targets,
} from "./interface.js";
import {
  AppData,
  computeCameraDistance,
  createCurveTarget,
  createTableTarget,
  createTrapezoidalObject,
  setAppPosition,
  createRelationLine,
  getAppRelations,
  findElementByEvent,
} from "./utils.js";

import "./card-item/index.js";
import { SystemCard, SystemCardProps } from "./system-card/index.jsx";
import { wrapBrick } from "@next-core/react-element";
import classNames from "classnames";
const distanceConfig: DistanceConfig[] = [
  {
    numRange: [0, 40],
    distance: 3000,
  },
  {
    numRange: [40, 60],
    distance: 2200,
  },
  {
    numRange: [60, 80],
    distance: 2700,
  },
  {
    numRange: [80, 120],
    distance: 3200,
  },
  {
    numRange: [120, 160],
    distance: 3400,
  },
  {
    numRange: [160, 300],
    distance: 3600,
  },
];
const fov = 45;
const angle = 100;
const panelSpace = 300;

const getViewBounds = (length: number, cardSize: CardSize, margin: number) => {
  const maxX = Math.ceil(
    Math.sqrt((length * cardSize.outerHeight) / (0.4 * cardSize.outerWidth))
  );
  const maxY = Math.ceil(length / maxX);
  const radius =
    parseInt(`${maxX * cardSize.outerWidth * 180}`) / (angle * Math.PI);
  const width =
    2 * radius * Math.sin((Math.PI * (angle / 2)) / 180) + cardSize.outerWidth;
  const height = maxY * cardSize.outerHeight;
  const z = radius - radius * Math.cos((Math.PI * (angle / 2)) / 180);
  return {
    maxX,
    maxY,
    radius,
    bounds: {
      width,
      height,
      margin,
      z,
    },
  };
};

const WrappedSystemCard = wrapBrick<SystemCard, SystemCardProps>(
  "data-view.app-wall-system-card"
);

export function AppWallElement(props: AppWallProps): ReactElement {
  const {
    relations,
    onSystemCardButtonClick,
    useDblclick,
    useDistanceConfig,
    handleCardDbClick,
    rightBtnOnClick,
    leftBtnOnClick,
    cardBrickName,
    cardSize,
    disabledDefaultClickEvent,
    handleCardClick,
    containerId,
    noRotate,
    boundMargin,
  } = props;
  const [curClickCardItemAppData, setCurClickCardItemAppData] =
    useState<AppData>(null);

  const containerRef = useRef<HTMLDivElement>();
  const appwallRef = useRef<HTMLDivElement>();
  const closeBtnRef = useRef<HTMLDivElement>();
  const maskRef = useRef<HTMLDivElement>();
  const systemCardRef = useRef<SystemCard>();

  const rendererRef = useRef<CSS3DRenderer>();
  const sceneRef = useRef<Scene>();
  const cameraRef = useRef<PerspectiveCamera>();
  const controlsRef = useRef<TrackballControls>();
  const graph3DViewRef = useRef<CSS3DObject>(); // 梯形模型
  const targetsRef = useRef<Targets>({
    table: [],
    curve: [],
  });
  const objectsRef = useRef<CSS3DObject[]>([]);
  const lineCiCodesRef = useRef<CSS3DObject[]>([]);

  const configRef = useRef<BaseConfig>({
    maxX: 0,
    maxY: 0,
    radius: 0,
    bounds: {
      width: 0,
      height: 0,
      margin: boundMargin,
      z: 0,
    },
  });
  const registerEvents = useRef<RegisterEvents>({
    element: null,
    mouseoverTimer: null,
    mouseoutTimer: null,
    clickTimer: null,
    dblClickTimer: null,
    isShowGraph3D: false,
    isShowAppInfo: false,
    isShowRelations: false,
    enable: true, //是否可以触发事件
  });

  const render = useCallback(() => {
    rendererRef.current.render(sceneRef.current, cameraRef.current);
    controlsRef.current.handleResize();
  }, []);

  const updateViewBounds = (length: number) => {
    configRef.current = getViewBounds(length, cardSize, boundMargin);
  };

  const init = () => {
    const containerRect = document
      .getElementById(containerId)
      ?.getBoundingClientRect();
    const width = containerRect?.width || window.innerWidth;
    const height = containerRect?.height || window.innerHeight;
    const aspect = width / height;
    const scene = new Scene();
    const camera = new PerspectiveCamera(fov, aspect, 0.1, 10000);

    const renderer = new CSS3DRenderer();
    renderer.setSize(width, height);
    appwallRef.current.replaceChildren(renderer.domElement);

    const controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 0.5;
    controls.minDistance = 500;
    controls.maxDistance = 10000;
    controls.noRotate = noRotate;

    sceneRef.current = scene;
    cameraRef.current = camera;
    controlsRef.current = controls;
    rendererRef.current = renderer;
  };

  const createView = (table: Target[]) => {
    table.forEach((data, i) => {
      const element = document.createElement(
        cardBrickName
      ) as AppWallCardBrickEleType & Ele;
      element.status = data.status;
      element.cardTitle = data.cardItemProps?.cardTitle;
      element.description = data.cardItemProps?.description;
      element.background = data.cardItemProps?.background;
      element.color = data.cardItemProps?.color;
      element.titleStyle = data.cardItemProps?.titleStyle;
      element.desStyle = data.cardItemProps?.desStyle;
      element.descriptionList = data.cardItemProps?.descriptionList;
      const statusClass = `status-${data?.status || "normal"}`;
      element.className = `card-item-container  ${statusClass}`;
      element.style.width = `${cardSize.width}px`;
      element.style.height = `${cardSize.height}px`;
      element.classList.add("card-item-wrap");
      // 随机进入
      const objectCSS = new CSS3DObject(element);
      objectCSS.position.set(
        4e3 * Math.random() - 2e3,
        4e3 * Math.random() - 2e3,
        4e3 * Math.random() - 2e3
      );

      sceneRef.current.add(objectCSS);
      objectsRef.current.push(objectCSS);

      const table = createTableTarget(
        data,
        cardSize,
        configRef.current.maxX,
        configRef.current.maxY
      );
      targetsRef.current.table.push(table);
      const curve = createCurveTarget(
        data,
        cardSize,
        configRef.current.maxX,
        configRef.current.maxY,
        angle,
        configRef.current.radius
      );
      targetsRef.current.curve.push(curve);

      objectCSS.userData = data;
      element.__objectCSS = objectCSS;
      element.__userData = data;
      element.__curve = curve;
    });
  };

  const createRelationLines = (object: CSS3DObject) => {
    const curRelations = getAppRelations(object, relations);
    const userData = object.userData;
    let lineObject: CSS3DObject, lineTarget: CSS3DObject;
    curRelations?.forEach((relation) => {
      if (relation.source === userData.key) {
        //获取目标target CSS3DObject
        lineTarget = objectsRef.current.find(
          (o) => o.userData.key === relation.target
        );
        lineObject =
          lineTarget &&
          createRelationLine(object.position, lineTarget.position, "blue");
      } else {
        lineTarget = objectsRef.current.find(
          (o) => o.userData.key === relation.source
        );
        lineObject =
          lineTarget &&
          createRelationLine(lineTarget.position, object.position, "purple");
      }
      if (!lineObject) return;
      lineCiCodesRef.current.push(lineObject);
      sceneRef.current.add(lineObject);
    });
    objectsRef.current?.forEach((item) => {
      if (
        object != item &&
        curRelations.every(
          (r) => r.source != item.userData.key && r.target != item.userData.key
        )
      ) {
        item.element.style.opacity = "0.2";
      }
    });
  };

  const showElementBetweenRelation = (target: Ele) => {
    const { __objectCSS, __userData } = target;
    const rotationY = __objectCSS.rotation.y;
    const position: Position = {
      x: __objectCSS.position.x + 50 * Math.sin(rotationY),
      y: __objectCSS.position.y + 15,
      z: __objectCSS.position.z + 100 * Math.cos(rotationY),
    };
    const scale = 1.25,
      duration = 200;
    registerEvents.current.isShowRelations = true;
    new Tween(__objectCSS.rotation)
      .to(
        {
          x: 0,
          y: 0,
          z: 0,
        },
        duration
      )
      .onStart(() => {
        cardBrickName === "data-view.app-wall-card-item" &&
          __objectCSS.element.classList.add(
            `status-${__userData.status || "normal"}-card`
          );
      })
      .start();
    new Tween(__objectCSS.scale)
      .to(
        {
          x: scale,
          y: scale,
          z: scale,
        },
        duration
      )
      .start();
    new Tween(__objectCSS.position)
      .to(position, duration)
      .onUpdate(render)
      .onComplete(function () {
        //创建连线
        createRelationLines(__objectCSS);
        render();
        registerEvents.current.element = target;
      })
      .start();
  };

  const restoreElementState = (onComplete?: (ele?: Ele) => void) => {
    if (!registerEvents.current?.element) return onComplete?.();
    const {
      __objectCSS,
      __curve: object3d,
      __userData,
    } = registerEvents.current.element;
    const duration = 200;

    new Tween(__objectCSS.rotation)
      .to(
        {
          x: object3d.rotation.x,
          y: object3d.rotation.y,
          z: object3d.rotation.z,
        },
        duration
      )
      .start();
    new Tween(__objectCSS.scale)
      .to(
        {
          x: 1,
          y: 1,
          z: 1,
        },
        duration
      )
      .start();
    new Tween(__objectCSS.position)
      .to(
        {
          x: object3d.position.x,
          y: object3d.position.y,
          z: object3d.position.z,
        },
        duration
      )
      .onUpdate(render)
      .onStart(() => {
        cardBrickName === "data-view.app-wall-card-item" &&
          __objectCSS.element.classList.remove(
            `status-${__userData.status || "normal"}-card`
          );
        objectsRef.current?.forEach((item) => {
          item.element.style.opacity = "1";
        });
        lineCiCodesRef.current.forEach((lineObject) => {
          sceneRef.current.remove(lineObject);
        });
        lineCiCodesRef.current = [];
        render();
      })
      .onComplete(() => {
        registerEvents.current.isShowRelations = false;
        onComplete?.(registerEvents.current?.element);
      })
      .start();
  };

  const transform = (targets: Object3D[], duration: number) => {
    registerEvents.current.enable = false;
    for (let i = 0; i < objectsRef.current.length; i++) {
      const object = objectsRef.current[i];
      const target = targets[i];

      new Tween(object.position)
        .to(
          {
            x: target.position.x,
            y: target.position.y,
            z: target.position.z,
          },
          MathUtils.randFloat(duration, duration * 2)
        )
        .easing(Easing.Exponential.InOut)
        .start();

      new Tween(object.rotation)
        .to(
          {
            x: target.rotation.x,
            y: target.rotation.y,
            z: target.rotation.z,
          },
          MathUtils.randFloat(duration, duration * 2)
        )
        .easing(Easing.Exponential.InOut)
        .start();
    }

    new Tween({})
      .to({}, duration * 2)
      .onUpdate(render)
      .start()
      .onComplete(() => {
        registerEvents.current.enable = true;
      });
  };

  const handeReset = () => {
    TWEEN.removeAll();
    const o = {
        opacity: 1,
      },
      e = new Tween({
        z: 0,
      }),
      n = new Tween(o),
      a = new Tween(cameraRef.current.position),
      i = new Tween(controlsRef.current.target),
      r = new Tween({
        blur: 1500,
        spread: 100,
      });
    e.to(
      {
        z: panelSpace,
      },
      1e3
    ).chain(a, i, r);
    n.to(
      {
        opacity: 0,
      },
      1e3
    )
      .onStart(() => {
        sceneRef.current.remove(graph3DViewRef.current);
        closeBtnRef.current.style.visibility = "hidden";
      })
      .delay(300);

    a.to(controlsRef.current.position0, 1e3).onComplete(function () {
      controlsRef.current.reset();
      appwallRef.current.classList.remove("mask-container");
      transform(targetsRef.current.curve, 600);
      registerEvents.current.isShowGraph3D = false;
    });
    i.to(
      {
        x: 0,
        y: 0,
        z: 0,
      },
      1e3
    );
    r.to(
      {
        blur: 0,
        spread: 0,
      },
      1e3
    );
    e.start();
    n.start();
  };
  const showAppInfoAnimate = (toggle: boolean) => {
    controlsRef.current.reset();
    const object = registerEvents.current.element.__objectCSS;
    const target = registerEvents.current.element.__curve;
    registerEvents.current.enable = false;
    registerEvents.current.isShowAppInfo = true;
    //定义四个位置
    const c = {
      x: target.position.x > 0 ? 2 * -cardSize.width : 2 * cardSize.width,
      y: 0,
      z: (cameraRef.current.position.z - 500) / 1.5,
    };
    const p = {
      x: 0,
      y: 0,
      z: cameraRef.current.position.z - 500,
    };
    const h = {
      x: 0,
      y: target.rotation.y > 0 ? (-Math.PI * 90) / 180 : (Math.PI * 90) / 180,
      z: 0,
    };
    const d = {
      x: 0,
      y: target.rotation.y > 0 ? (-Math.PI * 180) / 180 : (Math.PI * 180) / 180,
      z: 0,
    };
    const i = new Tween(object.position);
    const r = new Tween(object.rotation);
    const o = new Tween(object.position);
    const s = new Tween(object.rotation);
    if (toggle) {
      //收
      i.to(c, 500)
        .easing()
        .onComplete(() => {
          systemCardRef.current.hidden = true;
          registerEvents.current.element.style.opacity = "1";
        });
      r.to(h, 500).easing();
      o.to(
        {
          x: target.position.x,
          y: target.position.y,
          z: target.position.z,
        },
        700
      ).easing();
      s.to(
        {
          x: target.rotation.x,
          y: target.rotation.y,
          z: target.rotation.z,
        },
        700
      )
        .easing()
        .onComplete(() => {
          objectsRef.current?.forEach((item) => {
            item.element.style.opacity = "1";
          });
        });
    } else {
      //出
      objectsRef.current?.forEach((item) => {
        if (object != item) {
          item.element.style.opacity = "0.2";
        }
      });
      i.to(c, 700)
        .easing()
        .onStart(() => {
          //为了飞出去的途中，不能在点击其他的卡片飞出来
          maskRef.current.hidden = false;
          systemCardRef.current.hidden = true;
        });
      r.to(h, 700).easing();
      o.to(p, 500)
        .easing()
        .onStart(function () {
          registerEvents.current.element.style.opacity = "0";
          systemCardRef.current.style.transition = "transition: all .3s ease";
          systemCardRef.current.hidden = false;
        });
      s.to(d, 500).easing();
    }
    i.chain(o).start();
    r.chain(s).start();
    new Tween({})
      .to({}, 1400)
      .onUpdate(() => {
        render();
        if (Math.abs(object.rotation.y) >= Math.PI / 2) {
          const rect = registerEvents.current.element.getBoundingClientRect();
          const scale = 1.35;
          const width = rect.width * scale;
          const height = rect.height * scale;
          systemCardRef.current.style.width = `${width}px`;
          systemCardRef.current.style.height = `${height}px`;
          systemCardRef.current.style.top = `${
            rect.top - ((scale - 1) * height) / 2
          }px`;
          systemCardRef.current.style.left = `${
            rect.left - ((scale - 1) * width) / 2
          }px`;
        }
      })
      .start()
      .onComplete(function () {
        registerEvents.current.enable = true;
        registerEvents.current.isShowAppInfo = !toggle;
        maskRef.current.hidden = toggle;
      });
  };

  const resetView = () => {
    controlsRef.current.reset();
    TWEEN.removeAll();
    objectsRef.current.map((o) => {
      sceneRef.current.remove(o);
    });
    objectsRef.current = [];
    targetsRef.current = {
      table: [],
      curve: [],
    };
    //重置交互状态
    registerEvents.current = {
      element: null,
      mouseoverTimer: null,
      mouseoutTimer: null,
      clickTimer: null,
      dblClickTimer: null,
      enable: true,
      isShowAppInfo: false,
      isShowGraph3D: false,
      isShowRelations: false,
    };
  };

  useEffect(() => {
    init();
    let cancel: number;
    const animate = () => {
      cancel = requestAnimationFrame(animate);
      TWEEN.update();
      controlsRef.current.update();
    };
    animate();
    const container = containerId
      ? document.getElementById(containerId)
      : document.body;

    const observer = new ResizeObserver(
      debounce(() => {
        const { width, height } = container.getBoundingClientRect();
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
        render();
      }, 300)
    );
    controlsRef.current.addEventListener("change", render);
    observer.observe(container);
    return () => {
      observer.disconnect();
      controlsRef.current.removeEventListener("change", render);
      controlsRef.current.dispose();
      TWEEN.removeAll();
      cameraRef.current.clear();
      sceneRef.current.clear();
      cancelAnimationFrame(cancel);
    };
  }, []);

  useEffect(() => {
    const length = props.dataSource?.length || 0;
    if (length > 0) {
      updateViewBounds(length);
      cameraRef.current.position.z = computeCameraDistance(
        cameraRef.current,
        configRef.current.bounds,
        useDistanceConfig ? distanceConfig : [],
        length
      );
      cameraRef.current.updateProjectionMatrix();
      controlsRef.current.position0.copy(cameraRef.current.position);

      const appData = setAppPosition(
        props.dataSource,
        configRef.current.maxX,
        configRef.current.maxY
      );
      createView(appData);
      transform(targetsRef.current.curve, 1000);
    }

    return () => {
      resetView();
    };
  }, [props.dataSource, useDistanceConfig]);

  useEffect(() => {
    const container = containerRef.current;
    const handleMouseover = (e: MouseEvent) => {
      clearTimeout(registerEvents.current.mouseoverTimer);
      if (
        registerEvents.current.isShowAppInfo ||
        registerEvents.current.isShowGraph3D ||
        !registerEvents.current.enable
      )
        return false;
      const target = findElementByEvent(e, cardBrickName);
      registerEvents.current.mouseoverTimer = window.setTimeout(() => {
        restoreElementState(() => {
          target &&
            !registerEvents.current.isShowAppInfo &&
            showElementBetweenRelation(target);
          clearTimeout(registerEvents.current.mouseoverTimer);
        });
      }, 300);
    };
    const handleClick = (e: MouseEvent) => {
      clearTimeout(registerEvents.current.clickTimer);
      clearTimeout(registerEvents.current.mouseoverTimer);
      if (
        registerEvents.current.isShowAppInfo ||
        registerEvents.current.isShowGraph3D ||
        !registerEvents.current.enable
      )
        return false;

      const target = findElementByEvent(e, cardBrickName);
      registerEvents.current.clickTimer = window.setTimeout(function () {
        clearTimeout(registerEvents.current.mouseoverTimer);
        restoreElementState(() => {
          if (target) {
            clearTimeout(registerEvents.current.clickTimer);
            clearTimeout(registerEvents.current.mouseoverTimer);
            e.stopPropagation();
            registerEvents.current.element = target;
            if (disabledDefaultClickEvent) {
              handleCardClick?.(target.__userData);
            } else {
              setCurClickCardItemAppData(target.__userData);
              showAppInfoAnimate(false);
            }
          }
        });
      }, 200);
    };
    const handleDbClick = (e: MouseEvent) => {
      clearTimeout(registerEvents.current.clickTimer);
      clearTimeout(registerEvents.current.mouseoverTimer);
      clearTimeout(registerEvents.current.dblClickTimer);
      if (
        registerEvents.current.isShowAppInfo ||
        registerEvents.current.isShowGraph3D ||
        !registerEvents.current.enable
      )
        return false;

      const target = findElementByEvent(e, cardBrickName);
      const { __userData, __objectCSS } = target;
      registerEvents.current.isShowGraph3D = true;
      registerEvents.current.dblClickTimer = window.setTimeout(function () {
        restoreElementState(() => {
          if (
            useDblclick ||
            __userData.trapezoidalProps?.clusters?.length < 1
          ) {
            handleCardDbClick(__userData);
            registerEvents.current.isShowGraph3D = false;
          } else {
            if (target) {
              clearTimeout(registerEvents.current.mouseoverTimer);
              clearTimeout(registerEvents.current.clickTimer);
              appwallRef.current.classList.add("mask-container");
              controlsRef.current.reset();
              const basePosition = {
                opacity: 0,
                scale: 0,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderTopWidth: 0,
                borderBottomWidth: 0,
              };
              const u = {
                x: __objectCSS.position.x,
                y:
                  860 +
                  cardSize.height * (configRef.current.maxY - __userData.y),
              };
              const n = new Tween(cameraRef.current.position);
              const a = new Tween(basePosition);
              const i = new Tween({
                z: 0,
              });
              const r = new Tween(cameraRef.current.position);
              const o = new Tween(controlsRef.current.target);
              const s = new Tween({
                blur: 12,
                spread: 0,
              });
              transform(targetsRef.current.table, 600);
              n.to(
                {
                  x: 0,
                  y: -3600,
                  z: 1600,
                },
                1e3
              ).chain(s, a, i);
              a.to(
                {
                  opacity: 1,
                },
                700
              ).onStart(() => {
                const objectContainer = createTrapezoidalObject({
                  objectData: {
                    width: cardSize.width,
                    height: cardSize.height,
                    point: [
                      __objectCSS.position.x,
                      __objectCSS.position.y,
                      __objectCSS.position.z,
                    ],
                  },
                  clusters: __userData.trapezoidalProps?.clusters,
                  columns: __userData.trapezoidalProps?.columns,
                  appName: __userData.trapezoidalProps?.appName,
                  leftBtnName: __userData.trapezoidalProps?.leftBtnName,
                  rightBtnName: __userData.trapezoidalProps?.rightBtnName,
                  rightOnClick: () => rightBtnOnClick(__userData),
                  leftOnClick: () => leftBtnOnClick(__userData),
                });
                graph3DViewRef.current = objectContainer;
                sceneRef.current.add(objectContainer);
              });
              i.to(
                {
                  z: panelSpace,
                },
                1e3
              )
                .delay(230)
                .chain(r, o);

              r.to(
                {
                  x: u.x,
                  y: -3600 + u.y,
                },
                1e3
              );
              o.to(
                {
                  x: u.x,
                  y: u.y,
                },
                1e3
              ).onComplete(function () {
                closeBtnRef.current.style.visibility = "visible";
              });
              n.start();
            }
          }
        });
      }, 200);
    };

    container.addEventListener("dblclick", handleDbClick);
    container.addEventListener("click", handleClick);
    container.addEventListener("mouseover", handleMouseover);
    return () => {
      container.removeEventListener("mouseover", handleMouseover);
      container.removeEventListener("click", handleClick);
      container.removeEventListener("dblclick", handleDbClick);
    };
  }, [disabledDefaultClickEvent, handleCardClick]);

  return (
    <div className="appwall-container" ref={containerRef}>
      <div className="appwall" ref={appwallRef}></div>
      <div
        className="mask"
        ref={maskRef}
        onClick={() => {
          registerEvents.current.enable && showAppInfoAnimate(true);
        }}
        hidden={true}
      >
        <WrappedSystemCard
          {...curClickCardItemAppData?.systemCardProps}
          onClick={(e) => e.stopPropagation()}
          handleClick={() => onSystemCardButtonClick(curClickCardItemAppData)}
          ref={systemCardRef}
          className={classNames({
            infoWrapper: curClickCardItemAppData?.status === "normal",
            warningWrapper: curClickCardItemAppData?.status === "warning",
          })}
        />
      </div>
      <div
        className="closeBtn"
        ref={closeBtnRef}
        onClick={() => {
          handeReset();
        }}
      />
    </div>
  );
}
