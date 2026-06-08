import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import {
  IconFileText,
  IconLayoutDashboard,
  IconLogout,
  IconMenu2,
  IconSparkles,
  IconTargetArrow,
  IconX,
} from "@tabler/icons-react";
import cx from "classnames";

import { Logo } from "~/components/ui/logo";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import { CreditMeter } from "~/components/app-shell/credit-meter";
import { AuthModal } from "~/components/auth/auth-modal";
import { useApp } from "~/context/app-context";

import styles from "./layout.module.css";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: IconLayoutDashboard, end: true },
  { to: "/dashboard/optimizer", label: "JD Optimizer", icon: IconTargetArrow, end: false },
  { to: "/dashboard/builder", label: "ATS Builder", icon: IconFileText, end: false },
  { to: "/dashboard/executive", label: "Executive", icon: IconSparkles, end: false },
];

export default function DashboardLayout() {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (!user) setAuthOpen(true);
  }, [user]);

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <div className={styles.shell}>
      <aside className={cx(styles.sidebar, open && styles.sidebarOpen)}>
        <div className={styles.sidebarTop}>
          <NavLink to="/" className={styles.brand} onClick={() => setOpen(false)}>
            <Logo />
          </NavLink>
          <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close menu">
            <IconX size={20} />
          </button>
        </div>

        <nav className={styles.nav}>
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => cx(styles.navLink, isActive && styles.navActive)}
            >
              <Icon size={19} stroke={1.7} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <CreditMeter />
          {user && (
            <div className={styles.userCard}>
              <img src={user.avatar} alt="" className={styles.avatar} />
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.userPlan}>Free plan</span>
              </div>
              <button className={styles.logoutBtn} onClick={handleLogout} aria-label="Log out">
                <IconLogout size={18} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {open && <div className={styles.backdrop} onClick={() => setOpen(false)} />}

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button className={styles.menuBtn} onClick={() => setOpen(true)} aria-label="Open menu">
            <IconMenu2 size={22} />
          </button>
          <div className={styles.mobileBrand}>
            <Logo />
          </div>
          <ThemeToggle />
        </header>
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>

      <AuthModal
        open={authOpen}
        onOpenChange={(o) => {
          setAuthOpen(o);
          if (!o && !user) navigate("/");
        }}
      />
    </div>
  );
}
