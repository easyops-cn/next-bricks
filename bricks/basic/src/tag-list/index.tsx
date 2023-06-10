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
import "@next-core/theme";

const { defineElement, property, event } = createDecorators();

const WrappedTag = wrapBrick<Tag, TagProps, TagEvents, TagMapEvents>(
  "basic.general-tag",
  {
    onCheck: "check",
    onClose: "close",
  }
);

type tagListItem = TagProps & { text: string; key?: string };

interface TagListComponentProps {
  list?: Array<tagListItem | string>;
  multiple?: boolean;
}

/**
 * @id basic.general-tag-list
 * @name basic.general-tag-list
 * @docKind brick
 * @description 标签列表构件
 * @author sailor
 */
@defineElement("basic.general-tag-list", {
  styleTexts: [],
})
class TagList extends ReactNextElement {
  /**
   * 标签列表
   */
  @property({
    attribute: false,
  })
  accessor list: Array<tagListItem | string> | undefined;

  /**
   * 按钮大小
   * @default "medium"
   */
  @property() accessor size: ComponentSize | undefined;

  /**
   * 颜色
   */
  @property()
  accessor color: TagColor | string | undefined;

  /**
   * 是否禁用
   */
  @property({
    type: Boolean,
  })
  accessor disabled: boolean | undefined;

  /**
   * 是否允许关闭
   */
  @property({
    type: Boolean,
  })
  accessor closable: boolean | undefined;

  /**
   * 是否允许选择
   */
  @property({
    type: Boolean,
  })
  accessor checkable: boolean | undefined;

  /**
   * 是否允许多选
   */
  @property({
    type: Boolean,
  })
  accessor multiple: boolean | undefined;

  /**
   * 标签自定义样式
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
   */
  @event({ type: "check" })
  accessor #checkEvent!: EventEmitter<{
    item: tagListItem | string | undefined;
    list: tagListItem[];
  }>;

  handleCheck = (item: tagListItem, list: tagListItem[]): void => {
    this.#checkEvent.emit({
      item: this.#matchItem(item.text),
      list,
    });
  };

  /**
   * 关闭标签事件
   */
  @event({ type: "close" })
  accessor #closeEvent!: EventEmitter<{
    item: tagListItem | string | undefined;
    list: tagListItem[];
  }>;

  handleClose = (item: tagListItem, list: tagListItem[]): void => {
    this.#closeEvent.emit({
      item: this.#matchItem(item.text),
      list,
    });
  };

  render() {
    return (
      <TagListComponent
        list={this.list}
        size={this.size}
        color={this.color}
        disabled={this.disabled}
        closable={this.closable}
        checkable={this.checkable}
        multiple={this.multiple}
        tagStyle={this.tagStyle}
        onCheck={this.handleCheck}
        onClose={this.handleClose}
      />
    );
  }
}

function TagListComponent({
  list,
  size = "medium",
  color,
  disabled,
  closable,
  checkable,
  multiple = true,
  tagStyle,
  onCheck,
  onClose,
}: TagListComponentProps &
  TagProps & {
    onCheck: (item: tagListItem, list: tagListItem[]) => void;
    onClose: (item: tagListItem, list: tagListItem[]) => void;
  }) {
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
    (tag: tagListItem): void => {
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
    (tag: tagListItem) => {
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
            disabled={disabled}
            closable={closable}
            checkable={checkable}
            tagStyle={tagStyle}
            key={index}
            {...tag}
            onCheck={() => handleCheck(tag)}
            onClose={() => handleClose(tag)}
          >
            {tag.text}
          </WrappedTag>
        );
      })}
    </div>
  );
}

export { TagList };
