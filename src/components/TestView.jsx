import React, { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';

export default function TestView({ setTopLevelView, toggleTheme, theme }) {
  const [testQuestion, setTestQuestion] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const lang = 'en';

  useEffect(() => {
    fetch(`/question_catalog_${lang}.json`)
      .then(res => res.json())
      .then(data => {
        setAllQuestions(data);
        generateRandomQuestion(data);
      })
      .catch(err => console.error("Error loading DB in Test Mode:", err));
  }, []);

  const generateRandomQuestion = (db) => {
    const dataSource = db || allQuestions;
    const hardMain = dataSource.filter(q => q.type === 'main' && q.difficulty === 'Hard');
    if (hardMain.length > 0) {
      const rnd = Math.floor(Math.random() * hardMain.length);
      setTestQuestion(hardMain[rnd]);
    }
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
            <QuestionCard key={testQuestion.id} q={testQuestion} allQuestions={allQuestions} lang={lang} />
            <div className="load-more-wrap" style={{ marginTop: '30px' }}>
              <button 
                className="load-more-btn" 
                onClick={() => generateRandomQuestion(null)}
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
