import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';

export default function TestView({ setTopLevelView, toggleTheme, theme }) {
  const [testQuestion, setTestQuestion] = useState(null);
  const [catalogs, setCatalogs] = useState({ ar: [], en: [], de: [] });
  const [langIndex, setLangIndex] = useState(0);
  
  const langs = ['ar', 'en', 'de'];
  const currentLang = langs[langIndex];

  useEffect(() => {
    if (currentLang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', currentLang);
    }
  }, [currentLang]);

  useEffect(() => {
    const initialDir = document.documentElement.getAttribute('dir');
    const initialLang = document.documentElement.getAttribute('lang');
    return () => {
      document.documentElement.setAttribute('dir', initialDir || 'ltr');
      document.documentElement.setAttribute('lang', initialLang || 'de');
    };
  }, []);

  useEffect(() => {
    Promise.all([
      fetch('/question_catalog_ar.json').then(res => res.json()),
      fetch('/question_catalog_en.json').then(res => res.json()),
      fetch('/question_catalog_de.json').then(res => res.json())
    ])
      .then(([ar, en, de]) => {
        const dbs = { ar, en, de };
        setCatalogs(dbs);
        generateRandomQuestion(dbs, 0);
      })
      .catch(err => console.error("Error loading DBs in Test Mode:", err));
  }, []);

  const generateRandomQuestion = (dbs, idx) => {
    const lang = langs[idx];
    const db = dbs[lang];
    if (!db || db.length === 0) return;
    const hardMainWithSup = db.filter(q => q.type === 'main' && q.difficulty === 'Hard' && q.sub_id != null);
    if (hardMainWithSup.length > 0) {
      const rnd = Math.floor(Math.random() * hardMainWithSup.length);
      setTestQuestion(hardMainWithSup[rnd]);
    }
  };

  const handleNextQuestion = () => {
    const nextIdx = (langIndex + 1) % langs.length;
    setLangIndex(nextIdx);
    generateRandomQuestion(catalogs, nextIdx);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <button 
          className="icon-btn" 
          onClick={() => setTopLevelView('landing')} 
          style={{ fontSize: '14px', padding: '10px 20px', borderRadius: '10px' }}
        >
          ← Back to Menu
        </button>
        <button 
          className="icon-btn" 
          onClick={toggleTheme} 
          style={{ padding: '10px 15px', borderRadius: '10px' }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontFamily: '"DM Mono", monospace', fontSize: '18px', color: 'var(--hard)' }}>🔥 RANDOM HARD TEST</h2>
      </div>

      <div className="main" style={{ padding: 0 }}>
        {testQuestion ? (
          <>
            <QuestionCard key={`${currentLang}-${testQuestion.id}`} q={testQuestion} allQuestions={catalogs[currentLang]} lang={currentLang} />
            <div className="load-more-wrap" style={{ marginTop: '30px' }}>
              <button 
                className="load-more-btn" 
                onClick={handleNextQuestion}
                style={{ borderColor: 'var(--accent)', color: 'var(--accent)', padding: '12px 30px', fontSize: '15px' }}
              >
                Next Random Question →
              </button>
            </div>
          </>
        ) : (
          <div className="empty">Loading...</div>
        )}
      </div>
    </div>
  );
}
