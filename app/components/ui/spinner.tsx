import cx from "classnames";
import { IconLoader2 } from "@tabler/icons-react";

import styles from "./spinner.module.css";

export function Spinner({ size = 20, className }: { size?: number; className?: string }) {
  return <IconLoader2 size={size} className={cx(styles.spinner, className)} aria-hidden />;
}
