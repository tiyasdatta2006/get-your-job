import { useState } from "react";
import { useNavigate } from "react-router";
import {
  IconFileText,
  IconLanguage,
  IconPencil,
  IconSparkles,
  IconWand,
} from "@tabler/icons-react";

import { PageHeader } from "~/components/app-shell/page-header";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { InputField } from "~/components/ui/field";
import { useApp } from "~/context/app-context";
import { createId, sampleResumeData } from "~/data/sample-resume";
import { DEFAULT_SECTION_ORDER, type Resume, type ResumeData } from "~/types/resume";

import tool from "./tool.module.css";
import styles from "./generator.module.css";

const AI_FEATURES = [
  { icon: IconPencil, label: "Improve grammar" },
  { icon: IconWand, label: "Improve formatting" },
  { icon: IconLanguage, label: "Improve wording" },
];

function emptyData(): ResumeData {
  return {
    contact: {
      name: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
      photo: "",
    },
    summary: "",
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
  };
}

export default function Builder() {
  const { addResume } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState("");

  function create(prefill: boolean) {
    const data = prefill ? structuredClone(sampleResumeData) : emptyData();
    if (!prefill && name.trim()) data.contact.name = name.trim();
    const resume: Resume = {
      id: createId(),
      title: name.trim() ? `${name.trim()} — ATS Resume` : "Untitled ATS Resume",
      kind: "ats",
      template: "modern",
      sectionOrder: [...DEFAULT_SECTION_ORDER],
      updatedAt: new Date().toISOString(),
      atsScore: prefill ? 84 : undefined,
      data,
    };
    addResume(resume);
    navigate(`/dashboard/editor/${resume.id}`);
  }

  return (
    <div>
      <PageHeader
        title="ATS Resume Builder"
        subtitle="Generate a clean, parser-friendly resume. Unlimited on the free plan."
      />

      <div className={tool.layout}>
        <Card className={tool.card}>
          <div className={styles.intro}>
            <div className={styles.iconWrap}>
              <IconFileText size={24} />
            </div>
            <div>
              <h3 className={styles.heading}>Start a new ATS resume</h3>
              <p className={styles.text}>
                Build from scratch or start with a sample you can fully edit. The live editor
                supports AI grammar, wording and formatting improvements.
              </p>
            </div>
          </div>

          <InputField
            label="Your name"
            placeholder="e.g. Aarav Sharma"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className={tool.grid2}>
            <Button onClick={() => create(false)}>
              <IconFileText size={18} /> Start blank
            </Button>
            <Button variant="secondary" onClick={() => create(true)}>
              <IconSparkles size={18} /> Use sample
            </Button>
          </div>

          <div className={styles.featureRow}>
            {AI_FEATURES.map(({ icon: Icon, label }) => (
              <span key={label} className={styles.feature}>
                <Icon size={15} /> {label}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
