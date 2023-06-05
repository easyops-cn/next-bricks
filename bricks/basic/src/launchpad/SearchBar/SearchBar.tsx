import React from "react";
import classNames from "classnames";
import styles from "./SearchBar.module.css";
import { i18n } from "@next-core/i18n";
import { NS_BASIC, K } from "../../i18n/constants.js";
import { WrappedGeneralIcon } from "../common/wrapBrick.js";
export interface SearchBarProps {
  onChange: (value: string) => void;
}

export function SearchBar(props: SearchBarProps): React.ReactElement {
  const [focus, setFocus] = React.useState(false);

  const searchInputRef = React.useCallback((element: HTMLInputElement) => {
    if (element) {
      // Wait for portal mounted first.
      Promise.resolve().then(() => {
        try {
          element.focus();
        } catch (e) {
          // Do nothing.
        }
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    props.onChange(e.target.value);
  };

  const handleClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
  };

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    const key =
      e.key ||
      /* istanbul ignore next: compatibility */ e.keyCode ||
      /* istanbul ignore next: compatibility */ e.which;
    if (
      [
        "Tab",
        "Enter",
        "ArrowLeft",
        "ArrowUp",
        "ArrowRight",
        "ArrowDown",
        9,
        13,
        37,
        38,
        39,
        40,
      ].includes(key)
    ) {
      e.preventDefault();
    }
  };

  const handleFocus = (): void => {
    setFocus(true);
  };

  const handleBlur = (): void => {
    setFocus(false);
  };

  const placeholder = i18n.t(
    `${NS_BASIC}:${K.SEARCH_BY_NAME_KEYWORD}`
  ) as string;

  return (
    <div
      className={classNames(styles.searchBar, {
        [styles.focus]: focus,
      })}
    >
      <div className={styles.inputContainer} onClick={handleClick}>
        <span
          className={classNames(styles.inputAffixWrapper, {
            [styles.inputAffixWrapperFocused]: focus,
          })}
        >
          <span className={styles.antInputPrefix}>
            <WrappedGeneralIcon icon="search" lib="antd" theme="outlined" />
          </span>
          <input
            className=""
            placeholder={placeholder}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            ref={searchInputRef}
          />
        </span>
      </div>
    </div>
  );
}
