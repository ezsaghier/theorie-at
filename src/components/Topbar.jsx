import React from 'react';
import { getT } from '../i18n';

export default function Topbar({ setLang, toggleTheme, theme, showingCount, totalCount, lang }) {
  return (
    <div className="topbar">
      <a className="logo" href="#" onClick={(e) => { e.preventDefault(); setLang(null); }}>Theorie<span>Test</span>.at</a>
      <div className="topbar-right">
        <div className="progress-text">
          {getT(lang, 'showing')} <span>{showingCount}</span> {getT(lang, 'of')} <span>{totalCount}</span>
        </div>
        <button className="icon-btn" onClick={() => setLang(null)}>
          🌐 {lang.toUpperCase()}
        </button>
        <button className="icon-btn" onClick={toggleTheme}>
          <span>{theme === 'dark' ? '☀️' : '🌙'}</span> <span>{theme === 'dark' ? getT(lang, 'light') : getT(lang, 'dark')}</span>
        </button>
      </div>
    </div>
  );
}
