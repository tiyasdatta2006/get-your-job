import { DEFAULT_SECTION_ORDER, type Resume, type ResumeData } from "~/types/resume";

export function createId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export const sampleResumeData: ResumeData = {
  contact: {
    name: "Aarav Sharma",
    email: "aarav.sharma@gmail.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, Karnataka",
    linkedin: "linkedin.com/in/aaravsharma",
    github: "github.com/aaravsharma",
    portfolio: "aarav.dev",
    photo: "",
  },
  summary:
    "Full-stack engineer with 5+ years building scalable web platforms for fintech and SaaS products. Specialised in React, Node.js and cloud-native architectures, with a track record of shipping features that drive measurable revenue growth.",
  skills: [
    "React",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "AWS",
    "Docker",
    "GraphQL",
    "System Design",
  ],
  experience: [
    {
      id: createId(),
      role: "Senior Software Engineer",
      company: "Razorpay",
      period: "2022 — Present",
      description:
        "Led migration of the payments dashboard to React 18, cutting load time by 40%. Mentored a team of 4 engineers and owned the checkout reliability roadmap.",
    },
    {
      id: createId(),
      role: "Software Engineer",
      company: "Flipkart",
      period: "2019 — 2022",
      description:
        "Built reusable component library adopted across 6 product teams. Improved API throughput by 30% through query optimisation and caching.",
    },
  ],
  education: [
    {
      id: createId(),
      degree: "B.Tech, Computer Science",
      institution: "IIT Delhi",
      period: "2015 — 2019",
      details: "CGPA 8.7 / 10. Core member of the coding club.",
    },
  ],
  projects: [
    {
      id: createId(),
      name: "OpenLedger",
      tech: "React, Node.js, PostgreSQL",
      description:
        "Open-source double-entry accounting engine with 1.2k GitHub stars and an active contributor community.",
    },
  ],
  certifications: [
    {
      id: createId(),
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      year: "2023",
    },
  ],
  achievements: [
    "Winner, Smart India Hackathon 2018",
    "Speaker at React India 2023",
  ],
  languages: ["English", "Hindi", "Kannada"],
};

export function createSampleResumes(): Resume[] {
  return [
    {
      id: createId(),
      title: "Aarav Sharma — ATS Resume",
      kind: "ats",
      template: "modern",
      sectionOrder: [...DEFAULT_SECTION_ORDER],
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      data: structuredClone(sampleResumeData),
      atsScore: 86,
    },
    {
      id: createId(),
      title: "Senior Engineer @ Stripe — Optimized",
      kind: "optimized",
      template: "classic",
      sectionOrder: [...DEFAULT_SECTION_ORDER],
      updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
      data: structuredClone(sampleResumeData),
      targetRole: "Senior Frontend Engineer",
      company: "Stripe",
      atsScore: 92,
    },
  ];
}
