import { useQuery } from "@tanstack/react-query";
import type { CloudDataResponse, CostNode } from "@/types";
import type { TimeRange } from "@/types";

// Deterministic number seeder
// The API data (user ids, scores etc.) will be used as seeds to generate realistic-looking cloud cost numbers.
//This way data changes per TimeRange but stays stable within a session 
//(No random flicker on re-render).

const seed = (n: number, factor: number) => Math.round(n * factor);

const buildCostNode = (
    id: string,
    name: string,
    base: number,
    multiplier: number
): CostNode => ({
    id,
    name,
    costs: {
        cpu:        seed(base * 0.38, multiplier),
        ram:        seed(base * 0.21, multiplier),
        storage:    seed(base * 0.04, multiplier),
        network:    seed(base * 0.05, multiplier),
        gpu:        seed(base * 0.28, multiplier),
        efficiency:  Math.min(95, Math.round((base % 50) + 5)),
        total:       seed(base, multiplier),
    },
});

//Time range multipliers
const timeMultiplier: Record<TimeRange, number> = {
    "7d": 0.25,
    "30d": 1,
    "90d": 2.9,
};

// Fetch and transform the cloud cost data based on the selected time range
const fetchCloudData = async (timeRange: TimeRange): Promise<CloudDataResponse> => {
    const res = await fetch("https://dummyjson.com/users?limit=16&select=id,score,age");
    if (!res.ok) throw new Error("Failed to fetch cloud data");

    const json = await res.json();
    const users = json.users as { id: number; age: number; score?: number }[];
    const m = timeMultiplier[timeRange];

    //Clusters (Top level - 4 clusters)
    const clusters: CostNode[] = [
        buildCostNode("cluster-a", "Cluster A", users[0].age * 180, m),
        buildCostNode("cluster-b", "Cluster B", users[1].age * 155, m),
        buildCostNode("cluster-c", "Cluster C", users[2].age * 120, m),
        buildCostNode("cluster-d", "Cluster D", users[3].age * 80, m),
    ];

    //Namespaces (Mid level - 4 namespaces per cluster)
    const namespaces: Record<string, CostNode[]> = {
        "cluster-a": [
            buildCostNode("ns-a1", "Namespace A", users[4].age * 90, m),
            buildCostNode("ns-a2", "Namespace B", users[5].age * 70, m),
            buildCostNode("ns-a3", "Namespace C", users[6].age * 50, m),
            buildCostNode("ns-a4", "Namespace D", users[7].age * 30, m),
        ],
        "cluster-b": [
            buildCostNode("ns-b1", "Namespace A", users[4].age * 85, m),
            buildCostNode("ns-b2", "Namespace B", users[5].age * 60, m),
            buildCostNode("ns-b3", "Namespace C", users[6].age * 40, m),
            buildCostNode("ns-b4", "Namespace D", users[7].age * 20, m),
        ],
        "cluster-c": [
            buildCostNode("ns-c1", "Namespace A", users[8].age * 70, m),
            buildCostNode("ns-c2", "Namespace B", users[9].age * 50, m),
            buildCostNode("ns-c3", "Namespace C", users[10].age * 35, m),
            buildCostNode("ns-c4", "Namespace D", users[11].age * 18, m),
        ],
        "cluster-d": [
            buildCostNode("ns-d1", "Namespace A", users[12].age * 55, m),
            buildCostNode("ns-d2", "Namespace B", users[13].age * 38, m),
            buildCostNode("ns-d3", "Namespace C", users[14].age * 25, m),
            buildCostNode("ns-d4", "Namespace D", users[15].age * 12, m),
        ],
    }
;


    //Pods (Lowest level - 4 pods per namespace)
    const pods: Record<string, CostNode[]> = {};
    Object.values(namespaces).flat().forEach((ns, i) => {
        const base = users[i % 16].age;
        pods[ns.id] = [
        buildCostNode(`${ns.id}-pod-a`, "Pod A", base * 45, m),
        buildCostNode(`${ns.id}-pod-b`, "Pod B", base * 28, m),
        buildCostNode(`${ns.id}-pod-c`, "Pod C", base * 16, m),
        buildCostNode(`${ns.id}-pod-d`, "Pod D", base * 8,  m),
        ];
    });

    return { clusters, namespaces, pods };
};

//Hook
export const useCloudData = (timeRange: TimeRange) => {
    return useQuery({
        queryKey: ["cloud-data", timeRange],
        queryFn: () => fetchCloudData(timeRange),
    });
};