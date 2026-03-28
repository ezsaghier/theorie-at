import React from 'react';
import { getT } from '../i18n';

const LANGS = [
  { id: 'en', name: 'English', native: 'English', displayFlag: '🇬🇧', status: '✓ Live', disabled: false },
  { id: 'de', name: 'Deutsch', native: 'Deutsch', displayFlag: '🇩🇪', status: '✓ Live', disabled: true },
  { id: 'ar', name: 'Arabic', native: 'العربية', displayFlag: '🇸🇦', status: '✓ Live', disabled: true },
];

export default function HomeView({ setLang, toggleTheme, theme }) {
  const lang = navigator.language.startsWith('ar') ? 'ar' : (navigator.language.startsWith('de') ? 'de' : 'en');
  
  return (
    <>
      <button className="theme-toggle" onClick={toggleTheme}>
        <span className="theme-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
        <span>{theme === 'dark' ? getT(lang, 'light') : getT(lang, 'dark')}</span>
      </button>

      <div className="hero">
        <span className="flag">🇦🇹</span>
        <h1>{getT(lang, 'heroTitle')}<span>{getT(lang, 'heroSub')}</span></h1>
        <p className="subtitle">{getT(lang, 'heroSubtitle')}<br/>{getT(lang, 'heroSubtitle2')}</p>

        

        <div className="lang-grid">
          {LANGS.map(l => (
            <div 
              key={l.id} 
              className={`lang-card ${l.disabled ? 'disabled' : ''}`} 
              onClick={() => !l.disabled && setLang(l.id)}
            >
              <span className="lang-flag">{l.displayFlag}</span>
              <span className="lang-name">{l.name}</span>
              <span className="lang-native">{l.native}</span>
              <span className={`lang-badge ${l.disabled ? 'soon' : ''}`}>{l.disabled ? getT(lang, 'statusSoon') : getT(lang, 'statusLive')}</span>
            </div>
          ))}
        </div>

        <div className="stats">
          <div className="stat"><span className="stat-val">1428</span><span className="stat-label">{getT(lang, 'statsQuestions')}</span></div>
          <div className="stat-sep"></div>
          <div className="stat"><span className="stat-val">22</span><span className="stat-label">{getT(lang, 'statsTopics')}</span></div>
          <div className="stat-sep"></div>
          <div className="stat"><span className="stat-val">3</span><span className="stat-label">{getT(lang, 'statsLangs')}</span></div>
          <div className="stat-sep"></div>
          <div className="stat"><span className="stat-val">100%</span><span className="stat-label">{getT(lang, 'statsFree')}</span></div>
        </div>
      </div>
      
      <div className="page-footer">
        <span>© 2026 Ezzedeen Saghier</span>
        <a href="impressum.html">{getT(lang, 'footerImpressum')}</a>
        <a href="datenschutz.html">{getT(lang, 'footerPrivacy')}</a>
        <a href="mailto:ezsaghier@gmail.com">{getT(lang, 'footerContact')}</a>
      </div>
    </>
  );
}
