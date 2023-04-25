import React from "react";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { createDecorators, EventEmitter } from "@next-core/element";
import styleText from "./system-card.shadow.css";
import classNames from "classnames";
import variablesStyleText from "../../data-view-variables.shadow.css";
import type {
    GeneralIcon,
    GeneralIconProps
} from "@next-bricks/icons/general-icon";

const { defineElement, property, event } = createDecorators();
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
    "icons.general-icon"
);
type StatusType = "normal" | "warning"
interface DescriptionItem {
    key: string;
    value: string;

}
export interface SystemCardProps {
    status: StatusType;
    cardTitle: string | undefined;
    itemList?: DescriptionItem[];
    buttonName?: string;
    handleClick?: () => void;
    containerStyle?: React.CSSProperties;
}

/**
 * @id data-view.app-wall-system-card
 * @name data-view.app-wall-system-card
 * @docKind brick
 * @description
 * @author astrid
 * @noInheritDoc
 */
@defineElement("data-view.app-wall-system-card", {
    styleTexts: [variablesStyleText, styleText],
})
class SystemCard extends ReactNextElement implements SystemCardProps {
    /**
     * @kind StatusType
     * @required true
     * @default normal
     * @description 卡片状态
     * @enums
     * @group basic
     */
    @property({ attribute: false })
    accessor status: StatusType = "normal";

    /**
     * @kind string
     * @required -
     * @default -
     * @description 卡片标题
     * @enums
     * @group basic
     */
    @property()
    accessor cardTitle: string | undefined;

    /**
     * @kind DescriptionItem[]
     * @required false
     * @default -
     * @description 卡片信息数据
     * @enums
     * @group basic
     */
    @property({ attribute: false })
    accessor itemList: DescriptionItem[];

    /**
     * @kind string
     * @required -
     * @default -
     * @description 按钮名称
     * @enums
     * @group basic
     */
    @property()
    accessor buttonName: string | undefined;

    /**
     * @kind React.CSSProperties
     * @required -
     * @default -
     * @description 外层容器样式
     * @enums
     * @group basic
     */
    @property({ attribute: false })
    accessor containerStyle: React.CSSProperties;

    /**
     * @detail
     * @description 按钮点击
     */
    @event({ type: "button-click" })
    accessor #onClickEvent!: EventEmitter<void>;

    handleClick = () => {
        this.#onClickEvent.emit();
    }


    render(): React.ReactNode {
        return <SystemCardComponent
            buttonName={this.buttonName}
            status={this.status}
            cardTitle={this.cardTitle}
            itemList={this.itemList}
            handleClick={this.handleClick}
            containerStyle={this.containerStyle}
        />;
    }
}

export function SystemCardComponent(props: SystemCardProps): React.ReactElement {
    const { status, itemList, cardTitle, buttonName, handleClick, containerStyle } = props;
    return (
            <div className={classNames("wrapper", )} style={containerStyle}>
                <div className="cardName">{cardTitle}</div>
                <div className="descriptions">
                    {
                        itemList?.map((item, index) => (
                            <div key={index} className="descriptionsItem">
                                <div className="itemKey">{item.key}</div>
                                <div className="itemValue">{item.value}</div>
                            </div>))
                    }
                </div>
                {
                    buttonName &&
                    <div className="buttonContent" onClick={handleClick}>
                        <WrappedIcon lib="antd" icon="fall" theme="outlined" />
                        <span className="buttonName">{buttonName}</span>
                    </div>
                }
            </div>

    )
}

export { SystemCard }
