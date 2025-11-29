import { useCallback, useState } from 'react';
import './App.css';
import { Navigation, type PageType } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { DependencyGraph as DependencyGraphComponent } from './components/DependencyGraph';
import { CyclesPage } from './components/CyclesPage';
import { StatsPage } from './components/StatsPage';
import { analyzeProjectZip } from './core/analyzeProject';
import type { DependencyGraph as DependencyGraphType, CycleResult } from './core/graphTypes';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [graph, setGraph] = useState<DependencyGraphType | null>(null);
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

  const handlePageChange = (page: PageType) => {
    setCurrentPage(page);
  };

  const handleNavigateFromHome = (page: 'graph' | 'cycles' | 'stats') => {
    setCurrentPage(page);
  };

  const cycleCount = cycles.length;

  return (
    <div className="app">
      <Navigation
        currentPage={currentPage}
        onPageChange={handlePageChange}
        hasData={graph !== null}
        cycleCount={cycleCount}
      />

      <main className="main-content">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-state">
              <div className="spinner"></div>
              <p className="loading-text">正在分析项目，请稍候...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <p className="error-message">{error}</p>
            <button
              className="error-close"
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </div>
        )}

        {currentPage === 'home' && (
          <HomePage
            onFileSelected={handleFileSelected}
            loading={loading}
            graph={graph}
            cycles={cycles}
            onNavigate={handleNavigateFromHome}
          />
        )}

        {currentPage === 'graph' && graph && (
          <div className="page-wrapper">
            <DependencyGraphComponent graph={graph} cycles={cycles} />
          </div>
        )}

        {currentPage === 'cycles' && graph && (
          <div className="page-wrapper">
            <CyclesPage cycles={cycles} />
          </div>
        )}

        {currentPage === 'stats' && graph && (
          <div className="page-wrapper">
            <StatsPage graph={graph} cycles={cycles} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
