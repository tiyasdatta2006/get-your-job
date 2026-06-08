import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { IconArrowLeft, IconCheck, IconLayoutGrid } from "@tabler/icons-react";
import cx from "classnames";

import { useApp } from "~/context/app-context";
import type { Resume, ResumeData, ResumeSectionKey, ResumeTemplate } from "~/types/resume";
import { TEMPLATE_LABELS } from "~/types/resume";
import { ResumePreview } from "~/components/resume/resume-preview";
import { EditorForm } from "~/components/resume/editor-form";
import { ExportMenu } from "~/components/resume/export-menu";
import { AiEnhanceModal } from "~/components/resume/ai-enhance-modal";
import { useAiEnhance } from "~/hooks/use-ai-enhance";
import { useResumeExport } from "~/hooks/use-resume-export";

import styles from "./editor.module.css";

const TEMPLATES: ResumeTemplate[] = ["modern", "classic", "executive", "compact"];

export default function Editor() {
  const { id } = useParams();
  const { getResume, updateResume } = useApp();
  const stored = id ? getResume(id) : undefined;

  const [working, setWorking] = useState<Resume | undefined>(stored);
  const [saved, setSaved] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { exportResume, exporting } = useResumeExport();

  // Sync once when stored resume becomes available.
  useEffect(() => {
    if (stored && !working) setWorking(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stored]);

  const persist = useCallback(
    (next: Resume) => {
      setWorking(next);
      if (id) updateResume(id, () => ({ ...next, updatedAt: new Date().toISOString() }));
      setSaved(true);
      window.clearTimeout((persist as unknown as { t?: number }).t);
      (persist as unknown as { t?: number }).t = window.setTimeout(() => setSaved(false), 1500);
    },
    [id, updateResume]
  );

  const handleDataChange = useCallback(
    (updater: (data: ResumeData) => ResumeData) => {
      setWorking((w) => {
        if (!w) return w;
        const next = { ...w, data: updater(w.data) };
        if (id) updateResume(id, () => ({ ...next, updatedAt: new Date().toISOString() }));
        return next;
      });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1500);
    },
    [id, updateResume]
  );

  const handleReorder = useCallback(
    (key: ResumeSectionKey, dir: "up" | "down") => {
      setWorking((w) => {
        if (!w) return w;
        const order = [...w.sectionOrder];
        const idx = order.indexOf(key);
        const target = dir === "up" ? idx - 1 : idx + 1;
        if (target < 0 || target >= order.length) return w;
        [order[idx], order[target]] = [order[target], order[idx]];
        const next = { ...w, sectionOrder: order };
        if (id) updateResume(id, () => ({ ...next, updatedAt: new Date().toISOString() }));
        return next;
      });
    },
    [id, updateResume]
  );

  const setTemplate = (template: ResumeTemplate) => {
    if (working) persist({ ...working, template });
  };

  const ai = useAiEnhance({
    data: working?.data ?? ({} as ResumeData),
    targetRole: working?.targetRole ?? "",
    onChange: handleDataChange,
  });

  if (!working) {
    return (
      <div className={styles.notFound}>
        <h2>Resume not found</h2>
        <Link to="/dashboard" className={styles.backLink}>
          <IconArrowLeft size={16} /> Back to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.editor}>
      <header className={styles.bar}>
        <Link to="/dashboard" className={styles.backLink}>
          <IconArrowLeft size={18} /> Back
        </Link>
        <div className={styles.barCenter}>
          <input
            className={styles.titleInput}
            value={working.title}
            onChange={(e) => persist({ ...working, title: e.target.value })}
          />
          {saved && (
            <span className={styles.saved}>
              <IconCheck size={14} /> Saved
            </span>
          )}
        </div>
        <ExportMenu
          exporting={exporting}
          onExport={(format) => exportResume(format, previewRef.current, working)}
        />
      </header>

      <div className={styles.templates}>
        <span className={styles.templatesLabel}>
          <IconLayoutGrid size={15} /> Template
        </span>
        {TEMPLATES.map((t) => (
          <button
            key={t}
            className={cx(styles.templateBtn, working.template === t && styles.templateActive)}
            onClick={() => setTemplate(t)}
          >
            {TEMPLATE_LABELS[t]}
          </button>
        ))}
      </div>

      <div className={styles.split}>
        <div className={styles.formPane}>
          <EditorForm
            resume={working}
            onChange={handleDataChange}
            onReorder={handleReorder}
            onEnhanceSummary={ai.enhanceSummaryFlow}
            onEnhanceExperience={ai.enhanceExperienceFlow}
            onEnhanceProject={ai.enhanceProjectFlow}
          />
        </div>
        <div className={styles.previewPane}>
          <div className={styles.previewScroll}>
            <ResumePreview resume={working} className={styles.preview} ref={previewRef} />
          </div>
        </div>
      </div>

      <AiEnhanceModal prompt={ai.prompt} loading={ai.loading} onClose={ai.closePrompt} />
    </div>
  );
}
