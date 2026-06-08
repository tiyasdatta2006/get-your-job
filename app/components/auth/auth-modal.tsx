import { useState } from "react";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandLinkedin,
  IconDeviceMobile,
  IconMail,
} from "@tabler/icons-react";

import { Modal } from "~/components/ui/modal";
import { Button } from "~/components/ui/button";
import { InputField } from "~/components/ui/field";
import { useApp } from "~/context/app-context";
import type { AuthProvider } from "~/types/auth";

import styles from "./auth-modal.module.css";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const SOCIAL: { provider: AuthProvider; label: string; icon: typeof IconBrandGoogle }[] = [
  { provider: "google", label: "Continue with Google", icon: IconBrandGoogle },
  { provider: "github", label: "Continue with GitHub", icon: IconBrandGithub },
  { provider: "linkedin", label: "Continue with LinkedIn", icon: IconBrandLinkedin },
];

type Mode = "choose" | "email" | "phone" | "otp";

export function AuthModal({ open, onOpenChange, onSuccess }: AuthModalProps) {
  const { login } = useApp();
  const [mode, setMode] = useState<Mode>("choose");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [pendingProvider, setPendingProvider] = useState<AuthProvider>("email");

  function reset() {
    setMode("choose");
    setIdentifier("");
    setOtp("");
  }

  function complete(provider: AuthProvider, name: string, email: string) {
    login(provider, name, email);
    reset();
    onOpenChange(false);
    onSuccess?.();
  }

  function handleSocial(provider: AuthProvider) {
    const name = provider.charAt(0).toUpperCase() + provider.slice(1) + " User";
    complete(provider, name, `user@${provider}.com`);
  }

  function startOtp(provider: AuthProvider) {
    setPendingProvider(provider);
    setMode("otp");
  }

  function verifyOtp() {
    const isEmail = pendingProvider === "email";
    const name = isEmail
      ? identifier.split("@")[0] || "New User"
      : "Mobile User";
    const email = isEmail ? identifier : `${identifier}@phone.getyourjob.in`;
    complete(pendingProvider, name.charAt(0).toUpperCase() + name.slice(1), email);
  }

  const titleByMode: Record<Mode, string> = {
    choose: "Welcome to GetYourJob",
    email: "Sign in with Email",
    phone: "Sign in with Phone",
    otp: "Verify OTP",
  };

  return (
    <Modal
      open={open}
      onOpenChange={(o) => {
        if (!o) reset();
        onOpenChange(o);
      }}
      title={titleByMode[mode]}
      description={
        mode === "choose"
          ? "Build ATS-ready resumes powered by AI. Free to start."
          : mode === "otp"
          ? `We sent a 6-digit code to ${identifier || "your inbox"}. Enter it below.`
          : undefined
      }
    >
      {mode === "choose" && (
        <div className={styles.stack}>
          {SOCIAL.map(({ provider, label, icon: Icon }) => (
            <Button key={provider} variant="secondary" fullWidth onClick={() => handleSocial(provider)}>
              <Icon size={18} /> {label}
            </Button>
          ))}
          <div className={styles.divider}>
            <span>or</span>
          </div>
          <Button variant="secondary" fullWidth onClick={() => setMode("email")}>
            <IconMail size={18} /> Continue with Email OTP
          </Button>
          <Button variant="secondary" fullWidth onClick={() => setMode("phone")}>
            <IconDeviceMobile size={18} /> Continue with Phone OTP
          </Button>
        </div>
      )}

      {mode === "email" && (
        <div className={styles.stack}>
          <InputField
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <Button fullWidth disabled={!identifier.includes("@")} onClick={() => startOtp("email")}>
            Send OTP
          </Button>
          <Button variant="ghost" fullWidth onClick={() => setMode("choose")}>
            Back
          </Button>
        </div>
      )}

      {mode === "phone" && (
        <div className={styles.stack}>
          <InputField
            label="Phone number"
            type="tel"
            placeholder="+91 98765 43210"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
          <Button fullWidth disabled={identifier.length < 6} onClick={() => startOtp("phone")}>
            Send OTP
          </Button>
          <Button variant="ghost" fullWidth onClick={() => setMode("choose")}>
            Back
          </Button>
        </div>
      )}

      {mode === "otp" && (
        <div className={styles.stack}>
          <InputField
            label="6-digit code"
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            hint="Demo: enter any 6 digits to continue."
          />
          <Button fullWidth disabled={otp.length < 6} onClick={verifyOtp}>
            Verify & Continue
          </Button>
          <Button variant="ghost" fullWidth onClick={() => setMode(pendingProvider === "phone" ? "phone" : "email")}>
            Back
          </Button>
        </div>
      )}
    </Modal>
  );
}
