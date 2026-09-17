import React, { useCallback, useEffect, useMemo, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import {
  TagColor,
  Tag,
  TagProps,
  TagEvents,
  TagMapEvents,
} from "../tag/index.js";
import { ComponentSize } from "../interface.js";
import styleText from "./index.shadow.css";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import "@next-core/theme";

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

const { defineElement, property, event } = createDecorators();

const WrappedTag = wrapBrick<Tag, TagProps, TagEvents, TagMapEvents>("eo-tag", {
  onCheck: "check",
  onClose: "close",
});

export type TagListItem = TagProps & { text: string; key?: string };

export interface TagListProps
  extends Pick<
    TagProps,
    | "size"
    | "color"
    | "outline"
    | "disabled"
    | "closable"
    | "checkable"
    | "tagStyle"
  > {
  list?: Array<TagListItem | string>;
  showTagCircle?: boolean;
  multiple?: boolean;
}

export interface TagListEvents {
  check: CustomEvent<{
    item: TagListItem | string | undefined;
    list: TagListItem[];
  }>;
  close: CustomEvent<{
    item: TagListItem | string | undefined;
    list: TagListItem[];
  }>;
  "tag.click": CustomEvent<TagListItem | string | undefined>;
}

export interface TagListEventsMapping {
  onCheck: "check";
  onClose: "close";
  onTagClick: "tag.click";
}

/**
 * 标签列表构件
 * @en Tag list brick
 * @author sailor
 *
 * @category display-component
 */
@defineElement("eo-tag-list", {
  alias: ["basic.general-tag-list"],
  styleTexts: [styleText],
})
class TagList extends ReactNextElement implements TagListProps {
  /**
   * 标签列表
   * @en Tag list
   */
  @property({
    attribute: false,
  })
  accessor list: Array<TagListItem | string> | undefined;

  /**
   * 按钮大小
   * @en Button size
   * @default "medium"
   */
  @property() accessor size: ComponentSize | undefined;

  /**
   * 颜色
   * @en Color
   */
  @property()
  accessor color: TagColor | string | undefined;

  /**
   * 是否有边线
   * @en Whether it has an outline
   */
  @property({
    type: Boolean,
  })
  accessor outline: boolean | undefined;

  /**
   * 显示圆点
   * @en Show the circle dot
   */
  @property({
    type: Boolean,
  })
  accessor showTagCircle: boolean | undefined;

  /**
   * 是否禁用
   * @en Whether it is disabled
   */
  @property({
    type: Boolean,
  })
  accessor disabled: boolean | undefined;

  /**
   * 是否允许关闭
   * @en Whether it can be closed
   */
  @property({
    type: Boolean,
  })
  accessor closable: boolean | undefined;

  /**
   * 是否允许选择
   * @en Whether it can be checked
   */
  @property({
    type: Boolean,
  })
  accessor checkable: boolean | undefined;

  /**
   * 是否允许多选
   * @en Whether multiple selection is allowed
   */
  @property({
    type: Boolean,
  })
  accessor multiple: boolean | undefined;

  /**
   * 标签自定义样式
   * @en Custom tag style
   */
  @property({
    attribute: false,
  })
  accessor tagStyle: React.CSSProperties | undefined;

  #matchItem(text: string) {
    return this.list?.find((listItem) =>
      typeof listItem === "string" ? listItem === text : listItem.text === text
    );
  }

  /**
   * 选择标签事件
   * @en Tag check event
   * @detail { item: 被选中/取消选中的标签项, list: 当前所有选中的标签列表 }
   * @detailEn { item: The checked/unchecked tag item, list: The list of all currently checked tags }
   */
  @event({ type: "check" })
  accessor #checkEvent!: EventEmitter<{
    item: TagListItem | string | undefined;
    list: TagListItem[];
  }>;

  handleCheck = (item: TagListItem, list: TagListItem[]): void => {
    this.#checkEvent.emit({
      item: this.#matchItem(item.text),
      list,
    });
  };

  /**
   * 关闭标签事件
   * @en Tag close event
   * @detail { item: 被关闭的标签项, list: 关闭后剩余的标签列表 }
   * @detailEn { item: The closed tag item, list: The list of remaining tags after closing }
   */
  @event({ type: "close" })
  accessor #closeEvent!: EventEmitter<{
    item: TagListItem | string | undefined;
    list: TagListItem[];
  }>;

  handleClose = (item: TagListItem, list: TagListItem[]): void => {
    this.#closeEvent.emit({
      item: this.#matchItem(item.text),
      list,
    });
  };

  /**
   * 点击标签事件
   * @en Tag click event
   * @detail 被点击的标签项
   * @detailEn The clicked tag item
   */
  @event({ type: "tag.click" })
  accessor #tagClickEvent!: EventEmitter<TagListItem | string | undefined>;

  handleTagClick = (item: TagListItem): void => {
    this.#tagClickEvent.emit(this.#matchItem(item.text));
  };

  render() {
    return (
      <TagListComponent
        list={this.list}
        size={this.size}
        color={this.color}
        outline={this.outline}
        disabled={this.disabled}
        showTagCircle={this.showTagCircle}
        closable={this.closable}
        checkable={this.checkable}
        multiple={this.multiple}
        tagStyle={this.tagStyle}
        onCheck={this.handleCheck}
        onClose={this.handleClose}
        onTagClick={this.handleTagClick}
      />
    );
  }
}

interface TagListComponentProps extends TagListProps {
  onCheck: (item: TagListItem, list: TagListItem[]) => void;
  onClose: (item: TagListItem, list: TagListItem[]) => void;
  onTagClick: (item: TagListItem) => void;
}

function TagListComponent({
  list,
  size = "medium",
  color,
  outline,
  disabled,
  closable,
  checkable,
  showTagCircle,
  multiple = true,
  tagStyle,
  onCheck,
  onClose,
  onTagClick,
}: TagListComponentProps) {
  const [tagList, setTagList] = useState(list ?? []);
  const computedList = useMemo(() => {
    return (
      tagList?.map((item) => {
        return typeof item === "string"
          ? {
              text: item,
              key: item,
            }
          : item;
      }) ?? []
    );
  }, [tagList]);

  const handleCheck = useCallback(
    (tag: TagListItem): void => {
      if (multiple) {
        tag.checked = !tag.checked;
      } else {
        setTagList(
          computedList.map((item) => {
            if (tag.key === item.key) {
              item.checked = true;
            } else {
              item.checked = false;
            }
            return item;
          })
        );
      }
      onCheck?.(
        tag,
        computedList?.filter((item) => item.checked && !item.hidden)
      );
    },
    [computedList, multiple, onCheck]
  );

  const handleClose = useCallback(
    (tag: TagListItem) => {
      tag.hidden = !tag.hidden;
      if (tag.checked) {
        handleCheck(tag);
      }
      onClose?.(
        tag,
        computedList?.filter((item) => !item.hidden)
      );
    },
    [computedList, handleCheck, onClose]
  );

  useEffect(() => {
    list && setTagList(list);
  }, [list]);

  return (
    <div className="tag-list">
      {computedList.map((tag, index) => {
        return (
          <WrappedTag
            size={size}
            color={color}
            outline={outline}
            disabled={disabled}
            closable={closable}
            checkable={checkable}
            tagStyle={tagStyle}
            key={index}
            {...tag}
            onCheck={() => handleCheck(tag)}
            onClose={() => handleClose(tag)}
            onClick={() => onTagClick(tag)}
          >
            {showTagCircle && (
              <WrappedIcon
                className="tag-circle"
                lib="fa"
                icon="circle"
                prefix="fas"
              />
            )}
            {tag.text}
          </WrappedTag>
        );
      })}
    </div>
  );
}

export { TagList };
