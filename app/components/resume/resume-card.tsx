import { Link } from "react-router";
import { IconCrown, IconFileText, IconTargetArrow, IconTrash } from "@tabler/icons-react";

import type { Resume } from "~/types/resume";
import { Card } from "~/components/ui/card";
import { ResumePreview } from "~/components/resume/resume-preview";

import styles from "./resume-card.module.css";

const KIND_META = {
  ats: { label: "ATS", icon: IconFileText },
  optimized: { label: "Optimized", icon: IconTargetArrow },
  executive: { label: "Executive", icon: IconCrown },
} as const;

export function ResumeCard({ resume, onDelete }: { resume: Resume; onDelete: (id: string) => void }) {
  const meta = KIND_META[resume.kind];
  const Icon = meta.icon;

  return (
    <Card className={styles.card}>
      <Link to={`/dashboard/editor/${resume.id}`} className={styles.thumbLink}>
        <div className={styles.thumb}>
          <ResumePreview resume={resume} className={styles.scaled} />
        </div>
      </Link>
      <div className={styles.body}>
        <div className={styles.row}>
          <span className={styles.badge}>
            <Icon size={13} /> {meta.label}
          </span>
          {typeof resume.atsScore === "number" && (
            <span className={styles.score}>ATS {resume.atsScore}%</span>
          )}
        </div>
        <h3 className={styles.title}>{resume.title}</h3>
        <p className={styles.date}>
          Updated {new Date(resume.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </p>
        <div className={styles.actions}>
          <Link to={`/dashboard/editor/${resume.id}`} className={styles.editBtn}>
            Open editor
          </Link>
          <button className={styles.delBtn} onClick={() => onDelete(resume.id)} aria-label="Delete resume">
            <IconTrash size={16} />
          </button>
        </div>
      </div>
    </Card>
  );
}
