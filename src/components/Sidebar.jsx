import React from 'react';

import { getT, getTopic } from '../i18n';

export default function Sidebar({ filters, setFilters, topics, activeTopic, setActiveTopic, searchQuery, setSearchQuery, lang }) {
  const diffs = ['ALL', 'easy', 'medium', 'hard'];
  const types = ['ALL', 'main', 'supplementary'];

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
        <div className="filter-title">{getT(lang, 'filters')}</div>
        
        <div className="filter-group">
          <div className="filter-group-label">{getT(lang, 'difficulty')}</div>
          <div className="chips">
            {diffs.map(d => (
              <div key={getT(lang, d.toLowerCase())} className={getChipClass('diff', d)} onClick={() => clickChip('diff', d)}>{getT(lang, d.toLowerCase())}</div>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <div className="filter-group-label">{getT(lang, 'type')}</div>
          <div className="chips">
            {types.map(t => (
              <div key={t} className={getChipClass('type', t)} onClick={() => clickChip('type', t)}>
                {getT(lang, t.toLowerCase())}
              </div>
            ))}
          </div>
        </div>

        <button className="reset-btn" onClick={() => setFilters({ diff: null, type: null })}>
          {getT(lang, 'reset')}
        </button>
      </div>

      <div className="sidebar-search">
        <input 
          className="search-input" 
          type="text" 
          placeholder={getT(lang, "search")} 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>

      <div className="topic-list">
        <div 
          className={`topic-item ${activeTopic === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTopic('all')}
        >
          <div className="topic-name">{getT(lang, 'allTopics')}</div>
        </div>
        
        {topics.filter(t => t.module === 'Grundwissen').length > 0 && (
          <div className="module-header">
            {getTopic(lang, 'Grundwissen')}
          </div>
        )}
        {topics.filter(t => t.module === 'Grundwissen').map(({ id, name, count }) => (
          <div 
            key={id}
            className={`topic-item ${activeTopic === id ? 'active' : ''}`}
            onClick={() => setActiveTopic(id)}
          >
            <div className="topic-name">{name}</div>
            <div className="topic-cnt">{count}</div>
          </div>
        ))}

        {topics.filter(t => t.module === 'B-Fragen').length > 0 && (
          <div className="module-header">
            {getTopic(lang, 'B-Fragen')}
          </div>
        )}
        {topics.filter(t => t.module === 'B-Fragen').map(({ id, name, count }) => (
          <div 
            key={id}
            className={`topic-item ${activeTopic === id ? 'active' : ''}`}
            onClick={() => setActiveTopic(id)}
          >
            <div className="topic-name">{name}</div>
            <div className="topic-cnt">{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
