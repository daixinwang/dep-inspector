import React, { useState } from 'react';
import './CyclesPage.css';
import type { CycleResult } from '../core/graphTypes';
interface CyclesPageProps {
  cycles: CycleResult[];
}

export const CyclesPage: React.FC<CyclesPageProps> = ({ cycles }) => {
  const [expandedCycle, setExpandedCycle] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCycles = cycles.filter((cycle) =>
    cycle.readablePath.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCycle = (cycleId: number) => {
    setExpandedCycle(expandedCycle === cycleId ? null : cycleId);
  };

  if (cycles.length === 0) {
    return (
      <div className="cycles-page">
        <div className="page-header">
          <h1>循环依赖分析</h1>
          <p className="page-subtitle">项目中的循环依赖详情</p>
        </div>
        <div className="empty-state-large">
          <div className="empty-icon">✅</div>
          <h2>恭喜！</h2>
          <p>项目中没有发现循环依赖，依赖结构良好！</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cycles-page">
      <div className="page-header">
        <h1>循环依赖分析</h1>
        <p className="page-subtitle">共发现 {cycles.length} 个循环依赖</p>
      </div>

      <div className="cycles-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="搜索循环依赖..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="cycles-list-container">
          {filteredCycles.length === 0 ? (
            <div className="no-results">
              <p>未找到匹配的循环依赖</p>
            </div>
          ) : (
            filteredCycles.map((cycle) => (
              <div key={cycle.id} className="cycle-card">
                <div
                  className="cycle-header"
                  onClick={() => toggleCycle(cycle.id)}
                >
                  <div className="cycle-title">
                    <span className="cycle-number">#{cycle.id}</span>
                    <span className="cycle-path-text">{cycle.readablePath}</span>
                  </div>
                  <div className="cycle-toggle">
                    <span className={`toggle-icon ${expandedCycle === cycle.id ? 'expanded' : ''}`}>
                      ▼
                    </span>
                  </div>
                </div>

                {expandedCycle === cycle.id && (
                  <div className="cycle-details">
                    <div className="cycle-nodes">
                      <h3>循环路径</h3>
                      <div className="nodes-flow">
                        {cycle.nodes.map((node, index) => (
                          <div key={index} className="node-item">
                            <div className="node-box">{node.split('/').pop()}</div>
                            {index < cycle.nodes.length - 1 && (
                              <div className="arrow">→</div>
                            )}
                          </div>
                        ))}
                        <div className="node-item">
                          <div className="node-box cycle-back">循环</div>
                        </div>
                      </div>
                    </div>

                    <div className="cycle-info">
                      <div className="info-item">
                        <span className="info-label">涉及文件数：</span>
                        <span className="info-value">{cycle.nodes.length}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-label">完整路径：</span>
                        <span className="info-value code">{cycle.readablePath}</span>
                      </div>
                    </div>

                    <div className="cycle-suggestion">
                      <h3>💡 解决建议</h3>
                      <ul>
                        <li>检查循环中的文件是否有重复的功能</li>
                        <li>考虑提取公共逻辑到独立模块</li>
                        <li>重新组织代码结构，打破循环依赖</li>
                        <li>使用依赖注入或事件系统解耦</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="cycles-stats">
          <h2>统计信息</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <p className="stat-label">总循环数</p>
              <p className="stat-value">{cycles.length}</p>
            </div>
            <div className="stat-item">
              <p className="stat-label">涉及文件</p>
              <p className="stat-value">
                {new Set(cycles.flatMap((c) => c.nodes)).size}
              </p>
            </div>
            <div className="stat-item">
              <p className="stat-label">最长循环</p>
              <p className="stat-value">
                {Math.max(...cycles.map((c) => c.nodes.length))} 个文件
              </p>
            </div>
            <div className="stat-item">
              <p className="stat-label">平均长度</p>
              <p className="stat-value">
                {(cycles.reduce((sum, c) => sum + c.nodes.length, 0) / cycles.length).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
