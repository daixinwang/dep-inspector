import React from 'react';
import { UploadPanel } from './UploadPanel';
import './HomePage.css';
import type { DependencyGraph as DependencyGraphType, CycleResult } from '../core/graphTypes';
interface HomePageProps {
  onFileSelected: (file: File) => void;
  loading: boolean;
  graph: DependencyGraphType | null;
  cycles: CycleResult[];
  onNavigate: (page: 'graph' | 'cycles' | 'stats') => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onFileSelected,
  loading,
  graph,
  cycles,
  onNavigate,
}) => {
  const nodeCount = graph?.nodes.length ?? 0;
  const edgeCount = graph?.edges.length ?? 0;
  const cycleCount = cycles.length;

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>前端项目依赖分析工具</h1>
        <p className="home-subtitle">
          快速分析项目依赖关系，识别循环依赖问题，优化代码结构
        </p>
      </div>

      <div className="home-content">
        <div className="upload-container">
          <div className="upload-box">
            <h2>上传项目</h2>
            <UploadPanel onFileSelected={onFileSelected} disabled={loading} />
            <p className="upload-hint">
              支持 ZIP 格式的前端项目（React、Vue、Angular 等）
            </p>
          </div>
        </div>

        {graph && (
          <div className="analysis-results">
            <h2>分析结果</h2>
            <div className="results-grid">
              <div className="result-card">
                <div className="result-icon">📦</div>
                <div className="result-content">
                  <p className="result-label">项目文件</p>
                  <p className="result-value">{nodeCount}</p>
                  <p className="result-desc">个依赖节点</p>
                </div>
              </div>

              <div className="result-card">
                <div className="result-icon">🔗</div>
                <div className="result-content">
                  <p className="result-label">依赖关系</p>
                  <p className="result-value">{edgeCount}</p>
                  <p className="result-desc">条依赖边</p>
                </div>
              </div>

              <div className={`result-card ${cycleCount > 0 ? 'warning' : 'success'}`}>
                <div className="result-icon">{cycleCount > 0 ? '⚠️' : '✅'}</div>
                <div className="result-content">
                  <p className="result-label">循环依赖</p>
                  <p className="result-value">{cycleCount}</p>
                  <p className="result-desc">{cycleCount > 0 ? '个需要修复' : '无问题'}</p>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="action-btn primary" onClick={() => onNavigate('graph')}>
                <span className="btn-icon">🔗</span>
                <span className="btn-text">查看依赖图</span>
              </button>
              {cycleCount > 0 && (
                <button className="action-btn warning" onClick={() => onNavigate('cycles')}>
                  <span className="btn-icon">🔴</span>
                  <span className="btn-text">查看循环依赖</span>
                </button>
              )}
              <button className="action-btn secondary" onClick={() => onNavigate('stats')}>
                <span className="btn-icon">📈</span>
                <span className="btn-text">查看统计</span>
              </button>
            </div>
          </div>
        )}

        <div className="features">
          <h2>功能特性</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <h3>快速分析</h3>
              <p>秒级分析项目依赖关系</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔍</div>
              <h3>循环检测</h3>
              <p>自动识别所有循环依赖</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <h3>可视化</h3>
              <p>交互式依赖图展示</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📈</div>
              <h3>深度分析</h3>
              <p>详细的统计和分析数据</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
