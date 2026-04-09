"use Client";

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
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      aria-pressed={active}
      style={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
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
          : "var(--color-text-secondary)",
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
      {/* Main Label */}
      <span>{label}</span>
      {subLabel && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: "absolute",
            top: "calc(100% + var(--space-1))",
            left: 0,
            backgroundColor: "var(--color-bg-card)",
            border: "1.5px solid var(--color-border-strong)",
            borderRadius: "var(--radius-md)",
            paddingInline: "var(--space-3)",
            paddingBlock: "var(--space-2)",
            fontSize: "var(--font-size-xs)",
            color: "var(--color-text-secondary)",
            whiteSpace: "nowrap",
            zIndex: 10,
            boxShadow: "var(--shadow-card)",
            pointerEvents: "none",
          }}
        >
          <span style={{ display: "block", fontWeight: 400 }}>
            Aggregated by:
          </span>
          <span
            style={{
              fontWeight: 700,
              color: "var(--color-text-primary)",
            }}
          >
            {subLabel}
          </span>
        </motion.span>
      )}
    </motion.button>
  );
};
