import type { DependencyGraph, CycleResult } from './graphTypes';

// Detect directed cycles using DFS with three-color marking.
// Time complexity: O(V + E) where V is node count and E is edge count.

type VisitState = 0 | 1 | 2; // 0: unvisited, 1: visiting, 2: visited

const buildReadablePath = (nodes: string[]): string => nodes.join(' -> ');

const canonicalizeCycle = (closedCycle: string[]): { key: string; ordered: string[] } => {
  // closedCycle contains the start node again at the end.
  const base = closedCycle.slice(0, -1);
  if (base.length === 0) {
    return { key: '', ordered: closedCycle };
  }

  let best = base;
  const baseLen = base.length;

  for (let i = 1; i < baseLen; i++) {
    const rotated = base.slice(i).concat(base.slice(0, i));
    if (rotated.join('->') < best.join('->')) {
      best = rotated;
    }
  }

  const ordered = [...best, best[0]];
  const key = best.join('->');
  return { key, ordered };
};

export function findCycles(graph: DependencyGraph): CycleResult[] {
  const visited: Record<string, VisitState> = {};
  const stack: string[] = [];
  const cycles: CycleResult[] = [];
  const seen = new Set<string>();
  let cycleId = 1;

  const dfs = (node: string) => {
    visited[node] = 1;
    stack.push(node);

    const neighbors = graph.adjList[node] ?? [];
    for (const next of neighbors) {
      const state = visited[next] ?? 0;
      if (state === 0) {
        dfs(next);
      } else if (state === 1) {
        // Found a back edge; extract the cycle from the current stack.
        const idx = stack.indexOf(next);
        if (idx !== -1) {
          const rawCycle = stack.slice(idx).concat(next);
          const { key, ordered } = canonicalizeCycle(rawCycle);
          if (!seen.has(key)) {
            seen.add(key);
            cycles.push({
              id: cycleId++,
              nodes: ordered,
              readablePath: buildReadablePath(ordered),
            });
          }
        }
      }
    }

    stack.pop();
    visited[node] = 2;
  };

  for (const node of graph.nodes) {
    if ((visited[node.id] ?? 0) === 0) {
      dfs(node.id);
    }
  }

  return cycles;
}
