import React, { ReactElement, useCallback, useEffect, useRef } from "react";
import { Object3D, PerspectiveCamera, Scene } from "three";
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { Tween, Easing, update, removeAll } from "@tweenjs/tween.js";
import type { AppWallProps } from "./index.jsx";
import { BaseConfig, CardSize, DistanceConfig, Target, Targets } from "./interface.js";
import { computeCameraDistance, createCurveTarget, createTableTarget, createTrapezoidalObject, setAppPosition } from "./utils.js";
import { AppWallCardItem } from "./card-item/index.jsx";
import "./card-item/index.js";


const table = Array.from({
    length: 262
}).map((v, i) => ({
    shortName: `shortName-${i}`,
    status: i % 5 ? 'normal' : 'warning',
    cardTitle: 'cardTitle',
    description: 'description'
}));
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
let currentEle

export function AppWallElement(props: AppWallProps): ReactElement {
    const containerRef = useRef<HTMLDivElement>();
    const closeBtnRef = useRef<HTMLDivElement>()

    const rendererRef = useRef<CSS3DRenderer>();
    const sceneRef = useRef<Scene>();
    const cameraRef = useRef<PerspectiveCamera>();
    const controlsRef = useRef<TrackballControls>();
    const graph3DViewRef = useRef<CSS3DObject>(); // 梯形模型
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
    const targetsRef = useRef<Targets>({
        table: [],
        curve: []
    });
    const objectsRef = useRef<CSS3DObject[]>([]);

    const render = useCallback(() => {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
    }, []);

    const onWindowResize = useCallback(() => {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        render();
    }, [render]);

    const initViewBounds = useCallback((length: number) => {
        const maxX = Math.ceil(Math.sqrt(length * cardSize.outerHeight / (.4 * cardSize.outerWidth)));
        const maxY = Math.ceil(length / maxX);
        const radius = parseInt(`${maxX * cardSize.outerWidth * 180}`) / (angle * Math.PI);
        const width = 2 * radius * Math.sin(Math.PI * (angle / 2) / 180) + cardSize.outerWidth;
        const height = maxY * cardSize.outerHeight;
        const z = radius - radius * Math.cos(Math.PI * (angle / 2) / 180);
        configRef.current = {
            maxX,
            maxY,
            radius,
            bounds: {
                width,
                height,
                margin: 100,
                z
            }
        }
    }, [])

    const init = useCallback((length: number) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const aspect = width / height;

        const renderer = new CSS3DRenderer();
        renderer.setSize(width, height);
        containerRef.current.appendChild(renderer.domElement);

        const camera = new PerspectiveCamera(fov, aspect, .1, 10000);
        camera.position.z = computeCameraDistance(camera, configRef.current.bounds, distanceConfig, length);

        const controls = new TrackballControls(camera, renderer.domElement);
        controls.rotateSpeed = .5;
        controls.minDistance = 500;
        controls.maxDistance = 10000;
        const scene = new Scene();

        sceneRef.current = scene;
        cameraRef.current = camera;
        controlsRef.current = controls;
        rendererRef.current = renderer

    }, []);

    const createView = useCallback((table: Target[]) => {
        table.forEach((data, i) => {
            const element = document.createElement(
                "data-view.app-wall-card-item"
            ) as AppWallCardItem;
            element.status = data.status;
            //element.cardTitle = data.cardItemProps?.cardTitle;
            element.cardTitle = `${i}`;
            element.description = data.cardItemProps?.description;
            const statusClass = `status-${data?.status || 'normal'}`
            element.className = `card-item-container  ${statusClass}`;
            element.style.width = `${cardSize.width}px`
            element.style.height = `${cardSize.height}px`
            element.classList.add("card-item-wrap");
            element.addEventListener('pointerdown', (e) => {
                controlsRef.current.reset();
                controlsRef.current.enabled = false;
                currentEle = e.target;

                const basePosition = {
                    opacity: 0,
                    scale: 0,
                    borderLeftWidth: 0,
                    borderRightWidth: 0,
                    borderTopWidth: 0,
                    borderBottomWidth: 0
                }
                const u = {
                    x: objectCSS.position.x,
                    y: 860 + cardSize.height * (configRef.current.maxY - data.y)
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
                            point: [objectCSS.position.x, objectCSS.position.y, objectCSS.position.z]
                        },
                        leftBtnName: '左边',
                        rightBtnName: 'right',
                        rightOnClick: () => { },
                        leftOnClick: () => { }
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
                        controlsRef.current.enabled = true;
                        closeBtnRef.current.style.visibility = "visible";
                    })
                n.start()
            })

            // 随机进入
            const objectCSS = new CSS3DObject(element);
            objectCSS.position.set(4e3 * Math.random() - 2e3, 4e3 * Math.random() - 2e3, 4e3 * Math.random() - 2e3);

            sceneRef.current.add(objectCSS);
            objectsRef.current.push(objectCSS);

            const table = createTableTarget(data, cardSize, configRef.current.maxX, configRef.current.maxY);
            targetsRef.current.table.push(table)
            const curve = createCurveTarget(data, cardSize, configRef.current.maxX, configRef.current.maxY, angle, configRef.current.radius)
            targetsRef.current.curve.push(curve)
        })
    }, [])

    const transform = useCallback((targets: Object3D[], duration: number) => {
        for (let i = 0; i < objectsRef.current.length; i++) {
            const object = objectsRef.current[i];
            const target = targets[i];

            new Tween(object.position)
                .to({
                    x: target.position.x,
                    y: target.position.y,
                    z: target.position.z
                }, Math.random() * duration + duration)
                .easing(Easing.Exponential.InOut)
                .start();

            new Tween(object.rotation)
                .to({
                    x: target.rotation.x,
                    y: target.rotation.y,
                    z: target.rotation.z
                }, Math.random() * duration + duration)
                .easing(Easing.Exponential.InOut)
                .start();

        }

        new Tween({})
            .to({}, duration * 2)
            .onUpdate(render)
            .start();

    }, [render]);

    const handeReset = useCallback(() => {
        removeAll();
        controlsRef.current.enabled = false;
        var o = {
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
        }, 1e3).onStart(()=>{
            sceneRef.current.remove(graph3DViewRef.current);
            closeBtnRef.current.style.visibility = "hidden";
        }).delay(300);

        a.to(controlsRef.current.position0, 1e3)
            .onComplete(function () {
                transform(targetsRef.current.curve, 600)
                controlsRef.current.reset();
                controlsRef.current.enabled = true;
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
    }, [])

    useEffect(() => {
        initViewBounds(table.length);
        init(table.length);
        const configBound = configRef.current
        // const appData = setAppPosition(table as any, configBound.maxX, configBound.maxY);
        const appData = setAppPosition(props.dataSource, configBound.maxX, configBound.maxY);
        createView(appData);
        console.log(targetsRef.current)
        transform(targetsRef.current.curve, 2000);
    }, [props.dataSource,])

    useEffect(() => {
        let cancel: number;
        const animate = () => {
            cancel = requestAnimationFrame(animate);
            update()
            controlsRef.current.update();
        }
        animate()
        controlsRef.current.addEventListener('change', render);
        window.addEventListener('resize', onWindowResize);
        return () => {
            controlsRef.current.removeEventListener('change', render);
            window.removeEventListener('resize', onWindowResize);
            cancelAnimationFrame(cancel);
        }
    }, [render, onWindowResize])

    return (
        <>
            <div className="container" ref={containerRef} ></div>
            <div className="closeBtn" ref={closeBtnRef} onClick={() => {
                handeReset()
            }} />
        </>
    );
}