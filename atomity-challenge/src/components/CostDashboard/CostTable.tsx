"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CostTableRow } from "./CostTableRow";
import { CostNode } from "@/types";

interface CostTableProps {
  items: CostNode[];
  selectedId: string | null;
}

const COLUMNS = [
  { key: "name", label: "", align: "left", width: "120px" },
  { key: "cpu", label: "CPU", align: "right", width: "80px" },
  { key: "ram", label: "RAM", align: "right", width: "80px" },
  { key: "storage", label: "Storage", align: "right", width: "80px" },
  { key: "network", label: "Network", align: "right", width: "80px" },
  { key: "gpu", label: "GPU", align: "right", width: "80px" },
  { key: "efficiency", label: "Efficiency", align: "right", width: "90px" },
  { key: "total", label: "Total", align: "right", width: "90px" },
] as const;

const TH_STYLE: React.CSSProperties = {
  paddingInline: "var(--space-4)",
  paddingBlock: "var(--space-3)",
  fontSize: "var(--font-size-xs)",
  fontWeight: 600,
  color: "var(--color-text-muted)",
  whiteSpace: "nowrap",
  borderBottom: "1px solid var(--color-border)",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
};

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
        style={{
          width: "100%",
          borderCollapse: "collapse",
          tableLayout: "fixed",
        }}
      >
        <colgroup>
          <col style={{ width: "16%" }} /> {/* name */}
          <col style={{ width: "12%" }} /> {/* cpu */}
          <col style={{ width: "12%" }} /> {/* ram */}
          <col style={{ width: "12%" }} /> {/* storage */}
          <col style={{ width: "12%" }} /> {/* network */}
          <col style={{ width: "12%" }} /> {/* gpu */}
          <col style={{ width: "12%" }} /> {/* efficiency */}
          <col style={{ width: "12%" }} /> {/* total */}
        </colgroup>
        {/* Header */}
        <thead>
          <tr>
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                scope="col"
                style={{
                  ...TH_STYLE,
                  textAlign: col.align as "left" | "right",
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
            {items.map((node, index) => (
              <CostTableRow
                key={node.id}
                node={node}
                index={index}
                isHighlighted={selectedId === node.id}
              />
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};
