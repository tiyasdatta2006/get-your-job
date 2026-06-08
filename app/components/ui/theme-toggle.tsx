import { useColorScheme } from "@dazl/color-scheme/react";
import { IconDeviceLaptop, IconMoon, IconSun } from "@tabler/icons-react";
import cx from "classnames";

import styles from "./theme-toggle.module.css";

const OPTIONS = [
  { value: "light", icon: IconSun, label: "Light" },
  { value: "system", icon: IconDeviceLaptop, label: "System" },
  { value: "dark", icon: IconMoon, label: "Dark" },
] as const;

export function ThemeToggle({ className }: { className?: string }) {
  const { configScheme, setColorScheme } = useColorScheme();

  return (
    <div className={cx(styles.toggle, className)} role="radiogroup" aria-label="Theme">
      {OPTIONS.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={configScheme === value}
          aria-label={label}
          title={label}
          className={cx(styles.option, configScheme === value && styles.active)}
          onClick={() => setColorScheme(value)}
        >
          <Icon size={16} stroke={1.8} />
        </button>
      ))}
    </div>
  );
}
