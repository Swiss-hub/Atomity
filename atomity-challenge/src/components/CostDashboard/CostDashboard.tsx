"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCloudData } from "@/hooks/useCloudData";
import { useInView } from "@/hooks/useInView";
import { BarChart } from "./BarChart";
import { CostTable } from "./CostTable";
import { Breadcrumb } from "./BreadCrumb";
import { FilterBadge } from "./FilterBadge";
import type {
  CostNode,
  DrillLevel,
  BreadcrumbStep,
  TimeRange,
  TimeFilterOption,
} from "@/types";

// Time Filter options
const TIME_OPTIONS: TimeFilterOption[] = [
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
];

// Labels for the Drill level
const LEVEL_LABELS: Record<DrillLevel, string> = {
  cluster: "Cluster",
  namespace: "Namespace",
  pod: "Pod",
};

// Loader Bar Skeleton
const SkeletonBar = ({ height }: { height: string }) => (
  <motion.div
    animate={{ opacity: [0.4, 0.8, 0.4] }}
    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
    style={{
      width: "100%",
      maxWidth: "80px",
      height,
      borderRadius:
        "var(--radius-md)var(--radius-md) var(--radius-sm) var(--radius-sm)",
      backgroundColor: "var(--color-bg-surface)",
      flex: 1,
    }}
  />
);

// State of the Skeleton
const DashboardSkeleton = () => (
  <div
    style={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "var(--space-6)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: "clamp(8px, 3vw, 32px)",
        height: "220px",
        paddingInline: "var(--space-4)",
      }}
    >
      <SkeletonBar height="85%" />
      <SkeletonBar height="65%" />
      <SkeletonBar height="50%" />
      <SkeletonBar height="30%" />
    </div>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
      }}
    >
      {[1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.1,
          }}
          style={{
            height: "40px",
            borderRadius: "var(--radius-sm)",
            backgroundColor: "var(--color-bg-surface)",
          }}
        />
      ))}
    </div>
  </div>
);

// Main Component
export const CostDashboard = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");
  const [drillLevel, setDrillLevel] = useState<DrillLevel>("cluster");
  const [selectedNode, setSelectedNode] = useState<CostNode | null>(null);
  const [parentNode, setParentNode] = useState<CostNode | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbStep[]>([
    { label: "All Clusters", level: "cluster", nodeId: null },
  ]);

  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.5 });
  const { data, isLoading, isError } = useCloudData(timeRange);

  //   Getting current items to be displayed

  const currentItems: CostNode[] = (() => {
    if (!data) return [];
    if (drillLevel === "cluster") return data.clusters;
    if (drillLevel === "namespace")
      return data.namespaces[selectedNode?.id ?? ""] ?? [];
    if (drillLevel === "pod") return data.pods[selectedNode?.id ?? ""] ?? [];
    return [];
  })();

  //   Handling Bar Click (Drll down)
  const handleBarClick = (node: CostNode) => {
    if (drillLevel === "pod") return; //already at the deepest level

    const nextLevel: DrillLevel =
      drillLevel === "cluster" ? "namespace" : "pod";

    setParentNode(selectedNode);
    setSelectedNode(node);
    setDrillLevel(nextLevel);
    setBreadcrumbs((prev) => [
      ...prev,
      {
        label: node.name,
        level: nextLevel,
        nodeId: node.id,
      },
    ]);
  };

  //   Breadcrumb navigation Handling (Drill down)
  const handleBreadcrumbNavigate = (step: BreadcrumbStep) => {
    const stepIndex = breadcrumbs.findIndex(
      (b) => b.level === step.level && b.nodeId === step.nodeId,
    );
    const newCrumbs = breadcrumbs.slice(0, stepIndex + 1);
    setBreadcrumbs(newCrumbs);
    setDrillLevel(step.level);

    // restoring selected node to the one before this step
    if (step.nodeId === null) {
      setSelectedNode(null);
      setParentNode(null);
    } else {
      setSelectedNode(parentNode);
      setParentNode(null);
    }
  };

  // Handling change of time range (reset drill state)
  const handleTimeRange = (value: TimeRange) => {
    setTimeRange(value);
    setDrillLevel("cluster");
    setSelectedNode(null);
    setParentNode(null);
    setBreadcrumbs([{ label: "All Clusters", level: "cluster", nodeId: null }]);
  };

  return (
    <motion.section
      ref={ref}
      aria-braillelabel="dashboard-title"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        backgroundColor: "var(--color-bg-card)",
        borderRadius: "var (--radius-xl)",
        border: "1px solid var(--color-border)",
        boxShadow: "var(--shadow-card)",
        padding: "clamp(16px, 4vw, 32px)",
        width: "100%",
        maxWidth: "900px",
        marginInline: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "var(--space-4)",
        }}
      >
        {/* Time Filters */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            flexWrap: "wrap",
          }}
        >
          {TIME_OPTIONS.map((opt) => (
            <FilterBadge
              key={opt.value}
              label={opt.label}
              active={timeRange === opt.value}
              onClick={() => handleTimeRange(opt.value)}
            />
          ))}
        </div>

        {/* Aggregation badge */}
        <FilterBadge
          label={LEVEL_LABELS[drillLevel]}
          subLabel={LEVEL_LABELS[drillLevel]}
          active
        />
      </header>

      {/*  Breadcrumb  */}
      <AnimatePresence>
        {breadcrumbs.length > 1 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Breadcrumb
              steps={breadcrumbs}
              onNavigate={handleBreadcrumbNavigate}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/*  Content */}
      {isLoading ? (
        <DashboardSkeleton />
      ) : isError ? (
        <div
          role="alert"
          style={{
            textAlign: "center",
            padding: "var(--space-12)",
            color: "var(--color-accent-error)",
            fontSize: "var(--font-size-sm)",
          }}
        >
          Failed to load cloud data. Please try again.
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-6)",
          }}
        >
          {/* Bar chart */}
          <BarChart
            items={currentItems}
            selectedId={selectedNode?.id ?? null}
            onBarClick={handleBarClick}
          />

          {/* Divider */}
          <hr
            style={{
              border: "none",
              borderTop: "1px solid var(--color-border)",
              marginBlock: 0,
            }}
          />

          {/* Cost table */}
          <CostTable
            items={currentItems}
            selectedId={selectedNode?.id ?? null}
          />

          {/* Drill hint */}
          <AnimatePresence>
            {drillLevel !== "pod" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  fontSize: "var(--font-size-xs)",
                  color: "var(--color-text-muted)",
                  textAlign: "center",
                  marginBlock: 0,
                }}
              >
                Click any bar to drill into its{" "}
                {drillLevel === "cluster" ? "namespaces" : "pods"}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.section>
  );
};

// NOTE:
// Drill-down state machine — drillLevel, selectedNode, and breadcrumbs work together. Clicking a bar advances all three atomically, clicking a breadcrumb rewinds them
// currentItems derivation — a single clean expression that returns the right data for whichever level you're on. No duplicated logic anywhere
// DashboardSkeleton — pulsing placeholder bars and rows show while data loads. The pulsing uses opacity keyframes via Framer Motion — no extra CSS needed
// Time range reset — switching time periods resets the drill state back to clusters. Prevents you being stuck at Pod level with stale breadcrumbs
// clamp(16px, 4vw, 32px) on padding — the card breathes naturally at every screen size
// Error state has role="alert" — screen readers announce it immediately when it appears
// Drill hint fades out automatically when you reach Pod level — the deepest level has nothing to drill into
