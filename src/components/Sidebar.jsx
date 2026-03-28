import React from 'react';

import { getT, getTopic } from '../i18n';

export default function Sidebar({ filters, setFilters, topics, activeTopics, handleToggleTopic, handleToggleModule, handleResetFilters, lang }) {
  const diffs = ['ALL', 'Hard'];

  const clickChip = (group, val) => {
    setFilters(prev => ({
      ...prev,
      [group]: (val === 'ALL' || prev[group] === val) ? null : val
    }));
  };

  const getChipClass = (group, val) => {
    if (filters[group] === null) return val === 'ALL' ? 'chip all-on' : 'chip dim';
    if (val === 'ALL') return 'chip dim';
    if (val === filters[group]) return `chip on-${val}`;
    return 'chip dim';
  };

  return (
    <div className="sidebar">
      <div className="filter-section">
        
        <div className="filter-group">
          <div className="filter-group-label">{getT(lang, 'difficulty')}</div>
          <div className="chips">
            {diffs.map(d => (
              <div key={getT(lang, d.toLowerCase())} className={getChipClass('diff', d)} onClick={() => clickChip('diff', d)}>{getT(lang, d.toLowerCase())}</div>
            ))}
          </div>
        </div>
        
        <button className="reset-btn" onClick={handleResetFilters} style={{marginTop: '16px'}}>
          {getT(lang, 'reset')}
        </button>
      </div>

      <div className="topic-list">
        {topics.filter(t => t.module === 'Grundwissen').length > 0 && (
          <div 
            className="module-header clickable-header"
            onClick={() => handleToggleModule(topics.filter(t => t.module === 'Grundwissen').map(t => t.id))}
          >
            {getTopic(lang, 'Grundwissen')}
          </div>
        )}
        {topics.filter(t => t.module === 'Grundwissen').map(({ id, name, count }) => (
          <div 
            key={id}
            className={`topic-item ${activeTopics.includes(id) ? 'active' : ''}`}
            onClick={() => handleToggleTopic(id)}
          >
            <div className="topic-name">{name}</div>
            <div className="topic-cnt">{count}</div>
          </div>
        ))}

        {topics.filter(t => t.module === 'B-Fragen').length > 0 && (
          <div 
            className="module-header clickable-header"
            onClick={() => handleToggleModule(topics.filter(t => t.module === 'B-Fragen').map(t => t.id))}
          >
            {getTopic(lang, 'B-Fragen')}
          </div>
        )}
        {topics.filter(t => t.module === 'B-Fragen').map(({ id, name, count }) => (
          <div 
            key={id}
            className={`topic-item ${activeTopics.includes(id) ? 'active' : ''}`}
            onClick={() => handleToggleTopic(id)}
          >
            <div className="topic-name">{name}</div>
            <div className="topic-cnt">{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
