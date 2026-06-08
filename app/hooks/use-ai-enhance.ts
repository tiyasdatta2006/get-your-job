import { useCallback, useState } from "react";

import type { ResumeData } from "~/types/resume";
import {
  aiDelay,
  enhanceExperience,
  enhanceProject,
  enhanceSummary,
} from "~/services/ai";
import type { EnhancePrompt } from "~/components/resume/ai-enhance-modal";

export const SUMMARY_MIN = 120;
export const DESC_MIN = 90;

interface UseAiEnhanceArgs {
  data: ResumeData;
  targetRole: string;
  onChange: (updater: (data: ResumeData) => ResumeData) => void;
}

export function useAiEnhance({ data, targetRole, onChange }: UseAiEnhanceArgs) {
  const [prompt, setPrompt] = useState<EnhancePrompt | null>(null);
  const [loading, setLoading] = useState(false);

  const run = useCallback(async (apply: () => void) => {
    setLoading(true);
    await aiDelay(1200);
    apply();
    setLoading(false);
    setPrompt(null);
  }, []);

  const enhanceSummaryFlow = useCallback(() => {
    const tooShort = data.summary.trim().length < SUMMARY_MIN;
    setPrompt({
      title: "Enhance professional summary",
      description: tooShort
        ? "Your summary looks a little short. AI can expand it into a compelling, recruiter-ready paragraph. Continue?"
        : "AI can refine and strengthen your professional summary. Continue?",
      onConfirm: () =>
        run(() => onChange((d) => ({ ...d, summary: enhanceSummary(d.summary, targetRole) }))),
    });
  }, [data.summary, targetRole, onChange, run]);

  const enhanceExperienceFlow = useCallback(
    (id: string) => {
      setPrompt({
        title: "Strengthen experience",
        description:
          "AI can strengthen these experience bullet points with measurable, recruiter-friendly language. Continue?",
        onConfirm: () =>
          run(() =>
            onChange((d) => ({
              ...d,
              experience: d.experience.map((e) =>
                e.id === id ? { ...e, description: enhanceExperience(e.description) } : e
              ),
            }))
          ),
      });
    },
    [onChange, run]
  );

  const enhanceProjectFlow = useCallback(
    (id: string) => {
      setPrompt({
        title: "Improve project description",
        description: "AI can improve this project description for clarity and impact. Continue?",
        onConfirm: () =>
          run(() =>
            onChange((d) => ({
              ...d,
              projects: d.projects.map((p) =>
                p.id === id ? { ...p, description: enhanceProject(p.description) } : p
              ),
            }))
          ),
      });
    },
    [onChange, run]
  );

  return {
    prompt,
    loading,
    closePrompt: () => setPrompt(null),
    enhanceSummaryFlow,
    enhanceExperienceFlow,
    enhanceProjectFlow,
  };
}
