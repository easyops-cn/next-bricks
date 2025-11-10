import type { DetailedHTMLProps, HTMLAttributes } from "react";
import type {
  IllustrationMessage,
  IllustrationMessageProps,
} from "./illustration-message";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "eo-illustration-message": DetailedHTMLProps<
        HTMLAttributes<IllustrationMessage>,
        IllustrationMessage
      > &
        IllustrationMessageProps;
    }
  }
}
