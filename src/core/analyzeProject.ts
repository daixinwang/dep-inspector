import type { DependencyGraph, CycleResult, RawFile } from './graphTypes';
import { loadRawFilesFromZip } from './fileLoader';
import { buildDependencyGraph } from './dependencyParser';
import { findCycles } from './cycleDetector';

export async function analyzeProjectZip(file: File): Promise<{
  graph: DependencyGraph;
  cycles: CycleResult[];
}> {
  try {
    const rawFiles: RawFile[] = await loadRawFilesFromZip(file);
    const graph: DependencyGraph = buildDependencyGraph(rawFiles);
    const cycles: CycleResult[] = findCycles(graph);
    return { graph, cycles };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    throw new Error(`Analysis failed: ${message}`);
  }
}
