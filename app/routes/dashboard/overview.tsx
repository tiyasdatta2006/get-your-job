import { Link } from "react-router";
import {
  IconArrowRight,
  IconFileText,
  IconSparkles,
  IconTargetArrow,
} from "@tabler/icons-react";

import { PageHeader } from "~/components/app-shell/page-header";
import { Card } from "~/components/ui/card";
import { ResumeCard } from "~/components/resume/resume-card";
import { useApp } from "~/context/app-context";

import styles from "./overview.module.css";

const TOOLS = [
  {
    to: "/dashboard/optimizer",
    icon: IconTargetArrow,
    title: "JD Optimizer",
    desc: "Tailor your resume to a specific job description.",
  },
  {
    to: "/dashboard/builder",
    icon: IconFileText,
    title: "ATS Builder",
    desc: "Create a clean, ATS-friendly resume from scratch.",
  },
  {
    to: "/dashboard/executive",
    icon: IconSparkles,
    title: "Executive Generator",
    desc: "Premium, recruiter-ready leadership resume.",
  },
];

export default function Overview() {
  const { user, resumes, deleteResume } = useApp();

  return (
    <div>
      <PageHeader
        title={`Welcome${user ? ", " + user.name.split(" ")[0] : ""} 👋`}
        subtitle="Pick a tool to get started or jump back into a resume."
      />

      <div className={styles.tools}>
        {TOOLS.map(({ to, icon: Icon, title, desc }) => (
          <Link key={to} to={to}>
            <Card interactive className={styles.toolCard}>
              <div className={styles.toolIcon}>
                <Icon size={22} stroke={1.7} />
              </div>
              <div className={styles.toolText}>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
              <IconArrowRight size={18} className={styles.toolArrow} />
            </Card>
          </Link>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>Your resumes</h2>
      {resumes.length === 0 ? (
        <Card className={styles.empty}>
          <p>No resumes yet. Create your first one with any tool above.</p>
        </Card>
      ) : (
        <div className={styles.grid}>
          {resumes.map((r) => (
            <ResumeCard key={r.id} resume={r} onDelete={deleteResume} />
          ))}
        </div>
      )}
    </div>
  );
}
