import cx from "classnames";
import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

import styles from "./field.module.css";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export function InputField({ label, hint, className, id, ...rest }: InputFieldProps) {
  return (
    <label className={cx(styles.field, className)} htmlFor={id}>
      {label && <span className={styles.label}>{label}</span>}
      <input id={id} className={styles.input} {...rest} />
      {hint && <span className={styles.hint}>{hint}</span>}
    </label>
  );
}

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export function TextareaField({ label, hint, className, id, ...rest }: TextareaFieldProps) {
  return (
    <label className={cx(styles.field, className)} htmlFor={id}>
      {label && <span className={styles.label}>{label}</span>}
      <textarea id={id} className={cx(styles.input, styles.textarea)} {...rest} />
      {hint && <span className={styles.hint}>{hint}</span>}
    </label>
  );
}
