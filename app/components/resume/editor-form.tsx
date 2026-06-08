import {
  IconChevronDown,
  IconChevronUp,
  IconPlus,
  IconSparkles,
  IconTrash,
} from "@tabler/icons-react";

import type { Resume, ResumeData, ResumeSectionKey } from "~/types/resume";
import { SECTION_LABELS } from "~/types/resume";
import { InputField, TextareaField } from "~/components/ui/field";
import { createId } from "~/data/sample-resume";

import styles from "./editor-form.module.css";

interface EditorFormProps {
  resume: Resume;
  onChange: (updater: (data: ResumeData) => ResumeData) => void;
  onReorder: (key: ResumeSectionKey, dir: "up" | "down") => void;
  onEnhanceSummary: () => void;
  onEnhanceExperience: (id: string) => void;
  onEnhanceProject: (id: string) => void;
}

export function EditorForm({
  resume,
  onChange,
  onReorder,
  onEnhanceSummary,
  onEnhanceExperience,
  onEnhanceProject,
}: EditorFormProps) {
  const { data } = resume;

  const setContact = (field: keyof ResumeData["contact"], value: string) =>
    onChange((d) => ({ ...d, contact: { ...d.contact, [field]: value } }));

  return (
    <div className={styles.form}>
      {/* Contact */}
      <SectionGroup title="Contact">
        <div className={styles.grid2}>
          <InputField label="Full name" value={data.contact.name} onChange={(e) => setContact("name", e.target.value)} />
          <InputField label="Email" value={data.contact.email} onChange={(e) => setContact("email", e.target.value)} />
          <InputField label="Phone" value={data.contact.phone} onChange={(e) => setContact("phone", e.target.value)} />
          <InputField label="Location" value={data.contact.location} onChange={(e) => setContact("location", e.target.value)} />
          <InputField label="LinkedIn" value={data.contact.linkedin} onChange={(e) => setContact("linkedin", e.target.value)} />
          <InputField label="GitHub" value={data.contact.github} onChange={(e) => setContact("github", e.target.value)} />
          <InputField label="Portfolio" value={data.contact.portfolio} onChange={(e) => setContact("portfolio", e.target.value)} />
          <InputField label="Photo URL (optional)" value={data.contact.photo ?? ""} onChange={(e) => setContact("photo", e.target.value)} />
        </div>
      </SectionGroup>

      {resume.sectionOrder.map((key, index) => (
        <SectionGroup
          key={key}
          title={SECTION_LABELS[key]}
          reorder={{
            canUp: index > 0,
            canDown: index < resume.sectionOrder.length - 1,
            onUp: () => onReorder(key, "up"),
            onDown: () => onReorder(key, "down"),
          }}
        >
          {key === "summary" && (
            <div className={styles.stack}>
              <TextareaField
                value={data.summary}
                onChange={(e) => onChange((d) => ({ ...d, summary: e.target.value }))}
                placeholder="A concise professional summary…"
              />
              <EnhanceBtn label="Enhance summary with AI" onClick={onEnhanceSummary} />
            </div>
          )}

          {key === "experience" && (
            <ListEditor
              items={data.experience}
              onAdd={() =>
                onChange((d) => ({
                  ...d,
                  experience: [...d.experience, { id: createId(), role: "", company: "", period: "", description: "" }],
                }))
              }
              onRemove={(id) => onChange((d) => ({ ...d, experience: d.experience.filter((x) => x.id !== id) }))}
              addLabel="Add experience"
              render={(item) => (
                <div className={styles.stack}>
                  <div className={styles.grid2}>
                    <InputField placeholder="Role" value={item.role} onChange={(e) => updateItem("experience", item.id, "role", e.target.value, onChange)} />
                    <InputField placeholder="Company" value={item.company} onChange={(e) => updateItem("experience", item.id, "company", e.target.value, onChange)} />
                  </div>
                  <InputField placeholder="Period (e.g. 2022 — Present)" value={item.period} onChange={(e) => updateItem("experience", item.id, "period", e.target.value, onChange)} />
                  <TextareaField placeholder="Describe your impact…" value={item.description} onChange={(e) => updateItem("experience", item.id, "description", e.target.value, onChange)} />
                  <EnhanceBtn label="Strengthen bullet points" onClick={() => onEnhanceExperience(item.id)} />
                </div>
              )}
            />
          )}

          {key === "projects" && (
            <ListEditor
              items={data.projects}
              onAdd={() =>
                onChange((d) => ({ ...d, projects: [...d.projects, { id: createId(), name: "", tech: "", description: "" }] }))
              }
              onRemove={(id) => onChange((d) => ({ ...d, projects: d.projects.filter((x) => x.id !== id) }))}
              addLabel="Add project"
              render={(item) => (
                <div className={styles.stack}>
                  <div className={styles.grid2}>
                    <InputField placeholder="Project name" value={item.name} onChange={(e) => updateItem("projects", item.id, "name", e.target.value, onChange)} />
                    <InputField placeholder="Tech stack" value={item.tech} onChange={(e) => updateItem("projects", item.id, "tech", e.target.value, onChange)} />
                  </div>
                  <TextareaField placeholder="What did you build?…" value={item.description} onChange={(e) => updateItem("projects", item.id, "description", e.target.value, onChange)} />
                  <EnhanceBtn label="Improve description" onClick={() => onEnhanceProject(item.id)} />
                </div>
              )}
            />
          )}

          {key === "education" && (
            <ListEditor
              items={data.education}
              onAdd={() =>
                onChange((d) => ({ ...d, education: [...d.education, { id: createId(), degree: "", institution: "", period: "", details: "" }] }))
              }
              onRemove={(id) => onChange((d) => ({ ...d, education: d.education.filter((x) => x.id !== id) }))}
              addLabel="Add education"
              render={(item) => (
                <div className={styles.stack}>
                  <div className={styles.grid2}>
                    <InputField placeholder="Degree" value={item.degree} onChange={(e) => updateItem("education", item.id, "degree", e.target.value, onChange)} />
                    <InputField placeholder="Institution" value={item.institution} onChange={(e) => updateItem("education", item.id, "institution", e.target.value, onChange)} />
                  </div>
                  <InputField placeholder="Period" value={item.period} onChange={(e) => updateItem("education", item.id, "period", e.target.value, onChange)} />
                  <InputField placeholder="Details (optional)" value={item.details} onChange={(e) => updateItem("education", item.id, "details", e.target.value, onChange)} />
                </div>
              )}
            />
          )}

          {key === "certifications" && (
            <ListEditor
              items={data.certifications}
              onAdd={() =>
                onChange((d) => ({ ...d, certifications: [...d.certifications, { id: createId(), name: "", issuer: "", year: "" }] }))
              }
              onRemove={(id) => onChange((d) => ({ ...d, certifications: d.certifications.filter((x) => x.id !== id) }))}
              addLabel="Add certification"
              render={(item) => (
                <div className={styles.grid3}>
                  <InputField placeholder="Name" value={item.name} onChange={(e) => updateItem("certifications", item.id, "name", e.target.value, onChange)} />
                  <InputField placeholder="Issuer" value={item.issuer} onChange={(e) => updateItem("certifications", item.id, "issuer", e.target.value, onChange)} />
                  <InputField placeholder="Year" value={item.year} onChange={(e) => updateItem("certifications", item.id, "year", e.target.value, onChange)} />
                </div>
              )}
            />
          )}

          {key === "skills" && (
            <TagEditor
              values={data.skills}
              onChange={(skills) => onChange((d) => ({ ...d, skills }))}
              placeholder="Add a skill and press Enter"
            />
          )}

          {key === "languages" && (
            <TagEditor
              values={data.languages}
              onChange={(languages) => onChange((d) => ({ ...d, languages }))}
              placeholder="Add a language and press Enter"
            />
          )}

          {key === "achievements" && (
            <TagEditor
              values={data.achievements}
              onChange={(achievements) => onChange((d) => ({ ...d, achievements }))}
              placeholder="Add an achievement and press Enter"
              stacked
            />
          )}
        </SectionGroup>
      ))}
    </div>
  );
}

type ListKey = "experience" | "projects" | "education" | "certifications";

function updateItem<K extends ListKey>(
  key: K,
  id: string,
  field: string,
  value: string,
  onChange: (updater: (data: ResumeData) => ResumeData) => void
) {
  onChange((d) => ({
    ...d,
    [key]: (d[key] as { id: string }[]).map((it) =>
      it.id === id ? { ...it, [field]: value } : it
    ),
  }));
}

function SectionGroup({
  title,
  children,
  reorder,
}: {
  title: string;
  children: React.ReactNode;
  reorder?: { canUp: boolean; canDown: boolean; onUp: () => void; onDown: () => void };
}) {
  return (
    <div className={styles.group}>
      <div className={styles.groupHead}>
        <h3 className={styles.groupTitle}>{title}</h3>
        {reorder && (
          <div className={styles.reorder}>
            <button onClick={reorder.onUp} disabled={!reorder.canUp} aria-label="Move section up">
              <IconChevronUp size={16} />
            </button>
            <button onClick={reorder.onDown} disabled={!reorder.canDown} aria-label="Move section down">
              <IconChevronDown size={16} />
            </button>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

function EnhanceBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className={styles.enhance} onClick={onClick}>
      <IconSparkles size={15} /> {label}
    </button>
  );
}

function ListEditor<T extends { id: string }>({
  items,
  onAdd,
  onRemove,
  addLabel,
  render,
}: {
  items: T[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  addLabel: string;
  render: (item: T) => React.ReactNode;
}) {
  return (
    <div className={styles.stack}>
      {items.map((item) => (
        <div key={item.id} className={styles.listItem}>
          {render(item)}
          <button className={styles.removeBtn} onClick={() => onRemove(item.id)} aria-label="Remove">
            <IconTrash size={15} />
          </button>
        </div>
      ))}
      <button className={styles.addBtn} onClick={onAdd}>
        <IconPlus size={16} /> {addLabel}
      </button>
    </div>
  );
}

function TagEditor({
  values,
  onChange,
  placeholder,
  stacked,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
  stacked?: boolean;
}) {
  return (
    <div className={styles.stack}>
      <div className={stacked ? styles.tagStack : styles.tagRow}>
        {values.map((v, i) => (
          <span key={`${v}-${i}`} className={styles.tag}>
            {v}
            <button onClick={() => onChange(values.filter((_, idx) => idx !== i))} aria-label={`Remove ${v}`}>
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        className={styles.tagInput}
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const val = e.currentTarget.value.trim();
            if (val) {
              onChange([...values, val]);
              e.currentTarget.value = "";
            }
          }
        }}
      />
    </div>
  );
}
