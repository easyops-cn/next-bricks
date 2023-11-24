import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { getRuntime } from "@next-core/runtime";
import { useCurrentApp } from "@next-core/react-runtime";
import { auth } from "@next-core/easyops-runtime";
import "@next-core/theme";
import { JsonStorage } from "@next-shared/general/JsonStorage";
import moment from "moment";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { Link, LinkProps } from "@next-bricks/basic/link";
import styleText from "./styles.shadow.css";

export const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
export const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");

const { defineElement, property } = createDecorators();

/**
 * 构件 `nav.easyops-navbar-alerts`
 */
export
@defineElement("nav.easyops-navbar-alerts", {
  styleTexts: [styleText],
})
class EasyopsNavbarAlerts extends ReactNextElement {
  render() {
    return <EasyopsNavbarAlertsComponent />;
  }
}

interface SlowRenderInfo {
  renderTime: number;
  suggestTime: number;
  suggestUrl?: string;
}

const storage = new JsonStorage(localStorage);

export function EasyopsNavbarAlertsComponent() {
  const [licenseDaysLeft, setLicenseDaysLeft] = useState<number | null>(null);
  const [slowRender, setSlowRender] = useState<SlowRenderInfo | null>(null);
  const currentApp = useCurrentApp();
  const licenseDismissedKey = useMemo(() => {
    const authInfo = auth.getAuth();
    return `license:${authInfo.org}`;
  }, []);

  useEffect(() => {
    const authInfo = auth.getAuth();
    const validDaysLeft = authInfo.license?.validDaysLeft;
    let dismissExpireAt: number;
    if (
      validDaysLeft &&
      validDaysLeft <= 15 &&
      authInfo.isAdmin &&
      ((dismissExpireAt = storage.getItem(licenseDismissedKey)),
      !dismissExpireAt || moment().unix() > dismissExpireAt)
    ) {
      setLicenseDaysLeft(validDaysLeft);
    }
  }, [licenseDismissedKey]);

  useEffect(() => {
    const handelRouteRender = (e: Event): void => {
      const renderTime = (e as CustomEvent<{ renderTime: number }>).detail
        .renderTime;
      const { loadTime, loadInfoPage } = getRuntime().getMiscSettings() as {
        loadTime: number;
        loadInfoPage?: string;
      };
      if (currentApp?.isBuildPush && loadTime > 0 && renderTime > loadTime) {
        setSlowRender({
          renderTime: millisecondToSecond(renderTime),
          suggestTime: millisecondToSecond(loadTime),
          suggestUrl: loadInfoPage,
        });
      }
    };
    window.addEventListener("route.render", handelRouteRender);
    return () => {
      window.removeEventListener("route.render", handelRouteRender);
    };
  }, [currentApp]);

  const handleLicenseAlertDismiss = useCallback(() => {
    // 一天内不再显示。
    storage.setItem(licenseDismissedKey, moment().unix() + 86400);
    setLicenseDaysLeft(null);
  }, [licenseDismissedKey]);

  return (
    <>
      {slowRender && (
        <Alert
          text={`您的页面存在性能问题, 当前页面渲染时间 ${slowRender.renderTime} 秒, 规定阈值为: ${slowRender.suggestTime} 秒, 您已超过。请您针对该页面进行性能优化！`}
          type="warning"
          link={
            slowRender.suggestUrl
              ? {
                  label: "建议解决思路",
                  url: slowRender.suggestUrl,
                }
              : undefined
          }
        />
      )}
      {licenseDaysLeft !== null && (
        <Alert
          text={`离 License 过期还有 ${licenseDaysLeft} 天`}
          type="info"
          closable
          onClose={handleLicenseAlertDismiss}
        />
      )}
    </>
  );
}

interface AlertProps {
  text: string;
  type: "info" | "warning";
  closable?: boolean;
  link?: {
    label: string;
    url: string;
  };
  onClose?: () => void;
}

function Alert({ text, type, closable, link, onClose }: AlertProps) {
  return (
    <div className={`alert ${type}`}>
      <span className="text">{text}</span>
      {link && (
        <WrappedLink className="link" href={link.url} target="_blank">
          {link.label}
        </WrappedLink>
      )}
      {closable && (
        <WrappedIcon
          lib="antd"
          icon="close"
          className="icon"
          role="button"
          onClick={onClose}
        />
      )}
    </div>
  );
}

function millisecondToSecond(millisecond: number) {
  return Math.floor(millisecond * 100) / 1e5;
}
