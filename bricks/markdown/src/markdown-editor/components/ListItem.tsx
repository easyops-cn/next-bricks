import { useNodeViewContext } from "@prosemirror-adapter/react";
import type { FC } from "react";
import React from "react";
import classNames from "classnames";

export const ListItem: FC = () => {
  const { contentRef, node, setAttrs, selected } = useNodeViewContext();
  const { attrs } = node;
  const checked = attrs?.checked;
  const isBullet = attrs?.listType === "bullet";
  return (
    <li
      className={classNames("listItem", {
        "ProseMirror-selectednode": selected,
      })}
    >
      <span style={{ display: "flex", height: "1.5rem", alignItems: "center" }}>
        {checked != null ? (
          <input
            style={{ borderRadius: "0.25rem" }}
            onChange={() => setAttrs({ checked: !checked })}
            type="checkbox"
            checked={checked}
          />
        ) : isBullet ? (
          <span
            style={{
              height: "0.5rem",
              width: "0.5rem",
              borderRadius: "9999px",
              backgroundColor: "rgb(129,161,193)",
            }}
          />
        ) : (
          <span style={{ color: "rgb(136,192,208)" }}>{attrs?.label}</span>
        )}
      </span>
      <div style={{ minWidth: "0" }} ref={contentRef} />
    </li>
  );
};
