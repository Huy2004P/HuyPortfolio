import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';
import api from '../api';

const Layout = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');
  const { lang, setLang, t, tText, LANG_OPTIONS } = useLanguage();
  const [customPages, setCustomPages] = useState([]);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const res = await api.get('/pages');
        setCustomPages(res.data || []);
      } catch (err) {
        console.error('Failed to load custom pages for layout', err);
      }
    };
    fetchPages();
  }, [location.pathname]);

  const headerCustomLinks = customPages
    .filter(page => page.metadata?.isCustom && page.metadata?.showInHeader)
    .map(page => ({
      name: tText(page.navTitle) || tText(page.title),
      path: `/page/${page.key}`
    }));

  const navLinks = [
    { name: t('nav_home', 'Home'), path: '/' },
    { name: t('nav_mobile', 'Mobile Apps'), path: '/mobile' },
    { name: t('nav_game', 'Game Portfolio'), path: '/game' },
    { name: t('nav_projects', 'Projects'), path: '/projects' },
    { name: t('nav_blog', 'Blog'), path: '/blog' },
    { name: t('nav_contact', 'Contact'), path: '/contact' },
    ...headerCustomLinks
  ];

  const handleLinkClick = () => setMobileMenuOpen(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterMsg('');
    try {
      await api.post('/subscriber', { email: newsletterEmail });
      setNewsletterMsg(t('msg_subscribed', 'Subscribed!'));
      setNewsletterEmail('');
    } catch {
      setNewsletterMsg(t('msg_subscribed_failed', 'Already subscribed or invalid email.'));
    }
    setTimeout(() => setNewsletterMsg(''), 3000);
  };

  const currentLang = LANG_OPTIONS.find(l => l.code === lang) || LANG_OPTIONS[0];

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-hidden transition-colors duration-500">
      
      {/* BACKGROUND MESH GRADIENTS (Glowing Blobs) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-[35vw] h-[35vw] max-w-[500px] rounded-full bg-purple-500/10 dark:bg-purple-600/10 blur-[90px] animate-float-blob"></div>
        <div className="absolute bottom-[20%] right-[5%] w-[40vw] h-[40vw] max-w-[600px] rounded-full bg-blue-500/10 dark:bg-emerald-600/5 blur-[120px] animate-float-blob-reverse"></div>
        <div className="absolute top-[45%] left-[45%] w-[25vw] h-[25vw] rounded-full bg-pink-500/5 dark:bg-indigo-950/20 blur-[80px]"></div>
      </div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 glass-navbar">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link 
              to="/" 
              onClick={handleLinkClick} 
              className="text-xl font-display font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-emerald-400 bg-clip-text text-transparent"
            >
              Huy Portfolio
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden sm:flex items-center space-x-5 text-sm">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative py-1 transition-all duration-300 font-medium ${
                      isActive
                        ? 'text-apple-ink dark:text-apple-white'
                        : 'text-apple-grayNeutral hover:text-apple-ink dark:hover:text-apple-white'
                    }`}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 rounded bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-400 dark:to-emerald-400"></span>
                    )}
                  </Link>
                );
              })}
              
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(v => !v)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-apple-grayBorderSoft dark:border-white/10 text-xs font-semibold text-apple-grayNeutral hover:text-apple-ink dark:hover:text-apple-white hover:border-purple-500/40 transition-all"
                  aria-label="Select language"
                >
                  <span>{currentLang.flag}</span>
                  <span>{currentLang.label}</span>
                  <svg className="w-3 h-3 opacity-60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                {langOpen && (
                  <div className="absolute right-0 mt-2 w-36 rounded-xl border border-apple-grayBorderSoft dark:border-white/10 bg-white dark:bg-[#09090b] shadow-xl z-50 overflow-hidden">
                    {LANG_OPTIONS.map(opt => (
                      <button
                        key={opt.code}
                        onClick={() => { setLang(opt.code); setLangOpen(false); }}
                        className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                          lang === opt.code
                            ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold'
                            : 'text-apple-grayNeutral hover:bg-apple-grayPale dark:hover:bg-white/5 hover:text-apple-ink dark:hover:text-apple-white'
                        }`}
                      >
                        <span className="text-base">{opt.flag}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={toggleDarkMode}
                className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-apple-grayNeutral hover:text-apple-ink dark:hover:text-apple-white transition-all"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <SunIcon className="w-5 h-5 text-yellow-500" /> : <MoonIcon className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="flex sm:hidden items-center gap-2">
              {/* Mobile Lang Selector */}
              <div className="relative">
                <button
                  onClick={() => setLangOpen(v => !v)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg border border-apple-grayBorderSoft dark:border-white/10 text-xs font-semibold text-apple-grayNeutral"
                >
                  <span>{currentLang.flag}</span>
                </button>
                {langOpen && (
                  <div className="absolute right-0 mt-2 w-32 rounded-xl border border-apple-grayBorderSoft dark:border-white/10 bg-white dark:bg-[#09090b] shadow-xl z-50 overflow-hidden">
                    {LANG_OPTIONS.map(opt => (
                      <button
                        key={opt.code}
                        onClick={() => { setLang(opt.code); setLangOpen(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${
                          lang === opt.code ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold' : 'text-apple-grayNeutral hover:bg-apple-grayPale dark:hover:bg-white/5'
                        }`}
                      >
                        <span>{opt.flag}</span><span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-apple-grayNeutral hover:text-apple-ink dark:hover:text-apple-white transition-all"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <SunIcon className="w-5 h-5 text-yellow-500" /> : <MoonIcon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-apple-grayNeutral hover:text-apple-ink dark:hover:text-apple-white transition-all"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-apple-grayBorderSoft/30 dark:border-white/[0.06] px-4 py-3 flex flex-col gap-1 bg-white/95 dark:bg-[#09090b]/95 backdrop-blur-xl">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400'
                      : 'text-apple-grayNeutral hover:bg-black/5 dark:hover:bg-white/5 hover:text-apple-ink dark:hover:text-apple-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className={location.pathname === '/page/graduation'
        ? "flex-grow w-full py-0 relative z-10"
        : "flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10"
      }>
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-apple-grayBorderSoft/40 dark:border-white/[0.06] py-10 text-center text-apple-grayNeutral text-sm mt-auto backdrop-blur-sm bg-white/10 dark:bg-black/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
          {/* Newsletter */}
          <div className="max-w-sm mx-auto space-y-2">
            <p className="font-semibold text-apple-ink dark:text-apple-white text-sm">{t('lbl_newsletter', 'Newsletter')}</p>
            <p className="text-xs text-apple-grayNeutral">{t('txt_newsletter_desc', 'Get notified about new projects and articles.')}</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                placeholder={t('lbl_newsletter_placeholder', 'email@example.com')}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-apple-grayBorderMid bg-white/60 dark:bg-white/[0.03] text-apple-ink dark:text-apple-white placeholder-apple-grayNeutral focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors"
              >
                {t('btn_subscribe', 'Subscribe')}
              </button>
            </form>
            {newsletterMsg && <p className="text-xs text-purple-600 dark:text-purple-400">{newsletterMsg}</p>}
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs sm:text-sm">
            <Link to="/privacy" className="hover:text-apple-ink dark:hover:text-apple-white transition-colors">{t('nav_privacy', 'Privacy Policy')}</Link>
            <Link to="/terms" className="hover:text-apple-ink dark:hover:text-apple-white transition-colors">{t('nav_terms', 'Terms of Service')}</Link>
            <Link to="/donation" className="hover:text-apple-ink dark:hover:text-apple-white transition-colors text-purple-600 dark:text-purple-400 font-semibold">{t('nav_donation', 'Donate & Support')}</Link>
            
            {customPages
              .filter(page => page.metadata?.isCustom && page.metadata?.showInFooter)
              .map(page => (
                <Link
                  key={page.key}
                  to={`/page/${page.key}`}
                  className="hover:text-apple-ink dark:hover:text-apple-white transition-colors"
                >
                  {tText(page.navTitle) || tText(page.title)}
                </Link>
              ))}
          </div>
          <p className="opacity-70">&copy; {new Date().getFullYear()} {t('footer_rights', 'Huy Portfolio. Crafted with React & Tailwind.')}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
