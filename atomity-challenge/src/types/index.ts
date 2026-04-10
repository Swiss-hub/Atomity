// a resource cost breakdown for a single entry.
export interface ResourceCosts {
    cpu: number;
    ram: number;
    storage: number;
    network: number;
    gpu: number;
    efficiency: number;
    total: number;
}

//A single item in the hierarchy (Cluster, Namespace, Deployment, Pod)
export interface CostNode {
    id: string;
    name: string;
    costs: ResourceCosts;
}

//3 drill-down levels (Cluster -> Namespace -> Deployment -> Pod)
export type DrillLevel = "cluster" | "namespace" | "pod";

// The step breadcrumbs for the drill-down navigation
export interface BreadcrumbStep {
    label: string;
    level: DrillLevel;
    nodeId: string | null; // null for the root level
}

// Full API response structure for the cost breakdown
export interface CloudDataResponse {
    clusters: CostNode [];
    namespaces: Record<string, CostNode []>; // key is clusterId
    pods: Record<string, CostNode []>; // key is namespaceId
}

//What is needed by the dashboard at any given drill level
export interface DasshboardView {
    level: DrillLevel;
    items: CostNode[];
    breadcrumbs: BreadcrumbStep[];
}

//An option for Time Filter
export type TimeRange = "7d" | "30d" | "90d" ;

export interface TimeFilterOption {
    label: string;
    value: TimeRange;
}
// NOTE:
// ResourceCosts is a flat object — easy to map over columns in the table
// CostNode is generic — a cluster, namespace, and pod all have the same shape, just different names. This means your BarChart and CostTable components are reusable across all three levels without any changes
// CloudDataResponse uses Record<string, CostNode[]> so lookups are O(1) — given a cluster id, you instantly get its namespaces
// BreadcrumbStep tracks the full trail so we can navigate back to any level
// DrillLevel as a union type means TypeScript will warn you if you ever pass an invalid level string anywhere