import { useState } from "react";
import {
  IconArrowRight,
  IconCheck,
  IconFileText,
  IconRosetteDiscountCheck,
  IconSparkles,
  IconTargetArrow,
} from "@tabler/icons-react";

import type { Route } from "./+types/home";
import { LandingNav } from "~/components/landing/landing-nav";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { AuthModal } from "~/components/auth/auth-modal";
import { useApp } from "~/context/app-context";
import { useNavigate } from "react-router";

import styles from "./home.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "GetYourJob — AI Resume Builder & Optimizer for India" },
    {
      name: "description",
      content:
        "Create ATS-friendly resumes, optimize for any job description, and generate executive-grade resumes with AI. Built for Indian job seekers.",
    },
  ];
}

const FEATURES = [
  {
    icon: IconTargetArrow,
    title: "JD Optimizer",
    desc: "Paste any job description. We extract keywords, skills and responsibilities, then tailor your resume to beat the ATS.",
  },
  {
    icon: IconFileText,
    title: "ATS Resume Builder",
    desc: "Fill a guided form and instantly get a clean, parser-friendly resume — with AI grammar, wording and formatting fixes.",
  },
  {
    icon: IconSparkles,
    title: "Executive Generator",
    desc: "Recruiter-ready, leadership-focused resumes with premium structure and high-end formatting.",
  },
  {
    icon: IconRosetteDiscountCheck,
    title: "Live Editor",
    desc: "Edit on the left, watch the preview update instantly. Switch templates and export to PDF, DOCX, PNG or JPG.",
  },
];

const STEPS = [
  { n: "01", title: "Add your profile", desc: "Import or fill in your experience, skills and projects once." },
  { n: "02", title: "Paste the job", desc: "Our AI analyses the JD and compares it against your profile." },
  { n: "03", title: "Get hired", desc: "Download a tailored, ATS-optimized resume in seconds." },
];

export default function Home() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [authOpen, setAuthOpen] = useState(false);

  function handleStart() {
    if (user) navigate("/dashboard");
    else setAuthOpen(true);
  }

  return (
    <div className={styles.page}>
      <LandingNav onSignIn={() => setAuthOpen(true)} isAuthed={!!user} />

      <main>
        <section className={styles.hero}>
          <div className={styles.heroGlow} aria-hidden />
          <span className={styles.pill}>
            <IconSparkles size={14} /> AI-powered • Built for India
          </span>
          <h1 className={styles.heroTitle}>
            Land your dream job with a resume that <span className={styles.grad}>beats the ATS</span>
          </h1>
          <p className={styles.heroSub}>
            GetYourJob understands the job description and your profile to generate ATS-friendly,
            recruiter-ready resumes — optimized for every application.
          </p>
          <div className={styles.heroCta}>
            <Button size="lg" onClick={handleStart}>
              Build my resume <IconArrowRight size={18} />
            </Button>
            <Button size="lg" variant="secondary" to="#how">
              See how it works
            </Button>
          </div>
          <p className={styles.heroNote}>
            Free forever • 10 optimization credits / month • 1 executive resume free
          </p>

          <div className={styles.heroPreview}>
            <img
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80"
              alt="Professional working on a resume"
              className={styles.heroImg}
            />
          </div>
        </section>

        <section id="features" className={styles.section}>
          <SectionHead
            kicker="Everything you need"
            title="One platform, four powerful tools"
          />
          <div className={styles.featureGrid}>
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Icon size={22} stroke={1.7} />
                </div>
                <h3 className={styles.featureTitle}>{title}</h3>
                <p className={styles.featureDesc}>{desc}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="how" className={styles.section}>
          <SectionHead kicker="How it works" title="From job post to interview in 3 steps" />
          <div className={styles.steps}>
            {STEPS.map((s) => (
              <div key={s.n} className={styles.step}>
                <span className={styles.stepNum}>{s.n}</span>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className={styles.section}>
          <SectionHead kicker="Pricing" title="Start free. Upgrade when you scale." />
          <div className={styles.pricing}>
            <Card className={styles.planCard}>
              <h3 className={styles.planName}>Free</h3>
              <p className={styles.planPrice}>
                ₹0<span>/month</span>
              </p>
              <ul className={styles.planList}>
                {[
                  "Unlimited ATS resumes",
                  "10 optimization credits / month",
                  "1 executive resume (lifetime)",
                  "All export formats",
                  "Light & dark themes",
                ].map((f) => (
                  <li key={f}>
                    <IconCheck size={16} /> {f}
                  </li>
                ))}
              </ul>
              <Button fullWidth onClick={handleStart}>
                Get started free
              </Button>
            </Card>
            <Card className={styles.planCardPro}>
              <span className={styles.proBadge}>Coming soon</span>
              <h3 className={styles.planName}>Pro</h3>
              <p className={styles.planPrice}>
                ₹499<span>/month</span>
              </p>
              <ul className={styles.planList}>
                {[
                  "Unlimited optimization credits",
                  "Unlimited executive resumes",
                  "Priority AI processing",
                  "Premium templates",
                  "Cover letter generator",
                ].map((f) => (
                  <li key={f}>
                    <IconCheck size={16} /> {f}
                  </li>
                ))}
              </ul>
              <Button fullWidth variant="secondary" disabled>
                Notify me
              </Button>
            </Card>
          </div>
        </section>

        <footer className={styles.footer}>
          <p>© {new Date().getFullYear()} GetYourJob. Crafted for Indian job seekers.</p>
        </footer>
      </main>

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        onSuccess={() => navigate("/dashboard")}
      />
    </div>
  );
}

function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className={styles.sectionHead}>
      <span className={styles.kicker}>{kicker}</span>
      <h2 className={styles.sectionTitle}>{title}</h2>
    </div>
  );
}
