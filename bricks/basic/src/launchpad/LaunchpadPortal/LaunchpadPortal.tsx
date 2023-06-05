import React from "react";
import ReactDOM from "react-dom";
import {
  LaunchpadWrapper,
  LaunchpadWrapperProps,
} from "../LaunchpadWrapper/LaunchpadWrapper.js";

export interface LaunchpadPortalProps extends LaunchpadWrapperProps {
  visible: boolean;
}

export function LaunchpadPortal(
  props: LaunchpadPortalProps
): React.ReactPortal | null {
  const elem = document.createElement("div");

  // Currently the `useEffect()` can't be covered when shallow rendering.
  // Ref https://github.com/airbnb/enzyme/issues/2086
  // Todo(steve): check issue status and remove ignore.
  /* istanbul ignore next */
  React.useEffect(() => {
    document.body.appendChild(elem);
    return () => {
      document.body.removeChild(elem);
    };
  });

  if (!props.visible) {
    return null;
  }

  return ReactDOM.createPortal(
    <LaunchpadWrapper
      onWillClose={props.onWillClose}
      onClose={props.onClose}
    />,
    elem
  );
}
