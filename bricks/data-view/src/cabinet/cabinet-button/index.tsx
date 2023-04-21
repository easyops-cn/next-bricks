import React from "react";
import {ReactNextElement} from "@next-core/react-element";
import {createDecorators} from "@next-core/element";
import styleText from "./cabinet-button.shadow.css";
import variablesStyleText from "../../data-view-variables.shadow.css";

const {defineElement, property} = createDecorators();

export interface CabinetButtonProps {
    buttonStyle?: React.CSSProperties
}

/**
 * @id data-view.cabinet-button
 * @name data-view.cabinet-button
 * @docKind brick
 * @description 大屏按钮
 * @author astrid
 * @noInheritDoc
 */
@defineElement("data-view.cabinet-button", {
    styleTexts: [variablesStyleText,styleText],
})
class CabinetButton extends ReactNextElement implements CabinetButtonProps {
    /**
     * @kind React.CSSProperties
     * @required false
     * @default  -
     * @description 按钮的样式
     */
    @property({attribute: false})
    accessor buttonStyle: React.CSSProperties;

    render(): React.ReactNode {
        return <span className="closeBtn" style={this.buttonStyle} />
    }
}

export {CabinetButton}

