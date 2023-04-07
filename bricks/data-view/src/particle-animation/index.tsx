import React from "react";
import {createDecorators} from "@next-core/element";
import {ReactNextElement} from "@next-core/react-element";
import styleText from "./particle-animation.shadow.css";
import variablesStyleText from "../data-view-variables.shadow.css";

const {defineElement, property} = createDecorators();

export interface ColorType {
    startColor: React.CSSProperties["color"];
    middleColor: React.CSSProperties["color"];
    endColor: React.CSSProperties["color"];
}

interface ParticleAnimationProps {
    colors: ColorType;
    containerStyle?: React.CSSProperties;
}


/**
 * @id data-view.particle-animation
 * @name data-view.particle-animation
 * @docKind brick
 * @description 大屏粒子加载动效
 * @author astrid
 * @noInheritDoc
 */
@defineElement("data-view.particle-animation", {
    styleTexts: [variablesStyleText, styleText],
})
class ParticleAnimation extends ReactNextElement implements ParticleAnimationProps {
    /**
     * @kind ColorType
     * @default -
     * @required true
     * @description 颜色配置，由于光标有三段颜色，中间色段为也为特效中光点的颜色
     */
    @property({attribute: false})
    accessor colors: ColorType;

    /**
     * @kind React.CSSProperties
     * @default -
     * @required false
     * @description 容器样式
     */
    @property({attribute: false})
    accessor containerStyle: React.CSSProperties;

    render(): React.ReactNode {
        return <ParticleAnimationComponent colors={this.colors} containerStyle={this.containerStyle}/>;
    }
}

export function ParticleAnimationComponent(props: ParticleAnimationProps): React.ReactElement {
    const {colors, containerStyle} = props;
    // 竖线粒子
    const particlePositionList = [
        {
            h: 29,
            w: 1,
            left: "10%",
            bottom: "5%"
        },
        {
            h: 23,
            w: 2,
            left: "45%",
            bottom: "0"
        },
        {
            h: 29,
            w: 2,
            left: "90%",
            bottom: "20%"
        },
        {
            h: 23,
            w: 1,
            left: "40%",
            bottom: "20%"
        },
        {
            h: 42,
            w: 3,
            left: "50%",
            bottom: "30%"
        }
    ];
    // 原点粒子个数
    const randomParticleList = new Array(8).fill(2);
    return <div className="animation-wrapper" style={containerStyle}>
        {
            particlePositionList.map((particle, index) => {
                const particleStyle = {
                    width: `${particle.w}px`,
                    height: `${particle.h}px`,
                    background: `linear-gradient(0deg,  ${colors.startColor} 0%, ${colors.middleColor} 72%,  ${colors.endColor} 100%)`
                }
                return <div className="particle-wrapper"
                            key={index}
                            style={{
                                width: `${particle.w}px`,
                                height: `${particle.h * 2}px`,
                                bottom: particle.bottom,
                                left: particle.left,
                            }}
                >
                    <div className="particle" style={particleStyle}/>
                    <div className="delay" style={particleStyle}/>
                </div>
            })}
        <div className="circle-container" style={{color: colors.middleColor}}>
            {
                randomParticleList.map((circle, index) => (<div className="circle" key={index}/>))
            }
        </div>
        <slot/>
    </div>
}


export {ParticleAnimation}
