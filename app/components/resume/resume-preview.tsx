import cx from "classnames";
import { forwardRef } from "react";

import type { Resume, ResumeSectionKey } from "~/types/resume";
import { SECTION_LABELS } from "~/types/resume";

import styles from "./resume-preview.module.css";

interface ResumePreviewProps {
  resume: Resume;
  className?: string;
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(function ResumePreview(
  { resume, className },
  ref
) {
  const { data, sectionOrder, template } = resume;

  return (
    <div ref={ref} className={cx(styles.page, styles[template], className)}>
      <header className={styles.header}>
        {data.contact.photo && (
          <img src={data.contact.photo} alt="" className={styles.photo} />
        )}
        <div>
          <h1 className={styles.name}>{data.contact.name || "Your Name"}</h1>
          <p className={styles.contactLine}>
            {[data.contact.email, data.contact.phone, data.contact.location]
              .filter(Boolean)
              .join("  •  ")}
          </p>
          <p className={styles.contactLine}>
            {[data.contact.linkedin, data.contact.github, data.contact.portfolio]
              .filter(Boolean)
              .join("  •  ")}
          </p>
        </div>
      </header>

      {sectionOrder.map((key) => (
        <Section key={key} sectionKey={key} resume={resume} />
      ))}
    </div>
  );
});

function Section({ sectionKey, resume }: { sectionKey: ResumeSectionKey; resume: Resume }) {
  const { data } = resume;
  const label = SECTION_LABELS[sectionKey];

  switch (sectionKey) {
    case "summary":
      if (!data.summary) return null;
      return (
        <SectionShell label={label}>
          <p className={styles.text}>{data.summary}</p>
        </SectionShell>
      );
    case "experience":
      if (data.experience.length === 0) return null;
      return (
        <SectionShell label={label}>
          {data.experience.map((e) => (
            <div key={e.id} className={styles.entry}>
              <div className={styles.entryHead}>
                <strong>{e.role}</strong>
                <span className={styles.period}>{e.period}</span>
              </div>
              <div className={styles.subtle}>{e.company}</div>
              <p className={styles.text}>{e.description}</p>
            </div>
          ))}
        </SectionShell>
      );
    case "projects":
      if (data.projects.length === 0) return null;
      return (
        <SectionShell label={label}>
          {data.projects.map((p) => (
            <div key={p.id} className={styles.entry}>
              <div className={styles.entryHead}>
                <strong>{p.name}</strong>
                <span className={styles.period}>{p.tech}</span>
              </div>
              <p className={styles.text}>{p.description}</p>
            </div>
          ))}
        </SectionShell>
      );
    case "education":
      if (data.education.length === 0) return null;
      return (
        <SectionShell label={label}>
          {data.education.map((ed) => (
            <div key={ed.id} className={styles.entry}>
              <div className={styles.entryHead}>
                <strong>{ed.degree}</strong>
                <span className={styles.period}>{ed.period}</span>
              </div>
              <div className={styles.subtle}>{ed.institution}</div>
              {ed.details && <p className={styles.text}>{ed.details}</p>}
            </div>
          ))}
        </SectionShell>
      );
    case "skills":
      if (data.skills.length === 0) return null;
      return (
        <SectionShell label={label}>
          <div className={styles.tags}>
            {data.skills.map((s) => (
              <span key={s} className={styles.tag}>
                {s}
              </span>
            ))}
          </div>
        </SectionShell>
      );
    case "certifications":
      if (data.certifications.length === 0) return null;
      return (
        <SectionShell label={label}>
          {data.certifications.map((c) => (
            <div key={c.id} className={styles.lineItem}>
              <span>
                <strong>{c.name}</strong> — {c.issuer}
              </span>
              <span className={styles.period}>{c.year}</span>
            </div>
          ))}
        </SectionShell>
      );
    case "achievements":
      if (data.achievements.length === 0) return null;
      return (
        <SectionShell label={label}>
          <ul className={styles.list}>
            {data.achievements.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ul>
        </SectionShell>
      );
    case "languages":
      if (data.languages.length === 0) return null;
      return (
        <SectionShell label={label}>
          <div className={styles.tags}>
            {data.languages.map((l) => (
              <span key={l} className={styles.tag}>
                {l}
              </span>
            ))}
          </div>
        </SectionShell>
      );
    default:
      return null;
  }
}

function SectionShell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{label}</h2>
      {children}
    </section>
  );
}
