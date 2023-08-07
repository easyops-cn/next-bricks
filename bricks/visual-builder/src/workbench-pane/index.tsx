import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import styleText from "./workbench-pane.shadow.css";
import sharedStyle from "../shared/scrollbar.shadow.css";
import { debounceByAnimationFrame } from "@next-shared/general/debounceByAnimationFrame";
import classNames from "classnames";

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "icons.general-icon"
);

const { defineElement, property, event } = createDecorators();

export interface WorkbenchPaneProps {
  titleLabel?: string;
  active?: boolean;
  badge?: number;
  onActiveChange?(active: boolean): void;
  onFirstActivated?(): void;
}

@defineElement("visual-builder.workbench-pane", {
  styleTexts: [styleText, sharedStyle],
})
class WorkbenchPane extends ReactNextElement {
  @property() accessor titleLabel: string | undefined;

  @property({ type: Boolean }) accessor active: boolean | undefined;

  @property({ type: Number }) accessor badge: number | undefined;

  @event({ type: "active.change" })
  accessor #activeChangeEvent: EventEmitter<boolean>;
  #handleActiveChange = (active: boolean): void => {
    if (active !== this.active) {
      this.active = active;
      this.#activeChangeEvent.emit(active);
    }
  };

  @event({ type: "active.firstActivated" })
  accessor #activeFirstActivatedEvent: EventEmitter<void>;

  #handleActiveFirstActivated = (): void => {
    this.#activeFirstActivatedEvent.emit();
  };

  render() {
    return (
      <WorkbenchPaneComponent
        titleLabel={this.titleLabel}
        active={this.active}
        badge={this.badge}
        onActiveChange={this.#handleActiveChange}
        onFirstActivated={this.#handleActiveFirstActivated}
      />
    );
  }
}

function WorkbenchPaneComponent({
  titleLabel,
  active,
  badge,
  onActiveChange,
  onFirstActivated,
}: WorkbenchPaneProps) {
  const [internalActive, setInternalActive] = useState<boolean>(active);
  const [activatedOnce, setActivatedOnce] = useState(false);

  useEffect(() => {
    setInternalActive(active);
  }, [active]);

  useEffect(() => {
    onActiveChange?.(internalActive);
  }, [internalActive, onActiveChange]);

  const handleClick = useCallback(() => {
    setInternalActive((previousActive) => !previousActive);
    if (!activatedOnce && !internalActive) {
      setActivatedOnce(true);
      onFirstActivated?.();
    }
  }, [activatedOnce, internalActive, onFirstActivated]);

  const scrollBodyRef = useRef<HTMLDivElement>();

  const [scrolled, setScrolled] = useState(false);

  const handleScroll = useMemo(
    () =>
      debounceByAnimationFrame((): void => {
        setScrolled(scrollBodyRef.current.scrollTop > 0);
      }),
    []
  );

  return (
    <div
      className={classNames("pane", {
        scrolled,
      })}
    >
      <div className="pane-header" tabIndex={0} onClick={handleClick}>
        <div className="pane-title">
          <span className="title-icon">
            {internalActive ? (
              <WrappedIcon lib="antd" theme="outlined" icon="down" />
            ) : (
              <WrappedIcon lib="antd" theme="outlined" icon="right" />
            )}
          </span>
          <div className="title-label">{titleLabel}</div>
          <slot name="title" />
        </div>
        <slot name="actions" />
        {badge && <div className="badge">{badge}</div>}
        <div className="pane-scroll-shadow"></div>
      </div>
      <div
        className="pane-body custom-scrollbar-container"
        onScroll={handleScroll}
        ref={scrollBodyRef}
      >
        <slot>
          <div
            style={{
              padding: "10px 20px",
              color: "var(--text-color-secondary)",
            }}
          >
            No content
          </div>
        </slot>
      </div>
    </div>
  );
}

export { WorkbenchPane };
