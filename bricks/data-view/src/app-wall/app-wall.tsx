/* istanbul ignore next */
import React, { ReactElement, useCallback, useEffect, useRef, useState } from "react";
import { MathUtils, Object3D, PerspectiveCamera, Scene } from "three";
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import TWEEN, { Tween, Easing } from "@tweenjs/tween.js";
import type { AppWallProps } from "./index.jsx";
import { BaseConfig, CardSize, DistanceConfig, Position, Target, Targets } from "./interface.js";
import { AppData, computeCameraDistance, createCurveTarget, createTableTarget, createTrapezoidalObject, setAppPosition, createRelationLine, getAppRelations, findElementByEvent } from "./utils.js";
import { AppWallCardItem } from "./card-item/index.jsx";
import "./card-item/index.js";
import { SystemCard, SystemCardProps } from "./system-card/index.jsx";
import { wrapBrick } from "@next-core/react-element";
import classNames from "classnames";


const table = Array.from({
  length: 262
}).map((v, i) => ({
  key: `${i}`,
  shortName: `shortName-${i}`,
  status: i % 5 ? 'normal' : 'warning',
  cardItemProps: {
    cardTitle: 'cardTitle',
    description: 'description'
  },
  systemCardProps: {
    cardTitle: 'cardTitle',
    description: 'description'
  },
  trapezoidalProps: {
    leftBtnName: 'leftBtnName',
    rightBtnName: 'rightBtnName',
    clusters: Array.from({
      length: 3
    }).map((c, j) => ({
      title: `${j}集群容器`,
      type: j % 2 ? 'host' : 'k8s',
      data: Array.from({
        length: 100
      }).map(p => ({
        type: 'physical-machine',
        nodeTitle: '255.255.255',
      }))
    }))
  }
})) as any as AppData[];
const cardSize: CardSize = {
  width: 120,
  height: 160,
  outerWidth: 140,
  outerHeight: 180,
  lgWidth: 180,
  lgHeight: 240
};
const distanceConfig: DistanceConfig[] = [{
  numRange: [0, 40],
  distance: 3000
}, {
  numRange: [40, 60],
  distance: 2200
}, {
  numRange: [60, 80],
  distance: 2700
}, {
  numRange: [80, 120],
  distance: 3200
}, {
  numRange: [120, 160],
  distance: 3400
}, {
  numRange: [160, 300],
  distance: 3600
}];
const fov = 45;
const angle = 100;
const panelSpace = 300;

const getViewBounds = (length: number) => {
  const maxX = Math.ceil(Math.sqrt(length * cardSize.outerHeight / (.4 * cardSize.outerWidth)));
  const maxY = Math.ceil(length / maxX);
  const radius = parseInt(`${maxX * cardSize.outerWidth * 180}`) / (angle * Math.PI);
  const width = 2 * radius * Math.sin(Math.PI * (angle / 2) / 180) + cardSize.outerWidth;
  const height = maxY * cardSize.outerHeight;
  const z = radius - radius * Math.cos(Math.PI * (angle / 2) / 180);
  return {
    maxX,
    maxY,
    radius,
    bounds: {
      width,
      height,
      margin: 100,
      z
    }
  };
};


const WrappedSystemCard = wrapBrick<SystemCard, SystemCardProps>(
  "data-view.app-wall-system-card"
);

export function AppWallElement(props: AppWallProps): ReactElement {
  const { relations, onSystemCardButtonClick, useDblclick, handleCardDbClick, rightBtnOnClick, leftBtnOnClick } = props;
  const [curClickCardItemAppData, setCurClickCardItemAppData] = useState<AppData>(null);


  const containerRef = useRef<HTMLDivElement>();
  const appwallRef = useRef<HTMLDivElement>();
  const closeBtnRef = useRef<HTMLDivElement>()
  const maskRef = useRef<HTMLDivElement>();
  const systemCardRef = useRef<SystemCard>();


  const rendererRef = useRef<CSS3DRenderer>();
  const sceneRef = useRef<Scene>();
  const cameraRef = useRef<PerspectiveCamera>();
  const controlsRef = useRef<TrackballControls>();
  const graph3DViewRef = useRef<CSS3DObject>(); // 梯形模型
  const targetsRef = useRef<Targets>({
    table: [],
    curve: []
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
      margin: 100,
      z: 0
    }
  });
  const registerEvents = useRef({
    element: null,
    mouseoverTimer: null,
    mouseoutTimer: null,
    clickTimer: null,
    dblClickTimer: null,
    enable: true, //是否可以触发事件
    enableShowRelations: true
  })

  const render = useCallback(() => {
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  }, []);

  const updateViewBounds = (length: number) => {
    configRef.current = getViewBounds(length)
  };

  const init = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    const renderer = new CSS3DRenderer();
    renderer.setSize(width, height);
    appwallRef.current.replaceChildren(renderer.domElement)

    const camera = new PerspectiveCamera(fov, aspect, .1, 10000);

    const controls = new TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = .5;
    controls.minDistance = 500;
    controls.maxDistance = 10000;
    const scene = new Scene();

    sceneRef.current = scene;
    cameraRef.current = camera;
    controlsRef.current = controls;
    rendererRef.current = renderer
  };

  const createView = (table: Target[]) => {
    table.forEach((data, i) => {
      const element = document.createElement(
        "data-view.app-wall-card-item"
      ) as AppWallCardItem;
      element.status = data.status;
      element.cardTitle = data.cardItemProps?.cardTitle;
      element.description = data.cardItemProps?.description;
      const statusClass = `status-${data?.status || 'normal'}`
      element.className = `card-item-container  ${statusClass}`;
      element.style.width = `${cardSize.width}px`
      element.style.height = `${cardSize.height}px`
      element.classList.add("card-item-wrap");
      // 随机进入
      const objectCSS = new CSS3DObject(element);
      objectCSS.position.set(4e3 * Math.random() - 2e3, 4e3 * Math.random() - 2e3, 4e3 * Math.random() - 2e3);

      sceneRef.current.add(objectCSS);
      objectsRef.current.push(objectCSS);

      const table = createTableTarget(data, cardSize, configRef.current.maxX, configRef.current.maxY);
      targetsRef.current.table.push(table)
      const curve = createCurveTarget(data, cardSize, configRef.current.maxX, configRef.current.maxY, angle, configRef.current.radius)
      targetsRef.current.curve.push(curve);

      objectCSS.userData = data;
      (element as any).__objectCSS = objectCSS;
      (element as any).__userData = data;
      (element as any).__curve = curve;
    })
  }

  const createRelationLines = (object: CSS3DObject) => {
    const curRelations = getAppRelations(object, relations);
    const userData = object.userData;
    let lineObject: CSS3DObject, lineTarget: CSS3DObject;
    curRelations?.forEach(relation => {
      if (relation.source === userData.key) {
        //获取目标target CSS3DObject
        lineTarget = objectsRef.current.find(o => o.userData.key === relation.target);
        lineObject = lineTarget && createRelationLine(object.position, lineTarget.position, "blue");
      } else {
        lineTarget = objectsRef.current.find(o => o.userData.key === relation.source);
        lineObject = lineTarget && createRelationLine(lineTarget.position, object.position, "purple");
      }
      if (!lineObject) return;
      lineCiCodesRef.current.push(lineObject);
      sceneRef.current.add(lineObject);
    });
    objectsRef.current?.forEach(item => {
      if (object != item && curRelations.every(r => r.source != item.userData.key && r.target != item.userData.key)) {
        item.element.style.opacity = '0.2'
      }
    })
  }

  const showElementBetweenRelation = (target: Element) => {
    const { __objectCSS, __userData } = (target as any)
    const position: Position = {
      x: __objectCSS.position.x + 50 * Math.sin(__objectCSS.rotation.y),
      y: __objectCSS.position.y,
      z: __objectCSS.position.z + 100 * Math.cos(__objectCSS.rotation.y)
    }
    const scale = 1.2;
    new Tween(__objectCSS.rotation).to({
      x: 0,
      y: 0,
      z: 0
    }, 300).onStart(() => {
      __objectCSS.element.classList.add(`status-${__userData.status || 'normal'}-card`);
    }).start();
    new Tween(__objectCSS.scale).to({
      x: scale,
      y: scale,
      z: scale
    }, 300).start();
    new Tween(__objectCSS.position).to(position, 300).onUpdate(render)
      .onComplete(function () {
        //创建连线
        createRelationLines(__objectCSS);
        render()
      }).start()
  }

  const restoreElementState = () => {
    if (!registerEvents.current?.element) return false;
    const { __objectCSS, __curve: object3d, __userData } = (registerEvents.current?.element as any)
    new Tween(__objectCSS.rotation).to({
      x: object3d.rotation.x,
      y: object3d.rotation.y,
      z: object3d.rotation.z
    }, 300).start();
    new Tween(__objectCSS.scale).to({
      x: 1,
      y: 1,
      z: 1
    }, 300).start();
    new Tween(__objectCSS.position).to({
      x: object3d.position.x,
      y: object3d.position.y,
      z: object3d.position.z
    }, 300).onUpdate(render).onStart(() => {
      __objectCSS.element.classList.remove(`status-${__userData.status || 'normal'}-card`);
      objectsRef.current?.forEach(item => {
        item.element.style.opacity = '1';
      })
      lineCiCodesRef.current.forEach((lineObject) => {
        sceneRef.current.remove(lineObject);
      });
      lineCiCodesRef.current = []
      render()
    }).start()
  }

  const transform = (targets: Object3D[], duration: number) => {
    // const preEnable = registerEvents.current.enable;
    // const preEnableShowRelations = registerEvents.current.enableShowRelations;
    registerEvents.current.enable = false;
    registerEvents.current.enableShowRelations = false;
    for (let i = 0; i < objectsRef.current.length; i++) {
      const object = objectsRef.current[i];
      const target = targets[i];

      new Tween(object.position)
        .to({
          x: target.position.x,
          y: target.position.y,
          z: target.position.z
        }, MathUtils.randFloat(duration, duration * 2))
        .easing(Easing.Exponential.InOut)
        .start();

      new Tween(object.rotation)
        .to({
          x: target.rotation.x,
          y: target.rotation.y,
          z: target.rotation.z
        }, MathUtils.randFloat(duration, duration * 2))
        .easing(Easing.Exponential.InOut)
        .start();
    }

    new Tween({})
      .to({}, duration * 2)
      .onUpdate(render)
      .start().onComplete(() => {
        registerEvents.current.enable = true;
        registerEvents.current.enableShowRelations = true;
      });
  }

  const handeReset = () => {
    TWEEN.removeAll();
    const o = {
      opacity: 1
    },
      e = new Tween({
        z: 0
      }),
      n = new Tween(o),
      a = new Tween(cameraRef.current.position),
      i = new Tween(controlsRef.current.target),
      r = new Tween({
        blur: 1500,
        spread: 100
      });
    e.to({
      z: panelSpace
    }, 1e3).chain(a, i, r);
    n.to({
      opacity: 0
    }, 1e3).onStart(() => {
      sceneRef.current.remove(graph3DViewRef.current);
      closeBtnRef.current.style.visibility = "hidden";

    }).delay(300);

    a.to(controlsRef.current.position0, 1e3)
      .onComplete(function () {
        controlsRef.current.reset();
        appwallRef.current.classList.remove('mask-container')
        transform(targetsRef.current.curve, 600)
      });
    i.to({
      x: 0,
      y: 0,
      z: 0
    }, 1e3);
    r.to({
      blur: 0,
      spread: 0
    }, 1e3)
    e.start()
    n.start()
  }
  const showAppInfoAnimate = (toggle: boolean) => {
    controlsRef.current.reset();
    const object = registerEvents.current.element.__objectCSS;
    const target = registerEvents.current.element.__curve;
    registerEvents.current.enable = false
    //定义四个位置
    const c = {
      x: target.position.x > 0 ? 2 * -cardSize.width : 2 * cardSize.width,
      y: 0,
      z: (cameraRef.current.position.z - 500) / 1.5
    };
    const p = {
      x: 0,
      y: 0,
      z: cameraRef.current.position.z - 500
    }
    const h = {
      x: 0,
      y: target.rotation.y > 0 ? -Math.PI * 90 / 180 : Math.PI * 90 / 180,
      z: 0
    }
    const d = {
      x: 0,
      y: target.rotation.y > 0 ? -Math.PI * 180 / 180 : Math.PI * 180 / 180,
      z: 0
    };
    const i = new Tween(object.position);
    const r = new Tween(object.rotation);
    const o = new Tween(object.position);
    const s = new Tween(object.rotation);
    if (toggle) {
      //收
      i.to(c, 500).easing().onStart(function () {

      }).onComplete(() => {
        systemCardRef.current.hidden = true
        registerEvents.current.element.style.opacity = 1;
      });
      r.to(h, 500).easing()
      o.to({
        x: target.position.x,
        y: target.position.y,
        z: target.position.z
      }, 700).easing();
      s.to({
        x: target.rotation.x,
        y: target.rotation.y,
        z: target.rotation.z
      }, 700).easing().onComplete(function () {
        maskRef.current.hidden = true
      });
    } else {
      //出
      i.to(c, 700).easing().onStart(() => {
        //为了飞出去的途中，不能在点击其他的卡片飞出来
        maskRef.current.hidden = false;
        systemCardRef.current.hidden = true;
      });
      r.to(h, 700).easing();
      o.to(p, 500).easing().onStart(function () {
        registerEvents.current.element.style.opacity = 0;
        systemCardRef.current.style.transition = 'transition: all .3s ease';
        systemCardRef.current.hidden = false;
      }).onComplete(function () {
        // console.log('出【o】=>onComplete');
      });
      s.to(d, 500).easing()
    }
    i.chain(o).start();
    r.chain(s).start();
    new Tween({}).to({}, 1400).onUpdate(() => {
      render()
      if (Math.abs(object.rotation.y) >= Math.PI / 2) {
        const rect = registerEvents.current.element.getBoundingClientRect();
        systemCardRef.current.style.width = `${rect.width}px`
        systemCardRef.current.style.height = `${rect.height}px`;
        systemCardRef.current.style.top = `${rect.top}px`;
        systemCardRef.current.style.left = `${rect.left}px`;
      }
    }).start().onComplete(function () {
      registerEvents.current.enableShowRelations = true;
      registerEvents.current.enable = true;
    })
  }

  const resetView = () => {
    controlsRef.current.reset();
    TWEEN.removeAll();
    objectsRef.current.map(o => {
      sceneRef.current.remove(o);
    });
    objectsRef.current = [];
    targetsRef.current = {
      table: [],
      curve: []
    };
    //重置交互状态
    registerEvents.current = {
      element: null,
      mouseoverTimer: null,
      mouseoutTimer: null,
      clickTimer: null,
      dblClickTimer: null,
      enable: true,
      enableShowRelations: true
    }
  }

  useEffect(() => {
    init();

    let cancel: number;
    const animate = () => {
      cancel = requestAnimationFrame(animate);
      TWEEN.update();
      controlsRef.current.update();
    }
    animate();

    const onWindowResize = () => {
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      render();
    };

    controlsRef.current.addEventListener('change', render);
    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('resize', onWindowResize);
      controlsRef.current.removeEventListener('change', render);
      controlsRef.current.dispose();
      TWEEN.removeAll();
      cameraRef.current.clear();
      sceneRef.current.clear();
      cancelAnimationFrame(cancel);
    }
  }, [])

  useEffect(() => {
    const length = props.dataSource?.length || 0;
    updateViewBounds(length);
    cameraRef.current.position.z = computeCameraDistance(cameraRef.current, configRef.current.bounds, distanceConfig, length);

    const appData = setAppPosition(props.dataSource, configRef.current.maxX, configRef.current.maxY);
    createView(appData);
    transform(targetsRef.current.curve, 2000);

    return () => {
      resetView();
    }
  }, [props.dataSource]);

  useEffect(() => {
    const handleMouseover = (e: MouseEvent) => {
      console.log(registerEvents.current)
      if ((!registerEvents.current.enable && !registerEvents.current.enableShowRelations)) return false;
      const target = findElementByEvent(e);
      restoreElementState()
      if (target) {
        registerEvents.current.element = target;
        registerEvents.current.mouseoverTimer && clearTimeout(registerEvents.current.mouseoverTimer)
        registerEvents.current.mouseoverTimer = window.setTimeout(() => {
          showElementBetweenRelation(target);
        }, 500);
      } else {
        registerEvents.current?.mouseoverTimer && clearInterval(registerEvents.current.mouseoverTimer);
        restoreElementState()
      }
    }
    const handleClick = (e: MouseEvent) => {
      if (!registerEvents.current.enable) return false;
      (registerEvents.current.clickTimer && clearTimeout(registerEvents.current.clickTimer), registerEvents.current.mouseoverTimer && clearTimeout(registerEvents.current.mouseoverTimer));
      registerEvents.current.clickTimer = setTimeout(function () {
        const target = findElementByEvent(e) as any;
        if (target) {
          (registerEvents.current.mouseoverTimer && clearTimeout(registerEvents.current.mouseoverTimer))
          e.stopPropagation();
          registerEvents.current.element = target;
          setCurClickCardItemAppData(target.__userData)
          showAppInfoAnimate(false)
        }
      }, 300)
    }
    const handleDbClick = (e: MouseEvent) => {
      if (!registerEvents.current.enable) return false;
      const target = findElementByEvent(e) as any;
      const __userData = target.__userData as Target;
      const __objectCSS = target.__objectCSS as CSS3DObject;
      (registerEvents.current.clickTimer && clearTimeout(registerEvents.current.clickTimer), registerEvents.current.mouseoverTimer && clearTimeout(registerEvents.current.mouseoverTimer), registerEvents.current.dblClickTimer && clearTimeout(registerEvents.current.dblClickTimer));

      if (useDblclick) {
        registerEvents.current.dblClickTimer = window.setTimeout(function () {
          handleCardDbClick(__userData)
        }, 300)
      } else {
        registerEvents.current.dblClickTimer = window.setTimeout(function () {

          if (target) {
            registerEvents.current.enable = false;
            registerEvents.current.enableShowRelations = false;
            (registerEvents.current.mouseoverTimer && clearTimeout(registerEvents.current.mouseoverTimer), registerEvents.current.clickTimer && clearTimeout(registerEvents.current.clickTimer));
            restoreElementState();

            appwallRef.current.classList.add('mask-container')
            controlsRef.current.reset();
            const basePosition = {
              opacity: 0,
              scale: 0,
              borderLeftWidth: 0,
              borderRightWidth: 0,
              borderTopWidth: 0,
              borderBottomWidth: 0
            }
            const u = {
              x: __objectCSS.position.x,
              y: 860 + cardSize.height * (configRef.current.maxY - __userData.y)
            }
            const n = new Tween(cameraRef.current.position);
            const a = new Tween(basePosition);
            const i = new Tween({
              z: 0
            })
            const r = new Tween(cameraRef.current.position);
            const o = new Tween(controlsRef.current.target);
            const s = new Tween({
              blur: 12,
              spread: 0
            });
            transform(targetsRef.current.table, 600)
            n.to({
              x: 0,
              y: -3600,
              z: 1600
            }, 1e3).chain(s, a, i);
            a.to({
              opacity: 1
            }, 700).onStart(() => {
              const objectContainer = createTrapezoidalObject({
                objectData: {
                  width: cardSize.width,
                  height: cardSize.height,
                  point: [__objectCSS.position.x, __objectCSS.position.y, __objectCSS.position.z]
                },
                clusters: __userData.trapezoidalProps?.clusters,
                columns: __userData.trapezoidalProps?.columns,
                leftBtnName: __userData.trapezoidalProps?.leftBtnName,
                rightBtnName: __userData.trapezoidalProps?.rightBtnName,
                rightOnClick: () => rightBtnOnClick(__userData),
                leftOnClick: () => leftBtnOnClick(__userData)
              });
              graph3DViewRef.current = objectContainer;
              sceneRef.current.add(objectContainer)
            })
            i.to({
              z: panelSpace
            }, 1e3).delay(230).chain(r, o);

            r.to({
              x: u.x,
              y: -3600 + u.y
            }, 1e3),
              o.to({
                x: u.x,
                y: u.y
              }, 1e3).onComplete(function () {
                closeBtnRef.current.style.visibility = "visible";
              })
            n.start()
          }
        }, 300)
      }

    }

    containerRef.current.addEventListener('dblclick', handleDbClick)
    containerRef.current.addEventListener('click', handleClick)
    containerRef.current.addEventListener('mouseover', handleMouseover)
    return () => {
      containerRef.current?.removeEventListener('mouseover', handleMouseover)
      containerRef.current?.removeEventListener('click', handleClick)
      containerRef.current?.removeEventListener('dblclick', handleDbClick)
    }
  }, [props.dataSource, useDblclick])

  return (
    <div className="appwall-container" ref={containerRef} >
      <div className="appwall" ref={appwallRef} ></div>
      <div className="mask" ref={maskRef} onClick={() => {
        registerEvents.current.enable && showAppInfoAnimate(true)
      }} hidden={true} >
        <WrappedSystemCard
          {...curClickCardItemAppData?.systemCardProps}
          onClick={(e) => e.stopPropagation()}
          handleClick={() => onSystemCardButtonClick(curClickCardItemAppData)}
          ref={systemCardRef}
          className={classNames({
            infoWrapper: curClickCardItemAppData?.status === "normal",
            warningWrapper: curClickCardItemAppData?.status === "warning"
          })}
        />
      </div>
      <div className="closeBtn" ref={closeBtnRef} onClick={() => {
        handeReset()
      }} />
    </div>
  );
}
