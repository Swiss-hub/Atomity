"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CostTableRow } from "./CostTableRow";
import { CostNode } from "@/types";
import { div, th } from "framer-motion/client";

interface CostTableProps {
  items: CostNode[];
  selectedId: string | null;
}

const COLUMNS = [
  { key: "name", label: "", align: "left" },
  { key: "cpu", label: "CPU", align: "right" },
  { key: "ram", label: "RAM", align: "right" },
  { key: "storage", label: "Storage", align: "right" },
  { key: "network", label: "Network", align: "right" },
  { key: "gpu", label: "GPU", align: "right" },
  { key: "efficiency", label: "Efficiency", align: "right" },
  { key: "total", label: "Total", align: "right" },
] as const;

export const CostTable = ({ items, selectedId }: CostTableProps) => {
  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border)",
      }}
    >
      <table
        role="table"
        aria-label="Cloud cost breakdown table"
        style={{ width: "100%", borderCollapse: "collapse", minWidth: "560px" }}
      >
        {/* Header */}
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={{
                  paddingInline: "var(--space-3)",
                  paddingBlock: "var(--space-3)",
                  fontSize: "var(--font-size-xs)",
                  fontWeight: 600,
                  color: "var(--color-text-muted)",
                  textAlign: col.align as "left" | "right",
                  whiteSpace: "nowrap",
                  borderBottom: "1px solid var(--color-border)",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        {/* Body */}
        <tbody>
          <AnimatePresence mode="wait">
            <motion.tbody
              key={items.map((i) => i.id).join("-")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {items.map((node, index) => (
                <CostTableRow
                  key={node.id}
                  node={node}
                  index={index}
                  isHighlighted={selectedId === node.id}
                />
              ))}
            </motion.tbody>
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};
