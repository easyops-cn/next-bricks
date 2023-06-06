import React from "react";
import { CSSTransition } from "react-transition-group";
import { Launchpad, LaunchpadProps } from "../Launchpad/Launchpad.js";
import styles from "./LaunchpadWrapper.module.css";

export interface LaunchpadWrapperProps extends LaunchpadProps {
  onClose?: () => void;
}

export function LaunchpadWrapper(
  props: LaunchpadWrapperProps
): React.ReactElement {
  const [fadeIn, setFadeIn] = React.useState(true);

  const handleWillClose = (): void => {
    setFadeIn(false);
    props.onWillClose?.();
  };

  const onExited = (): void => {
    props.onClose?.();
  };

  return (
    <CSSTransition
      in={fadeIn}
      timeout={100}
      appear={true}
      classNames={{ ...styles }}
      onExited={onExited}
    >
      <Launchpad onWillClose={handleWillClose} />
    </CSSTransition>
  );
}
