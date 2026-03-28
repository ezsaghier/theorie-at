import React, { useState } from 'react';
import { getT, getTopic } from '../i18n';

const MARKERS = ["A", "B", "C", "D", "E", "F"];

// Unified reusable question body component
function QuestionContent({ q, customStyle = {} }) {
  const imgUrl = q.image ? `/assets/images/${q.image}` : null;
  return (
    <div className="q-body" style={customStyle}>
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
  );
}

function QuestionHeader({ q, lang, hasSub, showSub, setShowSub }) {
  const subjectStr = q.module ? getTopic(lang, q.module) : '';
  const topicStr = getTopic(lang, q.topic);
  const displayTitle = subjectStr ? `${topicStr} (${subjectStr})` : topicStr;

  return (
    <div className="q-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
      <div className="q-id" style={{ minWidth: '60px' }}>#{q.id}</div>
      <div className="q-title" style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: '13px', color: 'var(--text)', margin: '0 10px' }}>
        {displayTitle}
      </div>
      <div className="q-meta" style={{ minWidth: 'fit-content', justifyContent: 'flex-end', display: 'flex', gap: '5px', alignItems: 'center' }}>
        <span className={`pill`} style={{ borderColor: `var(--${q.difficulty?.toLowerCase() || 'border'})`, color: `var(--${q.difficulty?.toLowerCase() || 'text'})` }}>
          {getT(lang, q.type === 'main' ? 'main' : 'supplementary')}/{getT(lang, q.difficulty?.toLowerCase())}
        </span>
        {hasSub && (
          <button 
            className="linked-btn linked-btn-sub" 
            onClick={() => setShowSub(!showSub)}
            style={{ padding: '4px 10px', marginLeft: '4px', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}
          >
            {showSub ? getT(lang, 'hideSup') : getT(lang, 'showSup')}
          </button>
        )}
      </div>
    </div>
  );
}

export default function QuestionCard({ q, allQuestions, lang }) {
  const [showSub, setShowSub] = useState(false);
  const subQuestion = q.sub_id ? allQuestions.find(sq => sq.id === q.sub_id) : null;

  return (
    <div className="q-card">
      <QuestionHeader q={q} lang={lang} hasSub={!!subQuestion} showSub={showSub} setShowSub={setShowSub} />
      
      <QuestionContent q={q} />

      {subQuestion && (
        <div className={`linked-panel ${showSub ? 'open' : ''}`} style={showSub ? { maxHeight: '1000px', opacity: 1 } : {}}>
          <div className="linked-inner below">
            <QuestionHeader q={subQuestion} lang={lang} hasSub={false} />
            
            <QuestionContent q={subQuestion} customStyle={{ padding: 0, marginTop: '10px' }} />
          </div>
        </div>
      )}
    </div>
  );
}
