import path from 'path';
import type {
  RawFile,
  FileNode,
  DependencyEdge,
  DependencyGraph,
} from './graphTypes';

// In browser builds, ensure bundler aliases `path` to `path-browserify`.
const SOURCE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.vue'];

const normalizePath = (p: string): string =>
  path.posix.normalize(p).replace(/^\/+/, '');

const hasKnownExtension = (p: string): boolean =>
  SOURCE_EXTENSIONS.some((ext) => p.toLowerCase().endsWith(ext));

const extractRelativeImports = (content: string): string[] => {
  const results: string[] = [];
  const importRegex =
    /(?:import\s+[^'"]*from\s+['"]([^'"]+)['"])|(?:import\s+['"]([^'"]+)['"])|(?:require\(\s*['"]([^'"]+)['"]\s*\))/g;
  let match: RegExpExecArray | null;

  while ((match = importRegex.exec(content)) !== null) {
    const [, fromStmt, bareImport, requirePath] = match;
    const found = fromStmt || bareImport || requirePath;
    if (found && (found.startsWith('./') || found.startsWith('../'))) {
      results.push(found);
    }
  }

  return results;
};

const resolveModulePath = (
  sourcePath: string,
  importPath: string,
  existingFiles: Set<string>
): string | null => {
  const baseDir = path.posix.dirname(sourcePath);
  const absoluteCandidate = path.posix.resolve('/', baseDir, importPath);
  const candidate = normalizePath(absoluteCandidate);

  // If import already includes an extension and exists, use it.
  if (hasKnownExtension(candidate) && existingFiles.has(candidate)) {
    return candidate;
  }

  // Try appending known extensions.
  for (const ext of SOURCE_EXTENSIONS) {
    const withExt = `${candidate}${ext}`;
    if (existingFiles.has(withExt)) {
      return withExt;
    }
  }

  return null;
};

export const buildDependencyGraph = (files: RawFile[]): DependencyGraph => {
  const normalizedFiles = files.map((file) => ({
    ...file,
    path: normalizePath(file.path),
  }));
  const fileSet = new Set(normalizedFiles.map((f) => f.path));

  const nodes: FileNode[] = normalizedFiles.map((file) => ({
    id: file.path,
    name: path.posix.basename(file.path),
    path: file.path,
  }));

  const edges: DependencyEdge[] = [];
  const adjList: Record<string, string[]> = {};

  for (const file of normalizedFiles) {
    const fromId = file.path;
    const imports = extractRelativeImports(file.content);
    const seenTargets = new Set<string>();

    for (const imp of imports) {
      const resolved = resolveModulePath(fromId, imp, fileSet);
      if (!resolved) continue;
      if (seenTargets.has(resolved)) continue; // avoid duplicates from same file

      seenTargets.add(resolved);
      edges.push({ from: fromId, to: resolved });
    }

    adjList[fromId] = Array.from(seenTargets);
  }

  return { nodes, edges, adjList };
};
