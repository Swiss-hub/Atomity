"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { BreadcrumbStep } from "@/types";

interface BreadcrumbProps {
  steps: BreadcrumbStep[];
  onNavigate: (step: BreadcrumbStep) => void;
}

// ── Chevron icon ─────────────────────────────────────────────────────────────
const Chevron = () => (
  <svg
    aria-hidden="true"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ flexShrink: 0 }}
  >
    <path
      d="M4 2L8 6L4 10"
      stroke="var(--color-text-muted)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Breadcrumb = ({ steps, onNavigate }: BreadcrumbProps) => {
  return (
    <nav
      aria-label="Drill-down navigation"
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "var(--space-1)",
      }}
    >
      <AnimatePresence mode="popLayout">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isClickable = !isLast;

          return (
            <motion.span
              key={`${step.level}-${step.nodeId ?? "root"}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-1)",
              }}
            >
              {/* Step label */}
              <motion.button
                onClick={() => isClickable && onNavigate(step)}
                disabled={!isClickable}
                whileHover={isClickable ? { scale: 1.04 } : {}}
                whileTap={isClickable ? { scale: 0.97 } : {}}
                aria-current={isLast ? "page" : undefined}
                style={{
                  background: isLast
                    ? "var(--color-accent-primary)"
                    : "var(--color-bg-surface)",
                  color: isLast
                    ? "var(--color-bg-primary)"
                    : "var(--color-text-secondary)",
                  border: isLast
                    ? "1.5px solid var(--color-accent-primary-dark)"
                    : "1.5px solid var(--color-border)",
                  borderRadius: "var(--radius-full)",
                  paddingInline: "var(--space-3)",
                  paddingBlock: "var(--space-1)",
                  fontSize: "var(--font-size-xs)",
                  fontWeight: isLast ? 700 : 500,
                  cursor: isClickable ? "pointer" : "default",
                  outline: "none",
                  whiteSpace: "nowrap",
                  transition: [
                    "background var(--transition-fast)",
                    "color var(--transition-fast)",
                    "border-color var(--transition-fast)",
                  ].join(", "),
                }}
              >
                {step.label}
              </motion.button>

              {/* Chevron separator — not shown after last step */}
              {!isLast && <Chevron />}
            </motion.span>
          );
        })}
      </AnimatePresence>
    </nav>
  );
};

// NOTE:
// AnimatePresence mode="popLayout" - each new breadcrumb step slides in from the left as you drill down, and slides back out when you navigate up. popLayout keeps the surrounding elements from jumping
// aria-current="page" on the last step - tells screen readers which level you're currently on
// The last step is always green (active), previous steps are muted and clickable - clear visual hierarchy
// isClickable guard - the current level pill is not a button functionally, prevents accidental re-clicks
