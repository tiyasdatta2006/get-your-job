import cx from "classnames";
import { IconBolt } from "@tabler/icons-react";

import styles from "./logo.module.css";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cx(styles.logo, className)}>
      <span className={styles.mark}>
        <IconBolt size={18} stroke={2.5} />
      </span>
      <span className={styles.text}>
        GetYour<span className={styles.accent}>Job</span>
      </span>
    </span>
  );
}
