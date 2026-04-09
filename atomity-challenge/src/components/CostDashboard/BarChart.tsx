"use Client";

import { motion, AnimatePresence } from "framer-motion";
import { Bar } from "./Bar";
import type { CostNode } from "@/types";
import { div } from "framer-motion/client";

interface BarChartProps {
  items: CostNode[];
  selectedId: string | null;
  onBarClick: (node: CostNode) => void;
}

export const BarChart = ({ items, selectedId, onBarClick }: BarChartProps) => {
  // Make all bar heights to be relative to the tallest bar in the current view
  const maxTotal = Math.max(...items.map((item) => item.costs.total));

  const getHeightPercent = (total: number) =>
    Math.round((total / maxTotal) * 100);

  return (
    <div
      role="img"
      aria-label="Cloud cost bar chart"
      style={{
        position: "relative",
        width: "100%",
      }}
    >
      {/* Dashed Grid Lines */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          pointerEvents: "none",
          paddingBottom: "40px", // space for name labels
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: "100%",
              height: "1px",
              borderTop: "1px dashed var(--color-border-strong)",
            }}
          />
        ))}
      </div>

      {/* Bars */}

      <AnimatePresence mode="wait">
        <motion.div
          key={items.map((i) => i.id).join("-")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: "clamp(8px, 3vw, 32px)",
            height: "220px",
            paddingInline: "var(--space-4)",
            position: "relative",
          }}
        >
          {items.map((node, index) => (
            <Bar
              key={node.id}
              node={node}
              heightPercent={getHeightPercent(node.costs.total)}
              index={index}
              isSelected={selectedId === node.id}
              onClick={onBarClick}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
