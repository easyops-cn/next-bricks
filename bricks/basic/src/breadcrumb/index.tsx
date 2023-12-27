import React, { useEffect, useRef } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { symbolUseInGroup } from "../breadcrumb-item/index.js";

const { defineElement } = createDecorators();

/**
 * 面包屑容器
 *
 * @slot 面包屑项，可使用 eo-breadcrumb-item 构件
 * @slot separator - 分隔符，默认为 /
 */
export
@defineElement("eo-breadcrumb", {
  styleTexts: [styleText],
})
class EoBreadcrumb extends ReactNextElement {
  render() {
    return <EoBreadcrumbComponent />;
  }
}

export function EoBreadcrumbComponent() {
  const defaultSlotRef = useRef<HTMLSlotElement>(null);
  const separatorSlotRef = useRef<HTMLSlotElement>(null);

  const getSeparator = () => {
    const separators = separatorSlotRef.current?.assignedElements({
      flatten: true,
    });

    const clonedSeparators = separators?.map((separator) => {
      const clonedSeparator = separator.cloneNode(true) as HTMLElement;
      clonedSeparator.slot = "group-separator";
      return clonedSeparator;
    });
    return clonedSeparators || [];
  };

  const replaceSeparator = () => {
    const breadcrumbItems = [
      ...defaultSlotRef.current!.assignedElements(),
    ].filter((element) => element.tagName === "EO-BREADCRUMB-ITEM");

    breadcrumbItems.forEach((breadcrumbItem) => {
      (breadcrumbItem as any)[symbolUseInGroup] = true;

      const itemSeparators = breadcrumbItem.querySelectorAll(
        "[slot='group-separator']"
      );

      itemSeparators.forEach((itemSeparator) => itemSeparator.remove());

      breadcrumbItem.append(...getSeparator());
    });
  };

  useEffect(() => {
    const defaultSlot = defaultSlotRef.current!;
    const separatorSlot = separatorSlotRef.current!;

    const handleSlotChange = () => {
      replaceSeparator();
    };

    defaultSlot?.addEventListener("slotchange", handleSlotChange);
    separatorSlot?.addEventListener("slotchange", handleSlotChange);

    return () => {
      defaultSlot?.removeEventListener("slotchange", handleSlotChange);
      separatorSlot?.removeEventListener("slotchange", handleSlotChange);
    };
  }, []);

  return (
    <>
      <nav>
        <slot ref={defaultSlotRef} />
      </nav>
      <span hidden>
        <slot name="separator" ref={separatorSlotRef}>
          /
        </slot>
      </span>
    </>
  );
}
