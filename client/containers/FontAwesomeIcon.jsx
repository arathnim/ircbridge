import React from "react";
import styles from "../styles/fa.sass"

const FontAwesomeIcon =
  ({ icon, size, className = "", ...elProps }) => {
    if (!icon) {
      return null;
    }
    const {
      icon: [width, height, , , d],
      iconName,
      prefix,
    } = icon;
    return (
      <svg
        aria-hidden="true"
        className={[
          getStyle("svg-inline--fa"),
          getStyle(`fa-${iconName}`),
          getStyle(`fa-w-${Math.ceil((width / height) * 16)}`),
          size ? getStyle(`fa-${size}`) : "",
          className,
        ].join(" ")}
        data-icon={iconName}
        data-prefix={prefix}
        role="img"
        viewBox={`0 0 ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
        {...elProps}
      >
        <path d={d} fill="currentColor" />
      </svg>
    );
  }

const getStyle =
  (s) => styles[s]

export default FontAwesomeIcon
