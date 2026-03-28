import React, { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import { getT, getTopic } from '../i18n';
import QuestionCard from './QuestionCard';

export default function QuizView({ lang, setLang, toggleTheme, theme }) {
  const [allQuestions, setAllQuestions] = useState([]);
  
  const [filters, setFilters] = useState(() => {
    const saved = localStorage.getItem('quiz_filters');
    return saved ? JSON.parse(saved) : { diff: null, type: null };
  });
  
  const [activeTopic, setActiveTopic] = useState(() => {
    return localStorage.getItem('quiz_topic') || 'all';
  });

  const [visibleCount, setVisibleCount] = useState(20);

  const [questionIdSearchText, setQuestionIdSearchText] = useState('');
  const [activeQuestionId, setActiveQuestionId] = useState('');

  useEffect(() => {
    localStorage.setItem('quiz_filters', JSON.stringify(filters));
    localStorage.setItem('quiz_topic', activeTopic);
  }, [filters, activeTopic]);

  const handleSetTopic = (val) => {
    setActiveTopic(val);
    setActiveQuestionId('');
    setQuestionIdSearchText('');
  };

  const handleSetFilters = (valUpdater) => {
    setFilters(valUpdater);
    setActiveQuestionId('');
    setQuestionIdSearchText('');
  };

  useEffect(() => {
    // Load local json DB based on currently selected language
    fetch(`/question_catalog_${lang}.json`)
      .then(res => res.json())
      .then(data => setAllQuestions(data))
      .catch(err => console.error("Error loading JSON catalog:", err));
  }, [lang]);

  const topicsMap = useMemo(() => {
    const map = {};
    allQuestions.forEach(q => {
      if (!map[q.topic]) map[q.topic] = { count: 0, module: q.module };
      map[q.topic].count++;
    });
    
    const topicList = Object.keys(map).map(name => ({ 
      id: name, 
      name: getTopic(lang, name), 
      count: map[name].count, 
      module: map[name].module 
    }));
    
    return topicList.sort((a, b) => b.count - a.count);
  }, [allQuestions]);

  const filteredQuestions = useMemo(() => {
    if (activeQuestionId) {
      const targetId = parseInt(activeQuestionId, 10);
      return allQuestions.filter(q => q.id === targetId || q.parent_id === targetId);
    }

    return allQuestions.filter(q => {
      const matchDiff = filters.diff === null || q.difficulty === filters.diff;
      const matchTopic = activeTopic === 'all' || q.topic === activeTopic;
      return matchTopic && matchDiff;
    });
  }, [allQuestions, activeTopic, filters, activeQuestionId]);

  const questionsToShow = filteredQuestions.slice(0, visibleCount);

  useEffect(() => {
    // Reset pagination when any filter fires
    setVisibleCount(20);
  }, [activeTopic, filters, activeQuestionId]);

  return (
    <>
      <Topbar 
        setLang={setLang} 
        toggleTheme={toggleTheme} 
        theme={theme} 
        lang={lang}
      />
      <div className="horizontal-menu">
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
            value={questionIdSearchText}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '' || /^[0-9]+$/.test(val)) {
                setQuestionIdSearchText(val);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                setActiveQuestionId(questionIdSearchText);
              }
            }}
          />
        </div>
      </div>
      <div className="layout">
        <Sidebar 
          filters={filters} setFilters={handleSetFilters}
          topics={topicsMap} lang={lang} 
          activeTopic={activeTopic} setActiveTopic={handleSetTopic}
        />
        <div className="main-wrap">
          <div className="main">
             <div className="results-info">
               <span className="results-count">{filteredQuestions.length}</span> {getT(lang, 'questions')}
               {filters.diff && <span className="filter-tag">{getT(lang, filters.diff)}</span>}
               {activeTopic !== 'all' && <span className="filter-tag">📍 {getTopic(lang, activeTopic)}</span>}
             </div>
             
             {questionsToShow.map(q => (
               <QuestionCard key={q.id} q={q} allQuestions={allQuestions} lang={lang} />
             ))}
             
             {visibleCount < filteredQuestions.length && (
               <div className="load-more-wrap">
                 <button className="load-more-btn" onClick={() => setVisibleCount(v => v + 20)}>
                   {getT(lang, 'loadMore')}
                 </button>
               </div>
             )}

             {filteredQuestions.length === 0 && (
               <div className="empty">
                 {getT(lang, 'noMatches')}
               </div>
             )}
          </div>
        </div>
      </div>
    </>
  );
}
