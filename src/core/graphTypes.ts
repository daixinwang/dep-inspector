// Core graph-related data structures for dependency analysis.

export interface RawFile {
  // Source file extracted from zip; path is relative to project root.
  path: string;
  content: string;
}

export interface FileNode {
  // id matches path to keep uniqueness across the project.
  id: string;
  name: string;
  path: string;
}

export interface DependencyEdge {
  from: string;
  to: string;
}

export interface DependencyGraph {
  nodes: FileNode[];
  edges: DependencyEdge[];
  // Adjacency list keyed by node id with outbound dependencies.
  adjList: Record<string, string[]>;
}

export interface CycleResult {
  id: number;
  nodes: string[];
  // Human-friendly representation, e.g., "A -> B -> C -> A".
  readablePath: string;
}
