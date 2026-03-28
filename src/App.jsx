import { useState, useEffect } from 'react';
import LandingView from './components/LandingView';
import QuizView from './components/QuizView';
import TestView from './components/TestView';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [lang, setLang] = useState('de'); 
  const [topLevelView, setTopLevelView] = useState('landing');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', lang);
    }
  }, [lang]);

  return (
    <>
      {topLevelView === 'landing' && (
        <LandingView setTopLevelView={setTopLevelView} toggleTheme={toggleTheme} theme={theme} />
      )}
      {topLevelView === 'test' && (
        <TestView setTopLevelView={setTopLevelView} toggleTheme={toggleTheme} theme={theme} />
      )}
      {topLevelView === 'quiz' && (
        <QuizView 
          lang={lang} 
          setLang={setLang} 
          toggleTheme={toggleTheme} 
          theme={theme} 
        />
      )}
    </>
  );
}

export default App;