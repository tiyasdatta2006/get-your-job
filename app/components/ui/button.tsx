import cx from "classnames";
import { Link } from "react-router";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import styles from "./button.module.css";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  fullWidth?: boolean;
}

type ButtonAsButton = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined };
type ButtonAsLink = BaseProps & { to: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children, fullWidth, ...rest } = props;
  const cls = cx(
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    className
  );

  if ("to" in props && props.to !== undefined) {
    const { to } = props as ButtonAsLink;
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }

  const { to: _omit, ...buttonRest } = rest as ButtonAsButton;
  void _omit;
  return (
    <button className={cls} {...buttonRest}>
      {children}
    </button>
  );
}
