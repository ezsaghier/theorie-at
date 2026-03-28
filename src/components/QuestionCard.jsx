import React, { useState } from 'react';
import { getT } from '../i18n';

const MARKERS = ["A", "B", "C", "D", "E", "F"];

export default function QuestionCard({ q, allQuestions, lang }) {
  const [showSub, setShowSub] = useState(false);
  const imgUrl = q.image ? `/assets/images/${q.image}` : null;
  const subQuestion = q.sub_id ? allQuestions.find(sq => sq.id === q.sub_id) : null;

  return (
    <div className="q-card">
      <div className="q-header">
        <div className="q-id">#{q.id}</div>
        <div className="q-meta">
          <span className={`pill pill-${q.difficulty}`}>{getT(lang, q.difficulty)}</span>
          <span className={`pill pill-${q.type}`}>{getT(lang, q.type === 'main' ? 'main' : 'supplementary')}</span>
          {subQuestion && (
            <button 
              className="linked-btn linked-btn-sub" 
              onClick={() => setShowSub(!showSub)}
            >
              {showSub ? getT(lang, 'hideSup') : getT(lang, 'showSup')}
            </button>
          )}
        </div>
      </div>
      
      <div className="q-body">
        {imgUrl && (
          <div className="q-image">
            <img src={imgUrl} alt={`Q${q.id}`} />
          </div>
        )}
        <div className="q-text">{q.text}</div>
        <div className="answers">
          {q.answers.map((a, i) => (
            <div key={a.id || i} className={`answer ${a.correct ? 'correct' : ''}`}>
              <div className="answer-marker">{MARKERS[i]}</div>
              <div>{a.text}</div>
            </div>
          ))}
        </div>
      </div>

      {subQuestion && (
        <div className={`linked-panel ${showSub ? 'open' : ''}`} style={showSub ? { maxHeight: '1000px', opacity: 1 } : {}}>
          <div className="linked-inner below">
            <div className="linked-label">
              ↓ {getT(lang, 'supLabel')} #{subQuestion.id} &nbsp;<span className={`pill pill-${subQuestion.difficulty}`}>{getT(lang, subQuestion.difficulty)}</span>
            </div>
            
            <div className="q-body" style={{ padding: 0 }}>
              {subQuestion.image && (
                <div className="q-image">
                  <img src={`/assets/images/${subQuestion.image}`} alt={`Q${subQuestion.id}`} />
                </div>
              )}
              <div className="q-text">{subQuestion.text}</div>
              <div className="answers">
                {subQuestion.answers.map((a, i) => (
                  <div key={a.id || i} className={`answer ${a.correct ? 'correct' : ''}`}>
                    <div className="answer-marker">{MARKERS[i]}</div>
                    <div>{a.text}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
