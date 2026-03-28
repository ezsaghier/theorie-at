import React, { useState, useEffect, useRef } from 'react';
import { getT } from '../i18n';

export default function Topbar({ 
  setLang, toggleTheme, theme, lang, 
  questionIdSearchText, setQuestionIdSearchText, handleQuestionSearch 
}) {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="topbar" dir="ltr">
      <a className="logo" href="#" onClick={(e) => { e.preventDefault(); setLang('de'); }}>Theorie<span>Test</span>.at</a>
      
      {handleQuestionSearch && (
        <div className="topbar-center">
          <button 
            className="h-menu-btn" 
            disabled
            style={{ opacity: 0.5, cursor: 'not-allowed' }}
          >
            {getT(lang, 'navHardQuestions')}
          </button>
          
          <div className="h-menu-search">
            <span>{getT(lang, 'navSearchQuestion')}</span>
            <input 
              type="text" 
              placeholder={getT(lang, 'searchNumberPlaceholder')}
              value={questionIdSearchText || ''}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || /^[0-9]+$/.test(val)) {
                  setQuestionIdSearchText(val);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleQuestionSearch();
              }}
            />
          </div>
        </div>
      )}

      <div className="topbar-right">
        <div className="lang-dropdown" ref={dropdownRef}>
          <button 
            className="icon-btn lang-btn" 
            onClick={() => setLangMenuOpen(!langMenuOpen)}
          >
            🌐 {lang.toUpperCase()}
          </button>
          <div className={`lang-menu ${langMenuOpen ? 'open' : ''}`}>
            <button onClick={() => { setLang('ar'); setLangMenuOpen(false); }}>🇦🇪 العربية</button>
            <button onClick={() => { setLang('en'); setLangMenuOpen(false); }}>🇬🇧 English</button>
            <button onClick={() => { setLang('de'); setLangMenuOpen(false); }}>🇦🇹 Deutsch</button>
          </div>
        </div>
        <button className="icon-btn" onClick={toggleTheme}>
          <span>{theme === 'dark' ? '☀️' : '🌙'}</span> <span>{theme === 'dark' ? getT('en', 'light') : getT('en', 'dark')}</span>
        </button>
      </div>
    </div>
  );
}
