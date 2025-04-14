import React, { useEffect, useRef, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import classNames from "classnames";
import "@next-core/theme";
import type {
  ExtendedLocationDescriptor,
  Link,
  LinkProps,
  Target,
} from "../link";
import styleText from "./styles.shadow.css";

const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");

const { defineElement, property } = createDecorators();

export interface CardBoxProps
  extends Pick<LinkProps, "url" | "href" | "target"> {
  // Define props here.
}

/**
 * 卡片项容器
 *
 * @slot avatar - 头像
 * @slot title - 标题
 * @slot description - 描述
 * @slot - 内容区
 * @slot footer - 底部
 */
export
@defineElement("eo-card-box", {
  styleTexts: [styleText],
})
class CardBox extends ReactNextElement implements CardBoxProps {
  /**
   * 链接地址
   */
  @property({
    attribute: false,
  })
  accessor url: ExtendedLocationDescriptor | undefined;

  /**
   * 设置 `href` 时将使用原生 `<a>` 标签，通常用于外链的跳转
   */
  @property() accessor href: string | undefined;

  /**
   * 链接跳转目标
   */
  @property() accessor target: Target | undefined;

  /** 是否铺满容器 */
  @property({ type: Boolean, render: false })
  accessor fillContainer: boolean | undefined;

  render() {
    return (
      <CardBoxComponent url={this.url} href={this.href} target={this.target} />
    );
  }
}

export interface CardBoxComponentProps extends CardBoxProps {
  // Define react event handlers here.
}

export function CardBoxComponent({ url, href, target }: CardBoxComponentProps) {
  const slotsRef = useRef(new Map<string, HTMLSlotElement | null>());
  const [slotsMap, setSlotsMap] = useState(() => new Map<string, boolean>());

  useEffect(() => {
    const slots = ["avatar", "title", "description", "", "footer"];
    const disposables: (() => void)[] = [];

    for (const slot of slots) {
      const slotElement = slotsRef.current.get(slot);
      if (slotElement) {
        const onSlotChange = () => {
          setSlotsMap((prev) => {
            const prevHas = prev.get(slot) ?? false;
            const currentHas = slotElement.assignedNodes().length > 0;
            return prevHas === currentHas
              ? prev
              : new Map(prev).set(slot, currentHas);
          });
        };
        slotElement.addEventListener("slotchange", onSlotChange);
        onSlotChange();
        disposables.push(() => {
          slotElement.removeEventListener("slotchange", onSlotChange);
        });
      }
    }

    return () => {
      disposables.forEach((dispose) => dispose());
    };
  });

  const refCallbackFactory =
    (slot: string) => (element: HTMLSlotElement | null) => {
      slotsRef.current.set(slot, element);
    };

  const getSlotContainerClassName = (slot: string, className?: string) => {
    return classNames(className ?? slot, { hidden: !slotsMap.get(slot) });
  };

  const getSlotsContainerClassName = (slots: string[], className: string) => {
    return classNames(className, {
      hidden: slots.every((slot) => !slotsMap.get(slot)),
    });
  };

  return (
    <WrappedLink
      className={classNames("box", { clickable: !!(url || href) })}
      type="plain"
      url={url}
      href={href}
      target={target}
    >
      {/* <div className="header">
        <slot name="header" />
      </div>
      <div className="cover">
        <slot name="cover" />
      </div> */}
      <div
        className={getSlotsContainerClassName(
          ["avatar", "title", "description"],
          "body"
        )}
      >
        <div className={getSlotContainerClassName("avatar")}>
          <slot name="avatar" ref={refCallbackFactory("avatar")} />
        </div>
        <div
          className={getSlotsContainerClassName(
            ["title", "description"],
            "detail"
          )}
        >
          <div className={getSlotContainerClassName("title")}>
            <slot name="title" ref={refCallbackFactory("title")} />
          </div>
          <div className={getSlotContainerClassName("description")}>
            <slot name="description" ref={refCallbackFactory("description")} />
          </div>
        </div>
      </div>
      <div className={getSlotContainerClassName("", "content")}>
        <slot ref={refCallbackFactory("")} />
      </div>
      <div className={getSlotContainerClassName("footer")}>
        <slot name="footer" ref={refCallbackFactory("footer")} />
      </div>
    </WrappedLink>
  );
}
