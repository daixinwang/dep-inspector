import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import type { DependencyGraph as DependencyGraphType, CycleResult } from '../core/graphTypes';
import './DependencyGraph.css';
interface DependencyGraphProps {
  graph: DependencyGraphType;
  cycles: CycleResult[];
}

export const DependencyGraph: React.FC<DependencyGraphProps> = ({ graph, cycles }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [highlightedCycle, setHighlightedCycle] = useState<number | null>(null);
  const [showOnlyCycles, setShowOnlyCycles] = useState(true);

  useEffect(() => {
    if (!containerRef.current || !graph.nodes.length) return;

    // 找出所有在循环中的节点
    const cycleNodeSet = new Set<string>();
    cycles.forEach((cycle) => {
      cycle.nodes.forEach((node) => cycleNodeSet.add(node));
    });

    // 如果只显示循环依赖，则过滤节点和边
    let nodesToDisplay = graph.nodes;
    let edgesToDisplay = graph.edges;

    if (showOnlyCycles && cycles.length > 0) {
      // 只显示涉及循环依赖的节点
      nodesToDisplay = graph.nodes.filter((node) => cycleNodeSet.has(node.id));
      
      // 只显示这些节点之间的边
      const nodeIdSet = new Set(nodesToDisplay.map((n) => n.id));
      edgesToDisplay = graph.edges.filter(
        (edge) => nodeIdSet.has(edge.from) && nodeIdSet.has(edge.to)
      );
    }

    // 构建 vis-network 的节点和边
    const visNodes = nodesToDisplay.map((node) => ({
      id: node.id,
      label: node.name,
      title: node.path,
      color: cycleNodeSet.has(node.id)
        ? {
            background: '#e74c3c',
            border: '#c0392b',
            highlight: {
              background: '#c0392b',
              border: '#a93226',
            },
          }
        : {
            background: '#667eea',
            border: '#764ba2',
            highlight: {
              background: '#764ba2',
              border: '#5a3a7f',
            },
          },
      font: {
        size: 14,
        color: '#fff',
        face: 'system-ui, -apple-system, sans-serif',
      },
      borderWidth: 2,
      borderWidthSelected: 3,
    }));

    const visEdges = edgesToDisplay.map((edge, index) => ({
      id: `edge-${index}`,
      from: edge.from,
      to: edge.to,
      arrows: 'to',
      color: {
        color: '#999',
        highlight: '#667eea',
      },
      smooth: {
        type: 'continuous',
      },
      font: {
        size: 12,
        color: '#666',
      },
    }));

    const data = {
      nodes: visNodes,
      edges: visEdges,
    };

    const options = {
      physics: {
        enabled: true,
        stabilization: {
          iterations: 200,
        },
        barnesHut: {
          gravitationalConstant: -26000,
          centralGravity: 0.3,
          springLength: 200,
          springConstant: 0.04,
        },
      },
      interaction: {
        navigationButtons: true,
        keyboard: true,
        zoomView: true,
        dragView: true,
      },
      nodes: {
        shape: 'box',
        margin: 10,
        widthConstraint: {
          maximum: 200,
        },
      },
    };

    if (networkRef.current) {
      networkRef.current.destroy();
    }

    const network = new Network(containerRef.current, data, options);

    // 处理节点点击事件
    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        setSelectedNode(params.nodes[0]);
      } else {
        setSelectedNode(null);
      }
    });

    networkRef.current = network;

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
      }
    };
  }, [graph, cycles, showOnlyCycles]);

  const handleCycleClick = (cycleId: number) => {
    setHighlightedCycle(highlightedCycle === cycleId ? null : cycleId);
  };

  const selectedNodeInfo = selectedNode
    ? graph.nodes.find((n) => n.id === selectedNode)
    : null;

  const selectedNodeCycles = selectedNode
    ? cycles.filter((cycle) => cycle.nodes.includes(selectedNode))
    : [];

  return (
    <div className="dependency-graph-container">
      <div className="graph-main">
        <div ref={containerRef} className="graph-canvas"></div>
        <div className="graph-controls">
          <button
            onClick={() => setShowOnlyCycles(!showOnlyCycles)}
            className={`control-btn ${showOnlyCycles ? 'active' : ''}`}
            title={showOnlyCycles ? '显示全部依赖' : '仅显示循环依赖'}
          >
            {showOnlyCycles ? '🔴 仅循环' : '🔵 全部'}
          </button>
          <button
            onClick={() => {
              if (networkRef.current) {
                networkRef.current.fit();
              }
            }}
            className="control-btn"
            title="适应视图"
          >
            🔍 适应视图
          </button>
          <button
            onClick={() => {
              if (networkRef.current) {
                networkRef.current.physics.startSimulation();
              }
            }}
            className="control-btn"
            title="重新布局"
          >
            🔄 重新布局
          </button>
        </div>
      </div>

      <div className="graph-sidebar">
        <div className="sidebar-section">
          <h3>图表信息</h3>
          <div className="info-item">
            <span className="info-label">节点总数：</span>
            <span className="info-value">{graph.nodes.length}</span>
          </div>
          <div className="info-item">
            <span className="info-label">依赖关系：</span>
            <span className="info-value">{graph.edges.length}</span>
          </div>
          <div className="info-item">
            <span className="info-label">循环依赖：</span>
            <span className="info-value" style={{ color: cycles.length > 0 ? '#e74c3c' : '#27ae60' }}>
              {cycles.length}
            </span>
          </div>
        </div>

        {selectedNodeInfo && (
          <div className="sidebar-section">
            <h3>选中节点</h3>
            <div className="node-info">
              <p className="node-name">{selectedNodeInfo.name}</p>
              <p className="node-path">{selectedNodeInfo.path}</p>
              {selectedNodeCycles.length > 0 && (
                <div className="node-cycles">
                  <p className="cycles-title">涉及的循环依赖：</p>
                  <ul className="cycles-list">
                    {selectedNodeCycles.map((cycle) => (
                      <li key={cycle.id} className="cycle-item">
                        <span className="cycle-badge">{cycle.id}</span>
                        <span className="cycle-path">{cycle.readablePath}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {cycles.length > 0 && (
          <div className="sidebar-section">
            <h3>循环依赖列表</h3>
            <div className="cycles-list-sidebar">
              {cycles.map((cycle) => (
                <div
                  key={cycle.id}
                  className={`cycle-item-sidebar ${highlightedCycle === cycle.id ? 'highlighted' : ''}`}
                  onClick={() => handleCycleClick(cycle.id)}
                >
                  <span className="cycle-badge">{cycle.id}</span>
                  <span className="cycle-path-short">{cycle.readablePath}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="sidebar-section legend">
          <h3>图例</h3>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#667eea' }}></div>
            <span>普通节点</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#e74c3c' }}></div>
            <span>循环依赖节点</span>
          </div>
        </div>
      </div>
    </div>
  );
};
