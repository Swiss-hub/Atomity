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