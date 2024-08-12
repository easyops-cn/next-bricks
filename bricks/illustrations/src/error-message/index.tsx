import React, { useMemo } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import { unwrapProvider } from "@next-core/utils/general";
import { useCurrentTheme } from "@next-core/react-runtime";
import styleText from "./styles.shadow.css";
import type { getIllustration as _getIllustration } from "../data-providers/get-illustration";

// Use `unwrapProvider` to get the original function of a provider
const getIllustration = unwrapProvider<typeof _getIllustration>(
  "illustrations.get-illustration"
);

const { defineElement, property } = createDecorators();

export interface ErrorMessageProps {
  errorTitle?: string;
  description?: string;
  variant?: ErrorMessageVariant;
}

export type ErrorMessageVariant =
  | "internet-disconnected"
  | "no-permission"
  | "license-expired"
  | "unknown-error";

/**
 * 构件 `illustrations.error-message`
 */
export
@defineElement("illustrations.error-message", {
  styleTexts: [styleText],
})
class ErrorMessage extends ReactNextElement implements ErrorMessageProps {
  @property()
  accessor errorTitle: string | undefined;

  @property()
  accessor description: string | undefined;

  @property()
  accessor variant: ErrorMessageVariant | undefined;

  render() {
    return (
      <ErrorMessageComponent
        errorTitle={this.errorTitle}
        description={this.description}
        variant={this.variant}
      />
    );
  }
}

export interface ErrorMessageComponentProps extends ErrorMessageProps {
  // Define event handlers here.
}

export function ErrorMessageComponent({
  errorTitle,
  description,
  variant,
}: ErrorMessageComponentProps) {
  const theme = useCurrentTheme();

  const image = useMemo(() => {
    let name: string;
    switch (variant) {
      case "internet-disconnected":
      case "no-permission":
      case "license-expired":
        name = variant;
        break;
      default:
        name = "unknown-error";
    }
    return getIllustration({ name, category: "easyops2", theme });
  }, [variant, theme]);

  return (
    <>
      <div className="image">
        <img src={image} />
      </div>
      {errorTitle && <div className="title">{errorTitle}</div>}
      {description && <div className="description">{description}</div>}
      <div className="extra">
        <slot />
      </div>
    </>
  );
}
