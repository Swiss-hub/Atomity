"use Client";

import { motion } from "framer-motion";
import { CostNode } from "@/types";
import { useInView } from "@/hooks/useInView";

interface BarProps {
  node: CostNode;
  heightPercent: number; // relative to the tallest bar
  index: number;
  isSelected: boolean;
  onClick: (node: CostNode) => void;
}

//  Intensity color on spend
const getBarColor = (heightPercent: number): string => {
  if (heightPercent >= 75) return "var(--color-bar-high)";
  if (heightPercent >= 40) return "var(--color-bar-mid)";
  return "var(--color-bar-low)";
};

export const Bar = ({
  node,
  heightPercent,
  index,
  isSelected,
  onClick,
}: BarProps) => {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.1 });

  const barColor = getBarColor(heightPercent);

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-end",
        flex: 1,
        height: "100%",
        gap: "var(--space-2)",
        minWidth: 0,
      }}
    >
      {/* cost label above the bar */}
      <motion.span
        initial={{ opacity: 0, y: 6 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{
          delay: index * 0.08 + 0.3,
          duration: 0.4,
          ease: "easeOut",
        }}
        style={{
          fontSize: "var(--font-size-xs)",
          color: "var(--color-text-secondary)",
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        ${node.costs.total.toLocaleString()}
      </motion.span>

      {/* The bar itself */}
      <motion.button
        onClick={() => onClick(node)}
        aria-label={`Drill into ${node.name} — $${node.costs.total.toLocaleString()} total`}
        aria-pressed={isSelected}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={inView ? { scaleY: 1, opacity: 1 } : {}}
        transition={{
          duration: 0.6,
          delay: index * 0.08,
          ease: [0.34, 1.56, 0.64, 1], //this should make it shoot up with a nice bounce (like a spring but with more control over the timing)
        }}
        whileHover={{
          scale: 1.04,
          boxShadow: "0 0 24px var(--color-accent-primary-glow)",
          filter: "brightness(1.08)",
        }}
        whileTap={{ scale: 0.97 }}
        style={{
          transformOrigin: "bottom",
          width: "100%",
          maxWidth: "80px",
          height: `${Math.max(heightPercent * 2, 12)}px`, // this ensures a minimum visible height for very small values
          minHeight: "12px",
          backgroundColor: barColor,
          borderRadius:
            "var(--radius-md) var(--radius-md) var(--radius-sm) var(--radius-sm)",
          border: isSelected
            ? "2px solid var(--color-accent-primary-dark)"
            : "2px solid transparent",
          cursor: "pointer",
          outline: "none",
          boxShadow: isSelected
            ? "0 0 20px var(--color-accent-primary-glow)"
            : "var(--shadow-card)",
          transition:
            "border-color var(--transition-fast), box-shadow var(--transition-fast)",
        }}
      />

      {/* Name Label for the Node */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.4, delay: index * 0.08 + 0.4 }}
        style={{
          fontSize: "var(--font-size-sm)",
          color: isSelected
            ? "var(--color-text-primary)"
            : "var(--color-text-secondary)",
          fontWeight: isSelected ? 700 : 400,
          textAlign: "center",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "100%",
          transition:
            "color var(--transition-fast), font-weight var(--transition-fast)",
        }}
      >
        {node.name}
      </motion.span>
    </div>
  );
};
