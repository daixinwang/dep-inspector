import { useCallback, useState } from 'react';
import './App.css';
import { UploadPanel } from './components/UploadPanel';
import { analyzeProjectZip } from './core/analyzeProject';
import type { DependencyGraph, CycleResult } from './core/graphTypes';

interface CycleListProps {
  cycles: CycleResult[];
}

const CycleList: React.FC<CycleListProps> = ({ cycles }) => {
  if (!cycles.length) {
    return <p style={{ marginTop: 8 }}>暂无循环依赖</p>;
  }

  return (
    <ul style={{ paddingLeft: 16, marginTop: 8 }}>
      {cycles.map((cycle) => (
        <li key={cycle.id} style={{ marginBottom: 8 }}>
          <strong>#{cycle.id}:</strong> {cycle.readablePath}
        </li>
      ))}
    </ul>
  );
};

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [graph, setGraph] = useState<DependencyGraph | null>(null);
  const [cycles, setCycles] = useState<CycleResult[]>([]);

  const handleFileSelected = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    setCycles([]);
    setGraph(null);
    try {
      const result = await analyzeProjectZip(file);
      setGraph(result.graph);
      setCycles(result.cycles);
    } catch (err) {
      const message = err instanceof Error ? err.message : '分析失败，请重试';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const nodeCount = graph?.nodes.length ?? 0;
  const edgeCount = graph?.edges.length ?? 0;
  const cycleCount = cycles.length;

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>前端项目依赖分析</h1>

      <UploadPanel onFileSelected={handleFileSelected} disabled={loading} />

      <div style={{ marginTop: 24 }}>
        {loading && <p>正在分析，请稍候...</p>}
        {error && (
          <p style={{ color: 'red' }}>
            分析失败：{error}
          </p>
        )}
        {!loading && !error && graph && (
          <div
            style={{
              border: '1px solid #eee',
              borderRadius: 8,
              padding: 16,
              marginTop: 8,
            }}
          >
            <p>节点数量: {nodeCount}</p>
            <p>依赖边数量: {edgeCount}</p>
            <p>循环依赖数量: {cycleCount}</p>
          </div>
        )}
      </div>

      <div style={{ marginTop: 24 }}>
        <h2 style={{ marginBottom: 8 }}>循环依赖</h2>
        <CycleList cycles={cycles} />
      </div>
    </div>
  );
}

export default App;
