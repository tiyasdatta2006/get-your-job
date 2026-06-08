export type ResumeTemplate = "modern" | "classic" | "executive" | "compact";

export type ResumeKind = "ats" | "optimized" | "executive";

export interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  photo?: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  details: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  tech: string;
  description: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export type ResumeSectionKey =
  | "summary"
  | "experience"
  | "projects"
  | "education"
  | "skills"
  | "certifications"
  | "achievements"
  | "languages";

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  achievements: string[];
  languages: string[];
}

export interface Resume {
  id: string;
  title: string;
  kind: ResumeKind;
  template: ResumeTemplate;
  sectionOrder: ResumeSectionKey[];
  updatedAt: string;
  data: ResumeData;
  /** Set for optimized resumes */
  targetRole?: string;
  company?: string;
  atsScore?: number;
}

export const DEFAULT_SECTION_ORDER: ResumeSectionKey[] = [
  "summary",
  "experience",
  "projects",
  "skills",
  "education",
  "certifications",
  "achievements",
  "languages",
];

export const SECTION_LABELS: Record<ResumeSectionKey, string> = {
  summary: "Professional Summary",
  experience: "Experience",
  projects: "Projects",
  education: "Education",
  skills: "Skills",
  certifications: "Certifications",
  achievements: "Achievements",
  languages: "Languages",
};

export const TEMPLATE_LABELS: Record<ResumeTemplate, string> = {
  modern: "Modern",
  classic: "Classic",
  executive: "Executive",
  compact: "Compact",
};
