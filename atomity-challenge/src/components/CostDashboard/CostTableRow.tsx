"use Client";

import { motion } from "framer-motion";
import { CostNode } from "@/types";
import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";

interface CostTableRowProps {
  node: CostNode;
  index: number;
  isHighlighted: boolean;
}

// Individually animated cell
const AnimatedCell = ({
  value,
  prefix = "",
  suffix = "",
  enabled,
  bold = false,
  muted = false,
  delay = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  enabled: boolean;
  bold?: boolean;
  muted?: boolean;
  delay?: number;
}) => {
  const { formatted } = useCountUp({
    end: value,
    prefix,
    suffix,
    enabled,
    duration: 1000 + delay + 100,
  });

  return (
    <td
      style={{
        paddingInline: "var(--space-3)",
        paddingBlock: "var(--space-3)",
        fontSize: "var(--font-size-sm)",
        fontWeight: bold ? 700 : 400,
        color: muted
          ? "var(--color-text-muted)"
          : bold
            ? "var(--color-text-primary)"
            : "var(--color-text-secondary)",
        textAlign: "right",
        whiteSpace: "nowrap",
        fontVariantNumeric: "tabular-nums",
        transition: "color var(--transition-fast)",
      }}
    >
      {formatted}
    </td>
  );
};

//The Entire Row
export const CostTableRow = ({
  node,
  index,
  isHighlighted,
}: CostTableRowProps) => {
  const { ref, inView } = useInView<HTMLTableRowElement>({ threshold: 0.1 });
  const { costs } = node;

  return (
    <motion.tr
      ref={ref}
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
      style={{
        backgroundColor: isHighlighted
          ? "color-mix(in srgb, var(--color-accent-primary) 8%, transparent)"
          : "transparent",
        borderRadius: "var(--radius-sm)",
        transition: "background-color var(--transition-fast)",
      }}
    >
      {/* The Row Label */}
      <td
        style={{
          paddingInline: "var(--space-3)",
          paddingBlock: "var(--space-3)",
          fontSize: "var(--font-size-sm)",
          fontWeight: isHighlighted ? 700 : 500,
          color: isHighlighted
            ? "var(--color-text-primary)"
            : "var(--color-text-secondary",
        }}
      >
        {node.name}
      </td>

      {/* Cost Cells */}
      <AnimatedCell value={costs.cpu} prefix="$" enabled={inView} delay={0} />
      <AnimatedCell value={costs.ram} prefix="$" enabled={inView} delay={1} />
      <AnimatedCell
        value={costs.storage}
        prefix="$"
        enabled={inView}
        delay={2}
      />
      <AnimatedCell
        value={costs.network}
        prefix="$"
        enabled={inView}
        delay={3}
      />
      <AnimatedCell value={costs.gpu} prefix="$" enabled={inView} delay={4} />
      <AnimatedCell
        value={costs.efficiency}
        suffix="%"
        enabled={inView}
        delay={5}
        muted
      />
      <AnimatedCell
        value={costs.total}
        prefix="$"
        enabled={inView}
        delay={6}
        bold
      />
    </motion.tr>
  );
};
