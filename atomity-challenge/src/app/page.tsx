"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CostDashboard } from "@/components/CostDashboard/CostDashboard";

// Dark mode toggle icon
const SunIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

//  Page
export default function Home() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute(
      "data-theme",
      next ? "dark" : "light",
    );
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--color-bg-primary)",
        transition: "background-color var(--transition-slow)",
      }}
    >
      {/* ── Skip to content link (keyboard accessibility) ── */}
      <a
        href="#dashboard"
        style={{
          position: "absolute",
          top: "-100px",
          left: "var(--space-4)",
          zIndex: 100,
          paddingInline: "var(--space-4)",
          paddingBlock: "var(--space-2)",
          backgroundColor: "var(--color-accent-primary)",
          color: "var(--color-bg-primary)",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--font-size-sm)",
          fontWeight: 600,
          textDecoration: "none",
          transition: "top var(--transition-fast)",
        }}
        onFocus={(e) => {
          (e.target as HTMLAnchorElement).style.top = "var(--space-4)";
        }}
        onBlur={(e) => {
          (e.target as HTMLAnchorElement).style.top = "-100px";
        }}
      >
        Skip to dashboard
      </a>
      {/*  Navbar  */}
      <nav
        aria-label="Site navigation"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          backgroundColor:
            "color-mix(in srgb, var(--color-bg-primary) 80%, transparent)",
          borderBottom: "1px solid var(--color-border)",
          paddingInline: "clamp(16px, 5vw, 48px)",
          paddingBlock: "var(--space-4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--color-accent-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect
                x="2"
                y="8"
                width="3"
                height="6"
                rx="1"
                fill="var(--color-bg-primary)"
              />
              <rect
                x="6.5"
                y="5"
                width="3"
                height="9"
                rx="1"
                fill="var(--color-bg-primary)"
              />
              <rect
                x="11"
                y="2"
                width="3"
                height="12"
                rx="1"
                fill="var(--color-bg-primary)"
              />
            </svg>
          </div>
          <span
            style={{
              fontSize: "var(--font-size-md)",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Atomity
          </span>
        </motion.div>

        {/* Dark mode toggle */}
        <motion.button
          onClick={toggleTheme}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            paddingInline: "var(--space-4)",
            paddingBlock: "var(--space-2)",
            borderRadius: "var(--radius-full)",
            border: "1.5px solid var(--color-border-strong)",
            backgroundColor: "var(--color-bg-surface)",
            color: "var(--color-text-secondary)",
            fontSize: "var(--font-size-sm)",
            fontWeight: 500,
            cursor: "pointer",
            outline: "none",
            transition: [
              "background-color var(--transition-fast)",
              "color var(--transition-fast)",
              "border-color var(--transition-fast)",
            ].join(", "),
          }}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
          {isDark ? "Light" : "Dark"}
        </motion.button>
      </nav>

      {/*  Hero  */}
      <section
        aria-labelledby="hero-title"
        style={{
          paddingInline: "clamp(16px, 5vw, 48px)",
          paddingBlock: "clamp(48px, 8vw, 96px)",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-4)",
        }}
      >
        {/* Eyebrow badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "var(--space-2)",
            paddingInline: "var(--space-4)",
            paddingBlock: "var(--space-1)",
            borderRadius: "var(--radius-full)",
            border: "1.5px solid var(--color-accent-primary)",
            backgroundColor:
              "color-mix(in srgb, var(--color-accent-primary) 10%, transparent)",
            fontSize: "var(--font-size-xs)",
            fontWeight: 600,
            color: "var(--color-accent-primary-dark)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "var(--color-accent-primary)",
              display: "inline-block",
            }}
          />
          Cloud Cost Intelligence
        </motion.div>

        {/* Headline */}
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
          style={{
            fontSize: "var(--font-size-2xl)",
            fontWeight: 800,
            color: "var(--color-text-primary)",
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            maxWidth: "640px",
          }}
        >
          See exactly where your{" "}
          <span style={{ color: "var(--color-accent-primary)" }}>
            cloud budget
          </span>{" "}
          goes
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.18, ease: "easeOut" }}
          style={{
            fontSize: "var(--font-size-md)",
            color: "var(--color-text-secondary)",
            maxWidth: "480px",
            lineHeight: 1.7,
          }}
        >
          Drill into every cluster, namespace, and pod. Understand your spend at
          any level of granularity — in real time.
        </motion.p>
      </section>

      {/*  Dashboard section  */}
      <section
        id="dashboard"
        aria-label="Cloud cost explorer"
        className="dashboard-container"
        style={{
          paddingInline: "clamp(16px, 5vw, 48px)",
          paddingBottom: "clamp(48px, 8vw, 96px)",
        }}
      >
        <CostDashboard />
      </section>

      {/*  Footer  */}
      <footer
        style={{
          borderTop: "1px solid var(--color-border)",
          paddingInline: "clamp(16px, 5vw, 48px)",
          paddingBlock: "var(--space-6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "var(--font-size-xs)",
          color: "var(--color-text-muted)",
        }}
      >
        © {new Date().getFullYear()} Atomity. Cloud cost intelligence platform.
      </footer>
    </main>
  );
}
