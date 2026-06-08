import { Logo } from "~/components/ui/logo";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import { Button } from "~/components/ui/button";

import styles from "./landing-nav.module.css";

interface LandingNavProps {
  onSignIn: () => void;
  isAuthed: boolean;
}

export function LandingNav({ onSignIn, isAuthed }: LandingNavProps) {
  return (
    <header className={styles.nav}>
      <Logo />
      <nav className={styles.links}>
        <a href="#features">Features</a>
        <a href="#how">How it works</a>
        <a href="#pricing">Pricing</a>
      </nav>
      <div className={styles.actions}>
        <ThemeToggle />
        {isAuthed ? (
          <Button to="/dashboard" size="sm">
            Dashboard
          </Button>
        ) : (
          <Button size="sm" onClick={onSignIn}>
            Sign in
          </Button>
        )}
      </div>
    </header>
  );
}
