import { IconCrown, IconSparkles } from "@tabler/icons-react";

import { useApp } from "~/context/app-context";

import styles from "./credit-meter.module.css";

export function CreditMeter() {
  const { credits } = useApp();
  const pct = credits.optimizeTotal
    ? (credits.optimizeRemaining / credits.optimizeTotal) * 100
    : 0;

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        <span className={styles.label}>
          <IconSparkles size={14} /> Optimize credits
        </span>
        <span className={styles.value}>
          {credits.optimizeRemaining}/{credits.optimizeTotal}
        </span>
      </div>
      <div className={styles.bar}>
        <div className={styles.fill} style={{ width: `${pct}%` }} />
      </div>
      <div className={styles.row}>
        <span className={styles.label}>
          <IconCrown size={14} /> Executive (lifetime)
        </span>
        <span className={styles.value}>
          {credits.executiveRemaining}/{credits.executiveTotal}
        </span>
      </div>
      <p className={styles.note}>Free tier resets 10 optimize credits monthly.</p>
    </div>
  );
}
