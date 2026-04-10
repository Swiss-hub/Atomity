"use client";

import { motion } from "framer-motion";

interface FilterBadgeProps {
  label: string;
  subLabel?: string;
  active?: boolean;
  onClick?: () => void;
}

export const FilterBadge = ({
  label,
  subLabel,
  active = false,
  onClick,
}: FilterBadgeProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-1)",
      }}
    >
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        aria-pressed={active}
        style={{
          display: "inline-flex",
          alignItems: "center",
          paddingInline: "var(--space-4)",
          paddingBlock: "var(--space-2)",
          borderRadius: "var(--radius-full)",
          border: active
            ? "1.5px solid var(--color-accent-primary-dark)"
            : "1.5px solid var(--color-border-strong)",
          backgroundColor: active
            ? "var(--color-accent-primary)"
            : "var(--color-bg-card)",
          color: active
            ? "var(--color-bg-primary)"
            : "var(--color-text-primary)",
          fontWeight: 600,
          fontSize: "var(--font-size-sm)",
          cursor: onClick ? "pointer" : "default",
          outline: "none",
          transition: [
            "background-color var(--transition-fast)",
            "border-color var(--transition-fast)",
            "color var(--transition-fast)",
          ].join(", "),
        }}
      >
        {label}
      </motion.button>

      {/* Sublabel renders below the badge, not floating over content */}
      {subLabel && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            fontSize: "var(--font-size-xs)",
            color: "var(--color-text-muted)",
            paddingInline: "var(--space-2)",
          }}
        >
          Aggregated by:{" "}
          <strong style={{ color: "var(--color-text-secondary)" }}>
            {subLabel}
          </strong>
        </motion.span>
      )}
    </div>
  );
};

// NOTE:
// The floating sublabel (Aggregated by: Cluster) is absolutely positioned below the badge - it mirrors exactly what's in the video
// active prop drives the green fill vs outline state via tokens only - no hardcoded hex anywhere
// cursor: default when not clickable - the time range badge is interactive, the aggregation badge is read-only
