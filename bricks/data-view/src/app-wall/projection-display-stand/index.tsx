import React, {useEffect, useRef} from "react";
import {ReactNextElement, wrapBrick} from "@next-core/react-element";
import {createDecorators, EventEmitter} from "@next-core/element";
import * as THREE from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import {createHelper} from "../helpers.js";
import styleText from "../app-wall.shadow.css";
import {Quaternion, Vector3} from "three";


const {defineElement} = createDecorators();

interface ProjectionDisplayStandProps{
    //
}
/**
 * @id data-view.projection-display-stand
 * @name data-view.projection-display-stand
 * @docKind brick
 * @description
 * @author astrid
 * @noInheritDoc
 */
@defineElement("data-view.projection-display-stand", {
    styleTexts: [styleText],
})
class ProjectionDisplayStand extends ReactNextElement implements ProjectionDisplayStandProps {
    render(): React.ReactNode {
        return <ProjectionDisplayStandComponent />;
    }
}


export  function ProjectionDisplayStandComponent(props: ProjectionDisplayStandProps):React.ReactElement {
    const contentRef = useRef();
    let renderer: any,
        camera: any,
        scene: any,
        light: any,
        controls:  TrackballControls,
        isAutoRotate: boolean,
        cube: any;
    // 初始化render
    const threeInit = (curDom: any) => {
        renderer = new CSS3DRenderer();
        renderer.setSize(curDom.clientWidth, curDom.clientHeight);
        curDom.appendChild(renderer.domElement);
        controls = new TrackballControls(camera, renderer.domElement);
        controls.addEventListener('change',render);
        window.addEventListener('resize',onWindowResize,false);
        render();
    };
    const animate=()=>{
        requestAnimationFrame(animate);
        controls.update();
    }
    const  onWindowResize =  () => {
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth,window.innerHeight);
        render();
    }
    const render= () => {
        renderer.render( scene, camera );
    }

    //初始化相机
    const initCamera = (curDom: any) => {
        camera = new THREE.PerspectiveCamera(45, curDom.clientWidth / curDom.clientHeight, 0.1, 300);
        camera.position.z =2000

    };
    // 初始化场景
    const initScene = () => {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x39609b);
        scene.add(...createHelper());
    };
    // 初始化光线
    const initLight = (myScene: any) => {
        light = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
        myScene.add(light);
    };
    const objectData = [
        // 卡片1
        {
            width: 50, //卡片的宽
            height: 60, //高
            point: [0,0,0] // 中心点位置
        }
    ];
    // const  getCantRightOrLeftObject = (params)=>{
    //     // const position =
    //     const cantLeftCard = document.createElement("div");
    //     cantLeftCard.style.cssText = `
    //                width: ${height}px;
    //                height:${TH}px;
    //                background: linear-gradient(180deg, rgba(51,102,255,0.4) 0%, #99CCFF 100%);
    //                clip-path: polygon(0 0, ${height}px ${(TH/2- BH/2)}px, ${height}px ${(TH/2- BH/2)+BH}px, 0 ${TH}px);
    //                opacity: 0.2;
    //                `;
    //     const  objectCantLeftModal = new CSS3DObject(cantLeftCard);
    //     const pointA = new Vector3(-BW/2, 0,0 );
    //     const pointB = new Vector3(-(TW/2),0 ,d);
    //     const centerVector = new Vector3().lerpVectors(pointA, pointB, 0.5); //中心点位置
    //     objectCantLeftModal.position.copy(centerVector)
    //     const subVector = new Vector3().subVectors(pointA, pointB);
    //     const quaternion = new Quaternion().setFromUnitVectors(new Vector3(1, 0, 0).normalize(), subVector.clone().normalize());
    //     objectCantLeftModal.setRotationFromQuaternion(quaternion);
    //     objectContainer.add(objectCantLeftModal);
    // }


    useEffect(() => {
        if (contentRef && contentRef.current) {
            initCamera(contentRef.current);
            initScene();
            camera.lookAt([0,100,-100]);
            const d = 230;

            const container = document.createElement('div');
            container.className = 'container';
            const objectContainer = new CSS3DObject(container);
            scene.add(objectContainer);
            const axesHelper = new THREE.AxesHelper( 5 );
            scene.add( axesHelper );
            // 模型为梯形 , 底部和顶部的宽高成一定的比例计算，  bw: tw = 1:11; bh:th= 1:4.5
            objectData.forEach((cardItem,cardIndex)=>{

                const  BW = cardItem.width,BH= cardItem.height, TW = BW*11, TH= BH*4.5;
                // 底部
                 const bottomCard = document.createElement('div');
                 bottomCard.style.cssText = `
                   width: ${BW}px;
                   height: ${BH}px;
                   background: #292F39;
                   box-shadow: inset 0px 1px 2px 0px rgba(255,255,255,0.45);
                   border: 1px solid rgba(118,255,255,0.58);
                   `
                 const objectBottomModal= new CSS3DObject(bottomCard);
                 objectBottomModal.position.z= 0;
                 objectContainer.add(objectBottomModal);

                // 顶部
                const topCard = document.createElement('div');
                topCard.style.cssText = `
                   width: ${TW}px;
                   height:${TH}px;
                   background: linear-gradient(180deg, #0D36B3 0%, #4A6C9C 100%);
                   `
                const objectTopModal= new CSS3DObject(topCard);
                objectTopModal.position.set(0,0,d);
                // objectTopModal.rotateX(Math.PI / 2) ; //将屏幕放倒
                // objectTopModal.position.z= 160;
                objectContainer.add(objectTopModal);

                //斜面左边
                const height =  Math.sqrt(Math.pow((TW/2- BW/2),2) + Math.pow(d,2)); //斜边
                const a = (TW -BW) /2;//斜边底
                const b = 200; //斜边高

                const cantLeftCard = document.createElement("div");
                cantLeftCard.style.cssText = `
                   width: ${height}px;
                   height:${TH}px;
                   background: linear-gradient(180deg, rgba(51,102,255,0.4) 0%, #99CCFF 100%);
                   clip-path: polygon(0 0, ${height}px ${(TH/2- BH/2)}px, ${height}px ${(TH/2- BH/2)+BH}px, 0 ${TH}px);
                   opacity: 0.2;
                   `;
                const  objectCantLeftModal = new CSS3DObject(cantLeftCard);
                const pointA = new Vector3(-BW/2, 0,0 );
                const pointB = new Vector3(-(TW/2),0 ,d);
                const centerVector = new Vector3().lerpVectors(pointA, pointB, 0.5); //中心点位置
                objectCantLeftModal.position.copy(centerVector)
                const subVector = new Vector3().subVectors(pointA, pointB);
                const quaternion = new Quaternion().setFromUnitVectors(new Vector3(1, 0, 0).normalize(), subVector.clone().normalize());
                objectCantLeftModal.setRotationFromQuaternion(quaternion);
                objectContainer.add(objectCantLeftModal);
                //斜面右边
                const cantRightCard = document.createElement("div");
                cantRightCard.style.cssText = `
                   width: ${height}px;
                   height:${TH}px;
                   background: linear-gradient(180deg, rgba(51,102,255,0.4) 0%, #99CCFF 100%);
                   clip-path: polygon(0 0, ${height}px ${(TH/2- BH/2)}px, ${height}px ${(TH/2- BH/2)+BH}px, 0 ${TH}px);
                   opacity: 0.2;
                   `;
                const  objectCantRightModal = new CSS3DObject(cantRightCard);
                const _pointA = new Vector3(BW/2, 0,0 );
                const _pointB = new Vector3((TW/2),0 ,d);
                const _centerVector = new Vector3().lerpVectors(_pointA, _pointB, 0.5); //中心点位置
                objectCantRightModal.position.copy(_centerVector)
                const _subVector = new Vector3().subVectors(_pointA, _pointB);
                const _quaternion = new Quaternion().setFromUnitVectors(new Vector3(1, 0, 0).normalize(), _subVector.clone().normalize());
                objectCantRightModal.setRotationFromQuaternion(_quaternion);
                objectContainer.add(objectCantRightModal);
                //斜面前面
                const  h1 = Math.sqrt(Math.pow((TH/2- BH/2),2) + Math.pow(d,2)); //斜边
                const cantTopCard = document.createElement("div");
                cantTopCard.style.cssText = `
                   width: ${TW}px;
                   height:${h1}px;
                   background: linear-gradient(180deg, rgba(51,102,255,0.4) 0%, #99CCFF 100%);
                   clip-path: polygon(0 0, ${TW}px 0, ${(TW/2-BW/2)+BW}px ${h1}px, ${TW/2 -BW/2}px ${h1}px);
                   opacity: 0.2;
                   `;
                const  objectCantTopModal = new CSS3DObject(cantTopCard);
                const topPointA = new Vector3(0, -BH/2,0 );
                const topPointB = new Vector3(0,-TH/2,d);
                const _topCenterVector = new Vector3().lerpVectors(topPointA, topPointB, 0.5); //中心点位置
                objectCantTopModal.position.copy(_topCenterVector)
                const _topSubVector = new Vector3().subVectors(topPointA, topPointB);
                const _topQuaternion = new Quaternion().setFromUnitVectors(new Vector3(0, -1, 0).normalize(), _topSubVector.clone().normalize());
                objectCantTopModal.setRotationFromQuaternion(_topQuaternion);
                objectContainer.add(objectCantTopModal);

                const cantBottomCard = document.createElement("div");
                cantBottomCard.style.cssText = `
                   width: ${TW}px;
                   height:${h1}px;
                   background: linear-gradient(180deg, rgba(51,102,255,0.4) 0%, #99CCFF 100%);
                   clip-path: polygon(0 0, ${TW}px 0, ${(TW/2-BW/2)+BW}px ${h1}px, ${TW/2 -BW/2}px ${h1}px);
                   opacity: 0.2;
                   `;
                const  objectCantBottomModal = new CSS3DObject(cantBottomCard);
                const bottomPointA = new Vector3(0, BH/2,0 );
                const bottomPointB = new Vector3(0,TH/2,d);
                const _bottomCenterVector = new Vector3().lerpVectors(bottomPointA, bottomPointB, 0.5); //中心点位置
                objectCantBottomModal.position.copy(_bottomCenterVector)
                const _bottomSubVector = new Vector3().subVectors(bottomPointA, bottomPointB);
                const _bottomQuaternion = new Quaternion().setFromUnitVectors(new Vector3(0, -1, 0).normalize(), _bottomSubVector.clone().normalize());
                objectCantBottomModal.setRotationFromQuaternion(_bottomQuaternion);
                objectContainer.add(objectCantBottomModal);

                // 文字按钮

                const btnLeft = document.createElement("div");
                btnLeft.style.cssText = `
                 color: #6BE0FA;
                 font-size: 16px;
                 font-weight: 500;
                 width: ${TW/2}px;
                 `;
                // icon
                const iconNode = document.createElement("icons.general-icon") as GeneralIcon;
                iconNode.lib = "easyops";
                iconNode.icon="logout";
                iconNode.category = "default";
                btnLeft.appendChild(iconNode);
                const wordNode = document.createElement("div");
                wordNode.innerText = "应用健康监控大屏";
                btnLeft.appendChild(wordNode);
                const  btnModal = new CSS3DObject(btnLeft);
                btnModal.position.set(-TW/4 + 10, -TH/2, d+10);
                btnModal.rotateX(Math.PI / 2) ;
                objectContainer.add(btnModal);
            });
            threeInit(contentRef.current);
            // render();
            animate();
        }
    },[contentRef]);

    useEffect(() => {
        if (scene) {
            initLight(scene);
        }
    }, [scene]);

    return <div ref={contentRef} style={{ width: '100vw', height: '100vh', position: 'relative' }} />
}

export {ProjectionDisplayStand}
