import { useState } from "react";
import { useNavigate } from "react-router";
import { IconAlertTriangle, IconCrown, IconSparkles } from "@tabler/icons-react";

import { PageHeader } from "~/components/app-shell/page-header";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { useApp } from "~/context/app-context";
import { aiDelay, makeExecutive } from "~/services/ai";
import { createId, sampleResumeData } from "~/data/sample-resume";
import { DEFAULT_SECTION_ORDER, type Resume } from "~/types/resume";

import tool from "./tool.module.css";
import styles from "./generator.module.css";

const PERKS = [
  "Premium, recruiter-oriented wording",
  "Leadership & impact emphasis",
  "High-end executive structure",
  "Serif executive template applied",
];

export default function Executive() {
  const { credits, spendExecutiveCredit, addResume } = useApp();
  const navigate = useNavigate();
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  const noCredits = credits.executiveRemaining <= 0;

  async function generate() {
    setError("");
    if (noCredits) {
      setError("You've used your lifetime executive resume credit. Upgrade to Pro for unlimited.");
      return;
    }
    if (!spendExecutiveCredit()) {
      setError("You've used your lifetime executive resume credit.");
      return;
    }
    setGenerating(true);
    await aiDelay(2000);
    const resume: Resume = {
      id: createId(),
      title: `${sampleResumeData.contact.name} — Executive Resume`,
      kind: "executive",
      template: "executive",
      sectionOrder: [...DEFAULT_SECTION_ORDER],
      updatedAt: new Date().toISOString(),
      atsScore: 95,
      data: makeExecutive(structuredClone(sampleResumeData)),
    };
    addResume(resume);
    navigate(`/dashboard/editor/${resume.id}`);
  }

  return (
    <div>
      <PageHeader
        title="Executive Resume Generator"
        subtitle="A premium, recruiter-ready resume that emphasises leadership and impact."
        action={
          <span className={tool.creditPill}>
            <IconCrown size={14} /> {credits.executiveRemaining}/{credits.executiveTotal} lifetime
          </span>
        }
      />

      <div className={tool.layout}>
        <Card className={`${tool.card} ${styles.premium}`}>
          <div className={styles.intro}>
            <div className={`${styles.iconWrap} ${styles.crownIcon}`}>
              <IconCrown size={24} />
            </div>
            <div>
              <h3 className={styles.heading}>Generate an executive resume</h3>
              <p className={styles.text}>
                We elevate your profile with premium structure and leadership-focused wording, then
                open it in the editor for final touches.
              </p>
            </div>
          </div>

          <ul className={styles.perks}>
            {PERKS.map((p) => (
              <li key={p}>
                <IconSparkles size={15} /> {p}
              </li>
            ))}
          </ul>

          {error && (
            <p className={tool.error}>
              <IconAlertTriangle size={16} /> {error}
            </p>
          )}

          <Button onClick={generate} disabled={generating || noCredits}>
            {generating ? (
              <>
                <Spinner size={16} /> Crafting your executive resume…
              </>
            ) : (
              <>
                <IconCrown size={18} /> Generate executive resume
              </>
            )}
          </Button>
          {noCredits && !error && (
            <p className={tool.hint}>Your lifetime free executive credit has been used.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
