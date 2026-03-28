import { useState, useEffect } from 'react';
import HomeView from './components/HomeView';
import QuizView from './components/QuizView';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [lang, setLang] = useState(null); 

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  useEffect(() => {
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
      document.documentElement.setAttribute('lang', 'ar');
    } else if (lang) {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', lang);
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      document.documentElement.setAttribute('lang', 'de'); 
    }
  }, [lang]);

  return (
    <>
      {!lang ? (
        <HomeView setLang={setLang} toggleTheme={toggleTheme} theme={theme} />
      ) : (
        <QuizView lang={lang} setLang={setLang} toggleTheme={toggleTheme} theme={theme} />
      )}
    </>
  );
}

export default App;