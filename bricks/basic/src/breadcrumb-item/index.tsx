import React, { Ref, useEffect, useMemo, useRef, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import type { Target } from "../interface.js";
import type { Link, LinkProps } from "../link/index.jsx";
import type { ExtendedLocationDescriptor } from "../link/getExtendedLocationDescriptor.js";

const { defineElement, property } = createDecorators();

const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");

export const symbolUseInGroup = Symbol("use-in-breadcrumb-group");

export interface BreadcrumbItemProps {
  url?: ExtendedLocationDescriptor;
  href?: string;
  target?: Target;
}

/**
 * 面包屑单项
 *
 * @slot prefix - 前缀
 * @slot prefix - 后缀
 * @slot separator - 分隔符
 */
export
@defineElement("eo-breadcrumb-item", {
  styleTexts: [styleText],
})
class EoBreadcrumbItem extends ReactNextElement implements BreadcrumbItemProps {
  #useInGroup = false;

  set [symbolUseInGroup](value: boolean) {
    this.#useInGroup = value;
    this._render();
  }
  get [symbolUseInGroup]() {
    return this.#useInGroup;
  }

  /**
   * 外链的链接地址
   */
  @property() accessor href: string | undefined;

  /**
   * 链接地址
   */
  @property({
    attribute: false,
  })
  accessor url: ExtendedLocationDescriptor | undefined;

  /**
   * 链接跳转目标
   */
  @property() accessor target: Target | undefined;

  render() {
    return (
      <EoBreadcrumbItemComponent
        url={this.url}
        target={this.target}
        href={this.href}
        useInGroup={this.#useInGroup}
      />
    );
  }
}

interface BreadcrumbItemComponentProps extends BreadcrumbItemProps {
  useInGroup?: boolean;
  callback?: Ref<HTMLSpanElement>;
}

export function EoBreadcrumbItemComponent(props: BreadcrumbItemComponentProps) {
  const { url, href, target, callback, useInGroup } = props;

  const prefixSlotRef = useRef<HTMLSlotElement>(null);
  const suffixSlotRef = useRef<HTMLSlotElement>(null);
  const separatorSlotRef = useRef<HTMLSlotElement>(null);
  const [hasPrefixSlot, setHasPrefixSlot] = useState<boolean>();
  const [hasSuffixSlot, setHasSuffixSlot] = useState<boolean>();
  const [hasSeparatorSlot, setHasSeparatorSlot] = useState<boolean>();

  useEffect(() => {
    const prefixSlot = prefixSlotRef.current;
    const suffixSlot = suffixSlotRef.current;
    const separatorSlot = separatorSlotRef.current;

    const handlePrefixSlotChange = () => {
      setHasPrefixSlot(prefixSlot!.assignedElements().length > 0);
    };
    const handleSuffixSlotChange = () => {
      setHasSuffixSlot(suffixSlot!.assignedElements().length > 0);
    };
    const handleSeparatorSlotChange = () => {
      setHasSeparatorSlot(separatorSlot!.assignedElements().length > 0);
    };

    prefixSlot?.addEventListener("slotchange", handlePrefixSlotChange);
    suffixSlot?.addEventListener("slotchange", handleSuffixSlotChange);
    separatorSlot?.addEventListener("slotchange", handleSeparatorSlotChange);

    return () => {
      prefixSlot?.removeEventListener("slotchange", handlePrefixSlotChange);
      suffixSlot?.removeEventListener("slotchange", handleSuffixSlotChange);
      separatorSlot?.removeEventListener(
        "slotchange",
        handleSeparatorSlotChange
      );
    };
  }, []);

  const useGroupSeparator = useMemo(
    () => useInGroup && !hasSeparatorSlot,
    [hasSeparatorSlot, useInGroup]
  );

  return (
    <span className="breadcrumb-item" ref={callback}>
      <span
        className="prefix"
        style={{ display: hasPrefixSlot ? undefined : "none" }}
      >
        <slot name="prefix" ref={prefixSlotRef} />
      </span>
      <WrappedLink type="plain" href={href} target={target} url={url}>
        <slot />
      </WrappedLink>
      <span
        className="suffix"
        style={{ display: hasSuffixSlot ? undefined : "none" }}
      >
        <slot name="suffix" ref={suffixSlotRef} />
      </span>
      <span className="separator">
        <slot
          name="separator"
          style={{ display: useGroupSeparator ? "none" : undefined }}
          ref={separatorSlotRef}
        />
        {useGroupSeparator && <slot name="group-separator" />}
      </span>
    </span>
  );
}
