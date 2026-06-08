export type AuthProvider = "email" | "phone" | "google" | "github" | "linkedin";

export type PlanTier = "free" | "pro";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: AuthProvider;
  plan: PlanTier;
}

export interface Credits {
  /** Monthly optimization credits (free tier = 10/mo) */
  optimizeRemaining: number;
  optimizeTotal: number;
  /** Lifetime executive resume credit (free tier = 1) */
  executiveRemaining: number;
  executiveTotal: number;
  /** ATS builds are unlimited on free tier */
  atsBuilds: number;
}
