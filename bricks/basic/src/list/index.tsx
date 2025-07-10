import React, { useMemo } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import classNames from "classnames";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { Link, LinkProps } from "../link";
import type { Equal, Expect } from "../interface";
import styleText from "./styles.shadow.css";

const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

const DEFAULT_NAV_ICON: GeneralIconProps = {
  lib: "fa",
  prefix: "fas",
  icon: "cube",
};

const { defineElement, property } = createDecorators();

export interface ListProps {
  variant?: ListVariant;
  dataSource?: Record<string, unknown>[];
  fields?: ListFields;
}

export type ListVariant = "default" | "navigation" | "ranking";

const ALLOWED_LIST_VARIANTS = ["default", "navigation", "ranking"] as const;

type _test_cases = [
  Expect<Equal<ListVariant, (typeof ALLOWED_LIST_VARIANTS)[number]>>,
];

export interface ListFields {
  title?: string;
  description?: string;
  icon?: string;
  url?: string;
  href?: string;
}

export interface ListItem {
  title: string;
  icon?: GeneralIconProps;
  description?: string;
  url?: string;
  href?: string;
}

/**
 * 通用列表构件
 */
export
@defineElement("eo-list", {
  styleTexts: [styleText],
})
class List extends ReactNextElement implements ListProps {
  @property()
  accessor variant: ListVariant | undefined;

  @property({ attribute: false })
  accessor dataSource: Record<string, unknown>[] | undefined;

  @property({ attribute: false })
  accessor fields: ListFields | undefined;

  render() {
    return (
      <ListComponent
        variant={this.variant}
        dataSource={this.dataSource}
        fields={this.fields}
      />
    );
  }
}

function ListComponent({ variant: _variant, dataSource, fields }: ListProps) {
  const tempVariant = _variant ?? "default";
  const variant = ALLOWED_LIST_VARIANTS.includes(tempVariant)
    ? tempVariant
    : "default";

  const list = useMemo(() => {
    return dataSource?.map((item) => extractFields(item, fields));
  }, [dataSource, fields]);

  return (
    <ul className={classNames("container", variant)}>
      {list?.map((item, index) => {
        return <DefaultItem key={index} variant={variant} {...item} />;
      })}
    </ul>
  );
}

interface ItemProps extends ListItem {
  variant: ListVariant;
}

function DefaultItem({ title, icon, url, href, variant }: ItemProps) {
  const color = useMemo(() => {
    const palette =
      variant === "navigation"
        ? new Array(17).fill(0).map((_, i) => `color-${i + 1}`)
        : ["blue", "orange", "purple", "green", "cyan"];
    // Get color index by accumulate the character code of all letters of the title
    const colorIndex =
      typeof title === "string"
        ? title.split("").reduce((acc, curr) => acc + curr.charCodeAt(0), 0) %
          palette.length
        : 0;
    return palette[colorIndex];
  }, [title, variant]);

  return (
    <li className="item">
      <WrappedLink url={url} href={href} className="link">
        {/* Navigation item always has an icon */}
        {variant === "navigation" || icon ? (
          <div className={`icon ${color}`}>
            <WrappedIcon
              {...(icon ?? DEFAULT_NAV_ICON)}
              fallback={DEFAULT_NAV_ICON}
            />
          </div>
        ) : null}
        <div className="title">{title}</div>
      </WrappedLink>
    </li>
  );
}

function extractFields(
  item: Record<string, any>,
  fields?: ListFields
): ListItem {
  const fixedFields = fields ?? {};
  const patchedFields = Object.fromEntries(
    (["title", "description", "icon", "url", "href"] as const).map((key) => [
      key,
      fixedFields[key] ?? key,
    ])
  );
  return {
    title: item[patchedFields.title],
    description: item[patchedFields.description],
    icon: item[patchedFields.icon],
    url: item[patchedFields.url],
    href: item[patchedFields.href],
  };
}
