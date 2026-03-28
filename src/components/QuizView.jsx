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
  
  const [activeTopics, setActiveTopics] = useState(() => {
    const saved = localStorage.getItem('quiz_topics');
    return saved ? JSON.parse(saved) : [];
  });

  const [visibleCount, setVisibleCount] = useState(20);

  const [questionIdSearchText, setQuestionIdSearchText] = useState('');
  const [activeQuestionId, setActiveQuestionId] = useState('');

  useEffect(() => {
    localStorage.setItem('quiz_filters', JSON.stringify(filters));
    localStorage.setItem('quiz_topics', JSON.stringify(activeTopics));
  }, [filters, activeTopics]);

  const handleToggleTopic = (topicId) => {
    setActiveTopics(prev => prev.includes(topicId) ? prev.filter(id => id !== topicId) : [...prev, topicId]);
    setActiveQuestionId('');
    setQuestionIdSearchText('');
  };

  const handleToggleModule = (moduleTopicIds) => {
    setActiveTopics(prev => {
      const allIncluded = moduleTopicIds.every(id => prev.includes(id));
      if (allIncluded) {
        return prev.filter(id => !moduleTopicIds.includes(id));
      } else {
        const next = [...prev];
        moduleTopicIds.forEach(id => {
          if (!next.includes(id)) next.push(id);
        });
        return next;
      }
    });
    setActiveQuestionId('');
    setQuestionIdSearchText('');
  };

  const handleSetFilters = (valUpdater) => {
    setFilters(valUpdater);
    setActiveQuestionId('');
    setQuestionIdSearchText('');
  };

  const handleQuestionSearch = () => {
    setActiveQuestionId(questionIdSearchText);
    setFilters({ diff: null });
    setActiveTopics([]);
  };

  const handleResetFilters = () => {
    setFilters({ diff: null });
    setActiveTopics([]);
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
    // Ensure all topics exist in map
    allQuestions.forEach(q => {
      if (!map[q.topic]) map[q.topic] = { count: 0, module: q.module };
    });
    
    // Count only questions matching the current diff filter
    const filteredForCounts = allQuestions.filter(q => filters.diff === null || q.difficulty === filters.diff);
    filteredForCounts.forEach(q => {
      map[q.topic].count++;
    });
    
    const topicList = Object.keys(map).map(name => ({ 
      id: name, 
      name: getTopic(lang, name), 
      count: map[name].count, 
      module: map[name].module 
    }));
    
    return topicList.sort((a, b) => b.count - a.count);
  }, [allQuestions, filters.diff]);

  const filteredQuestions = useMemo(() => {
    if (activeQuestionId) {
      const targetId = parseInt(activeQuestionId, 10);
      return allQuestions.filter(q => q.id === targetId || q.parent_id === targetId);
    }

    return allQuestions.filter(q => {
      const matchDiff = filters.diff === null || q.difficulty === filters.diff;
      const matchTopic = activeTopics.length === 0 || activeTopics.includes(q.topic);
      return matchTopic && matchDiff;
    });
  }, [allQuestions, activeTopics, filters, activeQuestionId]);

  const questionsToShow = filteredQuestions.slice(0, visibleCount);

  useEffect(() => {
    // Reset pagination when any filter fires
    setVisibleCount(20);
  }, [activeTopics, filters, activeQuestionId]);

  return (
    <>
      <Topbar 
        setLang={setLang} 
        toggleTheme={toggleTheme} 
        theme={theme} 
        lang={lang}
        
        questionIdSearchText={questionIdSearchText}
        setQuestionIdSearchText={setQuestionIdSearchText}
        handleQuestionSearch={handleQuestionSearch}
      />
      <div className="layout">
        <Sidebar 
          filters={filters} setFilters={handleSetFilters}
          topics={topicsMap} lang={lang} 
          activeTopics={activeTopics} 
          handleToggleTopic={handleToggleTopic}
          handleToggleModule={handleToggleModule}
          handleResetFilters={handleResetFilters}
        />
        <div className="main-wrap">
          <div className="main">
             
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
