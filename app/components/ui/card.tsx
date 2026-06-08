import cx from "classnames";
import type { HTMLAttributes } from "react";

import styles from "./card.module.css";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function Card({ className, interactive, children, ...rest }: CardProps) {
  return (
    <div className={cx(styles.card, interactive && styles.interactive, className)} {...rest}>
      {children}
    </div>
  );
}
