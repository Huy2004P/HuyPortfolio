import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

// ─── Supported languages ────────────────────────────────────────────────────
const LANG_OPTIONS = [
  { code: 'vi', flag: '🇻🇳', label: 'Tiếng Việt' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'ja', flag: '🇯🇵', label: '日本語' },
  { code: 'ko', flag: '🇰🇷', label: '한국어' },
  { code: 'zh', flag: '🇨🇳', label: '中文' },
];

// ─── Context ─────────────────────────────────────────────────────────────────
const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => localStorage.getItem('lang') || 'vi');
  const [dict, setDict] = useState({});
  const [loading, setLoading] = useState(true);

  const loadDict = useCallback(async (targetLang) => {
    setLoading(true);
    try {
      const res = await api.get(`/dictionary/${targetLang}`);
      if (res.data && typeof res.data === 'object') {
        setDict(res.data);
      }
    } catch {
      // API unavailable — dict stays empty, t() returns fallback/key
      setDict({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDict(lang);
  }, [lang, loadDict]);

  const setLang = (newLang) => {
    localStorage.setItem('lang', newLang);
    setLangState(newLang);
  };

  /** Translate static UI label from dictionary API */
  const t = (key, fallback) => dict[key] ?? fallback ?? key;

  /** Translate a Map-of-String field from DB (e.g. project.title = {vi:'...', en:'...'}) */
  const tText = (obj, fallback = '') => {
    if (!obj) return fallback;
    if (typeof obj === 'string') return obj; // plain string backwards compat
    return obj[lang] || obj['vi'] || obj['en'] || fallback;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, tText, dict, loading, LANG_OPTIONS }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
