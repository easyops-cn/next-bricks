import React, { useEffect, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type { Tag, TagProps } from "@next-bricks/basic/tag";
import type { Link, LinkProps } from "@next-bricks/basic/link";
import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
import { K, NS, locales } from "./i18n.js";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { VisitHistory, VisitHistoryData } from "../utils.js";
import { get } from "lodash";

initializeReactI18n(NS, locales);

const { defineElement, property } = createDecorators();

const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");
const WrappedTag = wrapBrick<Tag, TagProps>("eo-tag");

interface RecentVisitProps {
  namespace: string;
  capacity?: number;
  compareKeys?: string[];
  urlTemplate?: string;
}

/**
 * 最近访问
 */
export
@defineElement("recent-history.recent-visit", {
  styleTexts: [styleText],
})
class RecentVisit extends ReactNextElement {
  /**
   * 命名空间
   */
  @property()
  accessor namespace!: string;

  /**
   * 最近访问数量
   */
  @property({
    type: Number,
  })
  accessor capacity: number | undefined;

  /**
   * 设置后不在该列表内的数据会被剔除
   */
  @property({
    attribute: false,
  })
  accessor compareKeys: string[] | undefined;

  /**
   * 点击标签跳转的 url 链接，支持模版变量
   */
  @property()
  accessor urlTemplate: string | undefined;

  render() {
    return (
      <RecentVisitComponent
        namespace={this.namespace}
        capacity={this.capacity}
        compareKeys={this.compareKeys}
        urlTemplate={this.urlTemplate}
      />
    );
  }
}

const parseTemplate = (template: string, context: Record<string, any>) => {
  return template?.replace(/{{(.*?)}}/g, (match: string, key: string) => {
    const value = get(context, key);
    return value;
  });
};

export function RecentVisitComponent(props: RecentVisitProps) {
  const { namespace, capacity, compareKeys, urlTemplate } = props;
  const { t } = useTranslation(NS);

  const [recentVisits, setRecentVisits] = useState<VisitHistoryData[]>([]);

  const updateRecentVisits = () => {
    const list = new VisitHistory(namespace, capacity).getAll();
    if (Array.isArray(compareKeys)) {
      const compareKeysSet = new Set(compareKeys);
      setRecentVisits(list.filter((v) => compareKeysSet.has(v.key)));
    } else {
      setRecentVisits(list);
    }
  };

  useEffect(() => {
    updateRecentVisits();
  }, [capacity, compareKeys, namespace]);

  useEffect(() => {
    const handleStorageChange = (
      event: CustomEvent<{ namespace: string; list: VisitHistoryData[] }>
    ) => {
      if (event.detail.namespace === namespace) {
        updateRecentVisits();
      }
    };
    window.addEventListener(
      "recent-history-change",
      handleStorageChange as (e: Event) => void
    );

    return () => {
      window.removeEventListener(
        "recent-history-change",
        handleStorageChange as (e: Event) => void
      );
    };
  }, []);

  return (
    <div className="recent-visit-wrapper">
      <span className="recent-visit-label">{t(K.RECENT_VISIT) + ": "}</span>
      {recentVisits.map((data) => {
        return (
          <WrappedLink key={data.key} url={parseTemplate(urlTemplate!, data)}>
            <WrappedTag color="blue">{data.name}</WrappedTag>
          </WrappedLink>
        );
      })}
    </div>
  );
}
