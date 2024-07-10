import { Input } from "@formily/antd-v5";
import { DisconnectOutlined, LinkOutlined } from "@ant-design/icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./BoxSizeComponent.module.css";
import classNames from "classnames";

type Direction = "top" | "bottom" | "left" | "right";

enum DirectionEnum {
  top = 0,
  right = 1,
  bottom = 2,
  left = 3,
}

type BoxValue = {
  [key in Direction]: number;
};

interface BoxSizeComponentProps {
  onChange: (value: string) => void;
  value: string;
  mode: "in" | "out";
}

export function BoxSizeComponent({
  onChange,
  value,
  mode,
}: BoxSizeComponentProps) {
  const [tranformValue, setTransformValue] = useState<BoxValue>();
  const [connect, setConnect] = useState<boolean>(false);
  const [direction, setDirection] = useState<Direction>();
  const isInMode = useMemo(() => mode === "in", [mode]);

  const handleFocus = (direction: Direction) => {
    setDirection(direction);
  };

  const handleBlur = () => {
    setDirection(null);
  };

  const handleChange = useCallback(
    (direction: Direction, inputValue: string) => {
      const newValue = inputValue.match(/\d+/);

      const realValue = Number(newValue !== null ? newValue[0] : 0);

      const changeValue = connect
        ? `${realValue}px`
        : `${(value ?? "0px 0px 0px 0px")
            .match(/(\d+px)/g)
            .map((item, index) => {
              if (DirectionEnum[direction] === index) {
                return `${realValue}px`;
              }
              return item;
            })
            .join(" ")}`;
      onChange(changeValue);
    },
    [connect, onChange, value]
  );

  const handleConnectClick = (isConnect: boolean) => {
    setConnect(isConnect);
  };

  const transfrom = useCallback((value: string) => {
    const realValue = (value ?? "0px 0px 0px 0px").match(/(\d+)/g);

    setTransformValue({
      top: +realValue[0],
      right: +realValue[1],
      bottom: +realValue[2],
      left: +realValue[3],
    });
  }, []);

  useEffect(() => {
    transfrom(value);
  }, [value, transfrom]);

  return (
    <div className={styles.boxSizeComponent}>
      <div className={styles.leftWrapper}>
        <div className={styles.outBox}>
          <div
            className={styles.inBox}
            style={{
              position: isInMode ? "relative" : "initial",
            }}
          >
            <div
              className={classNames(styles.top, styles.line, styles.vertical, {
                [styles.active]: direction === "top" || connect,
              })}
            />
            <div
              className={classNames(
                styles.right,
                styles.line,
                styles.horizontal,
                { [styles.active]: direction === "right" || connect }
              )}
            />
            <div
              className={classNames(
                styles.left,
                styles.line,
                styles.horizontal,
                { [styles.active]: direction === "left" || connect }
              )}
            />
            <div
              className={classNames(
                styles.bottom,
                styles.line,
                styles.vertical,
                { [styles.active]: direction === "bottom" || connect }
              )}
            />

            <div className="connect-btn">
              {connect ? (
                <LinkOutlined
                  style={{ color: "var(--color-brand)" }}
                  onClick={() => handleConnectClick(false)}
                />
              ) : (
                <DisconnectOutlined onClick={() => handleConnectClick(true)} />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.rightWrapper}>
        <div className={styles.inputWrapper}>
          <Input
            prefix={"上"}
            placeholder="0"
            value={tranformValue?.top}
            onFocus={() => handleFocus("top")}
            onBlur={handleBlur}
            onChange={(event) => handleChange("top", event.target.value)}
          />
          <Input
            prefix={"左"}
            placeholder="0"
            value={tranformValue?.left}
            onFocus={() => handleFocus("left")}
            onChange={(event) => handleChange("left", event.target.value)}
            onBlur={handleBlur}
          />
        </div>
        <div className={styles.inputWrapper}>
          <Input
            prefix={"下"}
            placeholder="0"
            value={tranformValue?.bottom}
            onFocus={() => handleFocus("bottom")}
            onBlur={handleBlur}
            onChange={(event) => handleChange("bottom", event.target.value)}
          />
          <Input
            prefix={"右"}
            placeholder="0"
            value={tranformValue?.right}
            onFocus={() => handleFocus("right")}
            onBlur={handleBlur}
            onChange={(event) => handleChange("right", event.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
