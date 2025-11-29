import React from 'react';
import './StatsPage.css';
import type { DependencyGraph as DependencyGraphType, CycleResult } from '../core/graphTypes';
interface StatsPageProps {
  graph: DependencyGraphType;
  cycles: CycleResult[];
}

export const StatsPage: React.FC<StatsPageProps> = ({ graph, cycles }) => {
  const nodeCount = graph.nodes.length;
  const edgeCount = graph.edges.length;
  const cycleCount = cycles.length;

  // 计算入度和出度
  const inDegree: Record<string, number> = {};
  const outDegree: Record<string, number> = {};

  graph.nodes.forEach((node) => {
    inDegree[node.id] = 0;
    outDegree[node.id] = 0;
  });

  graph.edges.forEach((edge) => {
    outDegree[edge.from] = (outDegree[edge.from] || 0) + 1;
    inDegree[edge.to] = (inDegree[edge.to] || 0) + 1;
  });

  // 找出最多依赖的文件
  const topDependents = Object.entries(outDegree)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // 找出被依赖最多的文件
  const topDependencies = Object.entries(inDegree)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // 计算平均度数
  const avgOutDegree = edgeCount / nodeCount;
  const avgInDegree = edgeCount / nodeCount;

  // 计算循环中的文件
  const cycleNodes = new Set(cycles.flatMap((c) => c.nodes));
  const cycleNodeCount = cycleNodes.size;
  const cyclePercentage = ((cycleNodeCount / nodeCount) * 100).toFixed(1);

  return (
    <div className="stats-page">
      <div className="page-header">
        <h1>统计分析</h1>
        <p className="page-subtitle">项目依赖关系的详细统计数据</p>
      </div>

      <div className="stats-container">
        <div className="stats-overview">
          <h2>概览</h2>
          <div className="overview-grid">
            <div className="overview-card">
              <div className="card-icon">📦</div>
              <div className="card-content">
                <p className="card-label">总节点数</p>
                <p className="card-value">{nodeCount}</p>
              </div>
            </div>
            <div className="overview-card">
              <div className="card-icon">🔗</div>
              <div className="card-content">
                <p className="card-label">总依赖数</p>
                <p className="card-value">{edgeCount}</p>
              </div>
            </div>
            <div className="overview-card">
              <div className="card-icon">📊</div>
              <div className="card-content">
                <p className="card-label">平均度数</p>
                <p className="card-value">{avgOutDegree.toFixed(2)}</p>
              </div>
            </div>
            <div className="overview-card warning">
              <div className="card-icon">🔴</div>
              <div className="card-content">
                <p className="card-label">循环依赖</p>
                <p className="card-value">{cycleCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stats-section">
            <h2>最多依赖的文件</h2>
            <div className="ranking-list">
              {topDependents.length === 0 ? (
                <p className="empty-text">暂无数据</p>
              ) : (
                topDependents.map(([nodeId, count], index) => {
                  const node = graph.nodes.find((n) => n.id === nodeId);
                  return (
                    <div key={nodeId} className="ranking-item">
                      <div className="ranking-badge">{index + 1}</div>
                      <div className="ranking-content">
                        <p className="ranking-name">{node?.name}</p>
                        <p className="ranking-path">{node?.path}</p>
                      </div>
                      <div className="ranking-value">
                        <span className="value-number">{count}</span>
                        <span className="value-label">个依赖</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="stats-section">
            <h2>被依赖最多的文件</h2>
            <div className="ranking-list">
              {topDependencies.length === 0 ? (
                <p className="empty-text">暂无数据</p>
              ) : (
                topDependencies.map(([nodeId, count], index) => {
                  const node = graph.nodes.find((n) => n.id === nodeId);
                  return (
                    <div key={nodeId} className="ranking-item">
                      <div className="ranking-badge">{index + 1}</div>
                      <div className="ranking-content">
                        <p className="ranking-name">{node?.name}</p>
                        <p className="ranking-path">{node?.path}</p>
                      </div>
                      <div className="ranking-value">
                        <span className="value-number">{count}</span>
                        <span className="value-label">被依赖</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="stats-section full-width">
          <h2>循环依赖分析</h2>
          <div className="cycle-analysis">
            <div className="analysis-card">
              <p className="analysis-label">涉及循环的文件</p>
              <p className="analysis-value">{cycleNodeCount}</p>
              <p className="analysis-desc">占总文件的 {cyclePercentage}%</p>
            </div>
            <div className="analysis-card">
              <p className="analysis-label">循环依赖数</p>
              <p className="analysis-value">{cycleCount}</p>
              <p className="analysis-desc">需要修复</p>
            </div>
            <div className="analysis-card">
              <p className="analysis-label">最长循环</p>
              <p className="analysis-value">
                {cycles.length > 0 ? Math.max(...cycles.map((c) => c.nodes.length)) : 0}
              </p>
              <p className="analysis-desc">个文件</p>
            </div>
            <div className="analysis-card">
              <p className="analysis-label">平均循环长度</p>
              <p className="analysis-value">
                {cycles.length > 0
                  ? (cycles.reduce((sum, c) => sum + c.nodes.length, 0) / cycles.length).toFixed(1)
                  : 0}
              </p>
              <p className="analysis-desc">个文件</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
