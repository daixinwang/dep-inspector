import React from 'react';
import './Navigation.css';
export type PageType = 'home' | 'graph' | 'cycles' | 'stats';

interface NavigationProps {
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
  hasData: boolean;
  cycleCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onPageChange,
  hasData,
  cycleCount,
}) => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-text">前端项目依赖分析工具</span>
        </div>

        <ul className="nav-menu">
          <li>
            <button
              className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
              onClick={() => onPageChange('home')}
            >
              <span className="nav-icon">🏠</span>
              <span className="nav-label">首页</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentPage === 'graph' ? 'active' : ''} ${!hasData ? 'disabled' : ''}`}
              onClick={() => hasData && onPageChange('graph')}
              disabled={!hasData}
              title={!hasData ? '请先上传项目' : ''}
            >
              <span className="nav-icon">🔗</span>
              <span className="nav-label">依赖图</span>
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentPage === 'cycles' ? 'active' : ''} ${!hasData ? 'disabled' : ''}`}
              onClick={() => hasData && onPageChange('cycles')}
              disabled={!hasData}
              title={!hasData ? '请先上传项目' : ''}
            >
              <span className="nav-icon">🔴</span>
              <span className="nav-label">循环依赖</span>
              {hasData && cycleCount > 0 && <span className="nav-badge">{cycleCount}</span>}
            </button>
          </li>
          <li>
            <button
              className={`nav-link ${currentPage === 'stats' ? 'active' : ''} ${!hasData ? 'disabled' : ''}`}
              onClick={() => hasData && onPageChange('stats')}
              disabled={!hasData}
              title={!hasData ? '请先上传项目' : ''}
            >
              <span className="nav-icon">📈</span>
              <span className="nav-label">统计</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};
