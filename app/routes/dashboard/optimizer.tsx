import { useState } from "react";
import { useNavigate } from "react-router";
import { IconAlertTriangle, IconSparkles, IconTargetArrow } from "@tabler/icons-react";

import { PageHeader } from "~/components/app-shell/page-header";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { InputField, TextareaField } from "~/components/ui/field";
import { Spinner } from "~/components/ui/spinner";
import { useApp } from "~/context/app-context";
import { aiDelay, analyzeJobDescription, type JdAnalysis } from "~/services/ai";
import { sampleResumeData, createId } from "~/data/sample-resume";
import { DEFAULT_SECTION_ORDER, type Resume } from "~/types/resume";

import styles from "./tool.module.css";

type Stage = "input" | "analyzing" | "result";

export default function Optimizer() {
  const { credits, spendOptimizeCredit, addResume } = useApp();
  const navigate = useNavigate();

  const [jd, setJd] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [stage, setStage] = useState<Stage>("input");
  const [analysis, setAnalysis] = useState<JdAnalysis | null>(null);
  const [error, setError] = useState("");

  const noCredits = credits.optimizeRemaining <= 0;

  async function handleOptimize() {
    setError("");
    if (jd.trim().length < 40) {
      setError("Please paste a more detailed job description (at least 40 characters).");
      return;
    }
    if (noCredits) {
      setError("You're out of optimization credits for this month.");
      return;
    }
    if (!spendOptimizeCredit()) {
      setError("You're out of optimization credits for this month.");
      return;
    }
    setStage("analyzing");
    await aiDelay(1800);
    const result = analyzeJobDescription(jd, sampleResumeData.skills);
    setAnalysis(result);
    setStage("result");
  }

  function createOptimizedResume() {
    if (!analysis) return;
    const mergedSkills = Array.from(
      new Set([...sampleResumeData.skills, ...analysis.technologies, ...analysis.skills])
    );
    const resume: Resume = {
      id: createId(),
      title: `${role || "Role"} @ ${company || "Company"} — Optimized`,
      kind: "optimized",
      template: "modern",
      sectionOrder: [...DEFAULT_SECTION_ORDER],
      updatedAt: new Date().toISOString(),
      targetRole: role,
      company,
      atsScore: Math.min(98, analysis.matchScore + 8),
      data: {
        ...structuredClone(sampleResumeData),
        skills: mergedSkills,
        summary: `${role || "Experienced professional"} targeting ${
          company || "a leading company"
        }. ${sampleResumeData.summary}`,
      },
    };
    addResume(resume);
    navigate(`/dashboard/editor/${resume.id}`);
  }

  return (
    <div>
      <PageHeader
        title="JD Optimizer"
        subtitle="Paste a job description and tailor your resume to beat the ATS."
        action={
          <span className={styles.creditPill}>
            <IconSparkles size={14} /> {credits.optimizeRemaining} credits left
          </span>
        }
      />

      {stage !== "result" && (
        <div className={styles.layout}>
          <Card className={styles.card}>
            <div className={styles.grid2}>
              <InputField label="Company name" placeholder="e.g. Stripe" value={company} onChange={(e) => setCompany(e.target.value)} />
              <InputField label="Job role" placeholder="e.g. Senior Frontend Engineer" value={role} onChange={(e) => setRole(e.target.value)} />
            </div>
            <TextareaField
              label="Job description"
              placeholder="Paste the full job description here…"
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              className={styles.jdInput}
            />
            {error && (
              <p className={styles.error}>
                <IconAlertTriangle size={16} /> {error}
              </p>
            )}
            <Button onClick={handleOptimize} disabled={stage === "analyzing" || noCredits}>
              {stage === "analyzing" ? (
                <>
                  <Spinner size={16} /> Analyzing job description…
                </>
              ) : (
                <>
                  <IconTargetArrow size={18} /> Optimize — 1 credit
                </>
              )}
            </Button>
            {noCredits && (
              <p className={styles.hint}>Free credits reset monthly. Upgrade to Pro for unlimited optimizations.</p>
            )}
          </Card>

          {stage === "analyzing" && (
            <Card className={styles.card}>
              <AnalyzingSteps />
            </Card>
          )}
        </div>
      )}

      {stage === "result" && analysis && (
        <AnalysisResult
          analysis={analysis}
          onCreate={createOptimizedResume}
          onBack={() => setStage("input")}
        />
      )}
    </div>
  );
}

const STEP_LABELS = [
  "Analyzing job description…",
  "Extracting keywords, skills & technologies…",
  "Comparing against your profile…",
  "Generating optimized resume…",
];

function AnalyzingSteps() {
  return (
    <div className={styles.steps}>
      {STEP_LABELS.map((label, i) => (
        <div key={label} className={styles.step} style={{ animationDelay: `${i * 0.45}s` }}>
          <Spinner size={16} /> {label}
        </div>
      ))}
    </div>
  );
}

function AnalysisResult({
  analysis,
  onCreate,
  onBack,
}: {
  analysis: JdAnalysis;
  onCreate: () => void;
  onBack: () => void;
}) {
  return (
    <div className={styles.resultGrid}>
      <Card className={styles.scoreCard}>
        <div className={styles.scoreRing} style={{ "--score": analysis.matchScore } as React.CSSProperties}>
          <span className={styles.scoreValue}>{analysis.matchScore}%</span>
        </div>
        <p className={styles.scoreLabel}>Profile match</p>
        <Button fullWidth onClick={onCreate}>
          <IconSparkles size={16} /> Generate optimized resume
        </Button>
        <Button fullWidth variant="ghost" onClick={onBack}>
          Analyze another
        </Button>
      </Card>

      <div className={styles.insights}>
        <InsightBlock title="Technologies" items={analysis.technologies} tone="primary" />
        <InsightBlock title="Skills" items={analysis.skills} tone="accent" />
        <InsightBlock title="Top keywords" items={analysis.keywords} tone="muted" />
        {analysis.missingSkills.length > 0 && (
          <InsightBlock title="Gaps to address" items={analysis.missingSkills} tone="warning" />
        )}
        {analysis.responsibilities.length > 0 && (
          <Card className={styles.respCard}>
            <h3 className={styles.insightTitle}>Key responsibilities</h3>
            <ul className={styles.respList}>
              {analysis.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}

function InsightBlock({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "primary" | "accent" | "muted" | "warning";
}) {
  if (items.length === 0) return null;
  return (
    <Card className={styles.insightCard}>
      <h3 className={styles.insightTitle}>{title}</h3>
      <div className={styles.chips}>
        {items.map((it) => (
          <span key={it} className={`${styles.chip} ${styles[tone]}`}>
            {it}
          </span>
        ))}
      </div>
    </Card>
  );
}
