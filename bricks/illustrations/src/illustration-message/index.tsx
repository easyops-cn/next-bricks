import React, { useMemo } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import { unwrapProvider } from "@next-core/utils/general";
import { useCurrentTheme } from "@next-core/react-runtime";
import type { getIllustration as _getIllustration } from "../data-providers/get-illustration";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import styleText from "./styles.shadow.css";

// Use `unwrapProvider` to get the original function of a provider
const getIllustration = unwrapProvider<typeof _getIllustration>(
  "illustrations.get-illustration"
);
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

const { defineElement, property } = createDecorators();

export interface IllustrationMessageProps {
  heading?: string;
  description?: string;
  variant?: MessageVariant;
}

export type MessageVariant = ErrorVariant | StatusVariant;

export type ErrorVariant =
  | "internet-disconnected"
  | "no-permission"
  | "license-expired"
  | "not-found"
  | "search-empty"
  | "unknown-error";

export type StatusVariant = "success" | "error" | "warning" | "info";

interface MessageOfImage {
  type: "image";
  image: string | undefined;
}

interface MessageOfStatus {
  type: "status";
  icon: string;
}

/**
 * 插画消息构件
 */
export
@defineElement("eo-illustration-message", {
  styleTexts: [styleText],
  alias: ["illustrations.error-message"],
})
class IllustrationMessage
  extends ReactNextElement
  implements IllustrationMessageProps
{
  @property()
  accessor heading: string | undefined;

  /**
   * @deprecated Use `heading` instead
   */
  @property()
  accessor errorTitle: string | undefined;

  @property()
  accessor description: string | undefined;

  /**
   * @default "unknown-error"
   */
  @property()
  accessor variant: MessageVariant | undefined;

  render() {
    return (
      <IllustrationMessageComponent
        heading={this.heading || this.errorTitle}
        description={this.description}
        variant={this.variant}
      />
    );
  }
}

export interface IllustrationMessageComponentProps
  extends IllustrationMessageProps {
  // Define event handlers here.
}

export function IllustrationMessageComponent({
  heading,
  description,
  variant,
}: IllustrationMessageComponentProps) {
  const theme = useCurrentTheme();

  const message = useMemo<MessageOfImage | MessageOfStatus>(() => {
    let category = "easyops2";
    let name: string;
    let messageType = "error";
    let icon: string;
    switch (variant) {
      case "internet-disconnected":
      case "no-permission":
      case "license-expired":
      case "search-empty":
        name = variant;
        break;
      case "not-found":
        name = "http-404";
        category = "exception";
        break;
      default:
        messageType = "status";
        switch (variant) {
          case "success":
            icon = "check-circle";
            break;
          case "error":
            icon = "close-circle";
            break;
          case "warning":
            icon = "warning";
            break;
          case "info":
            icon = "exclamation-circle";
            break;
          default:
            messageType = "error";
            name = "unknown-error";
        }
    }

    if (messageType === "status") {
      return {
        type: "status",
        icon: icon!,
      };
    }
    return {
      type: "image",
      image: getIllustration({ category, name: name!, theme }),
    };
  }, [variant, theme]);

  return (
    <>
      {message.type === "image" ? (
        <div className="image">
          <img src={message.image} alt={variant} />
        </div>
      ) : (
        <div className={`status ${variant}`}>
          <WrappedIcon lib="antd" theme="filled" icon={message.icon} />
        </div>
      )}
      {heading && <div className="heading">{heading}</div>}
      {description && <div className="description">{description}</div>}
      <div>
        <slot />
      </div>
    </>
  );
}
