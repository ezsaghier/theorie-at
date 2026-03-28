import React from 'react';
import { getT } from '../i18n';

export default function LandingView({ setTopLevelView, toggleTheme, theme }) {
  const lang = 'en'; // Defaulting to English as per request

  return (
    <>
      <button className="theme-toggle" onClick={toggleTheme}>
        <span className="theme-icon">{theme === 'dark' ? '☀️' : '🌙'}</span>
        <span>{theme === 'dark' ? getT(lang, 'light') : getT(lang, 'dark')}</span>
      </button>

      <div className="hero" style={{ marginTop: '10vh' }}>
        <span className="flag">🇦🇹</span>
        <h1>{getT(lang, 'heroTitle')}<span>{getT(lang, 'heroSub')}</span></h1>
        <p className="subtitle">{getT(lang, 'heroSubtitle')}<br/>{getT(lang, 'heroSubtitle2')}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '300px', margin: '0 auto' }}>
          <button 
            className="load-more-btn" 
            style={{ width: '100%', padding: '15px', fontSize: '18px', borderColor: 'var(--hard)', color: 'var(--hard)', background: 'rgba(255, 107, 107, 0.05)' }}
            onClick={() => setTopLevelView('test')}
          >
            🔥 Random Hard Test
          </button>
          
          <button 
            className="load-more-btn" 
            style={{ width: '100%', padding: '15px', fontSize: '18px', borderColor: 'var(--accent)', color: 'var(--text)' }}
            onClick={() => setTopLevelView('quiz')}
          >
            Proceed to Catalogue ➔
          </button>
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
