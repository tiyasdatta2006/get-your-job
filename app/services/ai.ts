import type { ResumeData } from "~/types/resume";

export interface JdAnalysis {
  keywords: string[];
  skills: string[];
  responsibilities: string[];
  technologies: string[];
  matchScore: number;
  missingSkills: string[];
}

const STOP_WORDS = new Set([
  "the", "and", "for", "with", "you", "are", "our", "will", "that", "this",
  "have", "from", "your", "work", "team", "role", "job", "who", "all", "can",
  "into", "out", "per", "a", "to", "of", "in", "on", "as", "is", "we", "be",
  "an", "or", "at", "by", "it", "experience", "years", "strong", "ability",
]);

const KNOWN_TECH = [
  "react", "angular", "vue", "node", "node.js", "typescript", "javascript",
  "python", "java", "go", "rust", "aws", "gcp", "azure", "docker", "kubernetes",
  "graphql", "rest", "postgresql", "mysql", "mongodb", "redis", "kafka",
  "next.js", "express", "django", "flask", "spring", "tailwind", "figma",
];

const SOFT_SKILLS = [
  "leadership", "communication", "collaboration", "mentoring", "ownership",
  "problem-solving", "agile", "scrum", "stakeholder", "architecture",
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9.+#\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function unique(arr: string[]): string[] {
  return Array.from(new Set(arr));
}

export function analyzeJobDescription(jd: string, profileSkills: string[]): JdAnalysis {
  const tokens = tokenize(jd);
  const lower = jd.toLowerCase();

  const technologies = unique(KNOWN_TECH.filter((t) => lower.includes(t))).map(titleize);
  const skills = unique(SOFT_SKILLS.filter((s) => lower.includes(s))).map(titleize);

  const freq = new Map<string, number>();
  tokens.forEach((t) => freq.set(t, (freq.get(t) ?? 0) + 1));
  const keywords = unique(
    Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([w]) => titleize(w))
  );

  const responsibilities = jd
    .split(/\n|\.|;|•|-/)
    .map((s) => s.trim())
    .filter((s) => s.length > 24 && /[a-z]/i.test(s))
    .slice(0, 5)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1));

  const profileLower = profileSkills.map((s) => s.toLowerCase());
  const requiredSkills = unique([...technologies, ...skills]);
  const matched = requiredSkills.filter((s) =>
    profileLower.some((p) => p.includes(s.toLowerCase()) || s.toLowerCase().includes(p))
  );
  const missingSkills = requiredSkills.filter((s) => !matched.includes(s));
  const matchScore =
    requiredSkills.length === 0
      ? 78
      : Math.round((matched.length / requiredSkills.length) * 100);

  return {
    keywords,
    skills,
    responsibilities,
    technologies,
    matchScore: Math.max(matchScore, 55),
    missingSkills,
  };
}

function titleize(word: string): string {
  if (KNOWN_TECH.includes(word.toLowerCase())) {
    const map: Record<string, string> = {
      "node.js": "Node.js",
      "next.js": "Next.js",
      aws: "AWS",
      gcp: "GCP",
      "rest": "REST",
      graphql: "GraphQL",
      postgresql: "PostgreSQL",
      mysql: "MySQL",
      mongodb: "MongoDB",
    };
    return map[word.toLowerCase()] ?? word.charAt(0).toUpperCase() + word.slice(1);
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/** Simulate latency for AI-style operations. */
export function aiDelay(ms = 1400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function enhanceSummary(summary: string, role: string): string {
  const target = role || "high-impact engineering";
  const base = summary.trim();
  return `Results-driven professional with a proven record of delivering ${target.toLowerCase()} outcomes. ${
    base ? base + " " : ""
  }Recognised for translating complex requirements into elegant, scalable solutions, and for consistently exceeding business and quality targets across cross-functional teams.`;
}

export function enhanceExperience(description: string): string {
  const base = description.trim();
  return `${base ? base + " " : ""}Drove measurable impact by owning end-to-end delivery, improving key metrics by 25–40%, and partnering with product and design to ship on aggressive timelines.`;
}

export function enhanceProject(description: string): string {
  const base = description.trim();
  return `${base ? base + " " : ""}Architected for scale and reliability, with thorough testing and documentation that accelerated adoption and reduced maintenance overhead.`;
}

export function makeExecutive(data: ResumeData): ResumeData {
  return {
    ...data,
    summary: `Visionary leader with executive command of ${
      data.skills.slice(0, 3).join(", ") || "modern technology"
    } and a relentless focus on outcomes. ${data.summary} Trusted to set strategy, build high-performing teams, and deliver transformational business results.`,
    experience: data.experience.map((e) => ({
      ...e,
      description: `Spearheaded ${e.description.charAt(0).toLowerCase() + e.description.slice(1)} Championed organisational excellence and delivered board-level impact.`,
    })),
  };
}
