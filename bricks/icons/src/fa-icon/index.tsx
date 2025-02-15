import React, { useEffect, useState } from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement, wrapLocalBrick } from "@next-core/react-element";
import { hasOwnProperty } from "@next-core/utils/general";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  DefineLinearGradient,
  DefineLinearGradientProps,
  GradientDirection,
} from "../shared/DefineLinearGradient.js";
import AliasJson from "./generated/alias.json";
import {
  RangeRequest,
  supportsMultipartRangeRequest,
} from "../shared/RangeRequest.js";
import linearGradientStyleText from "../shared/DefineLinearGradient.shadow.css";
import type { IconEvents, IconEventsMapping } from "../shared/interfaces.js";
import sharedStyleText from "../shared/icons.shadow.css";

const iconCache = new Map<string, Promise<IconDefinition | null>>();
const faRangeRequest = new RangeRequest("fa");

async function resolveIconDefinition(
  id: string
): Promise<IconDefinition | null> {
  // istanbul ignore next: experimental
  try {
    if (await supportsMultipartRangeRequest()) {
      const content = await faRangeRequest.fetch(id);
      return JSON.parse(content);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Failed to fetch icon by range:", id, error);
    // Fallback to traditional fetch.
  }

  try {
    const url = `${
      // istanbul ignore next
      process.env.NODE_ENV === "test" ? "" : __webpack_public_path__
    }chunks/fa-icons/${id}.json`;
    return await (await fetch(url, { mode: "cors" })).json();
  } catch {
    return null;
  }
}

async function getIconDefinition(
  prefix: string,
  icon: string | undefined
): Promise<IconDefinition | null> {
  if (icon) {
    const actualIcon =
      hasOwnProperty(AliasJson, prefix) &&
      hasOwnProperty((AliasJson as Alias)[prefix], icon)
        ? (AliasJson as Alias)[prefix][icon]
        : icon;
    const id = `${prefix}/${actualIcon}`;
    let iconResolver = iconCache.get(id);
    if (!iconResolver) {
      iconResolver = resolveIconDefinition(id);
      iconCache.set(id, iconResolver);
    }
    return await iconResolver;
  } else {
    return null;
  }
}

const { defineElement, property, event } = createDecorators();

export interface FaIconProps extends DefineLinearGradientProps {
  /** Defaults to "fas" */
  prefix?: string;
  icon?: string;
  spin?: boolean;
}

export
@defineElement("eo-fa-icon", {
  styleTexts: [linearGradientStyleText, sharedStyleText],
  alias: ["icons.fa-icon"],
})
class FaIcon extends ReactNextElement implements FaIconProps {
  // Note: `prefix` is a native prop on Element, but it's only used in XML documents.
  /**
   * 图标前缀
   * @default "fas"
   */
  @property() accessor prefix!: string;

  /** 图标名 */
  @property() accessor icon: string | undefined;

  /** 渐变色起始颜色 */
  @property() accessor startColor: string | undefined;

  /** 渐变色终止颜色 */
  @property() accessor endColor: string | undefined;

  /** 渐变色方向 */
  @property() accessor gradientDirection: GradientDirection | undefined;

  @event({ type: "icon.found" })
  accessor #iconFoundEvent!: EventEmitter<boolean>;

  #handleIconFoundChange = (found: boolean) => {
    this.#iconFoundEvent.emit(found);
  };

  render() {
    return (
      <FaIconComponent
        prefix={this.prefix}
        icon={this.icon}
        startColor={this.startColor}
        endColor={this.endColor}
        gradientDirection={this.gradientDirection}
        onIconFoundChange={this.#handleIconFoundChange}
      />
    );
  }
}

interface FaIconComponentProps extends FaIconProps {
  onIconFoundChange(found: boolean): void;
}

function FaIconComponent({
  prefix: _prefix,
  icon,
  startColor,
  endColor,
  gradientDirection,
  onIconFoundChange,
}: FaIconComponentProps) {
  const prefix = _prefix ?? "fas";
  const [iconDefinition, setIconDefinition] = useState<IconDefinition | null>(
    null
  );

  useEffect(() => {
    let ignore = false;
    getIconDefinition(prefix, icon).then((result) => {
      if (!ignore) {
        if (!result && icon) {
          // eslint-disable-next-line no-console
          console.error("FontAwesome Icon not found:", prefix, icon);
        }
        setIconDefinition(result);
        onIconFoundChange(!!result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [icon, onIconFoundChange, prefix]);

  if (!iconDefinition) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [width, height, _ligatures, _symbol, pathData] = iconDefinition.icon;

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${width} ${height}`}
        fill="currentColor"
      >
        <path d={pathData as string} />
      </svg>
      <DefineLinearGradient
        startColor={startColor}
        endColor={endColor}
        gradientDirection={gradientDirection}
      />
    </>
  );
}

interface Alias {
  [category: string]: {
    [icon: string]: string;
  };
}

export const WrappedFaIcon = wrapLocalBrick<
  FaIcon,
  FaIconProps,
  IconEvents,
  IconEventsMapping
>(FaIcon, {
  onIconFoundChange: "icon.found",
});
