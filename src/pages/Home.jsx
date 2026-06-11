import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Gamepad2, Layers, Cpu, Compass } from 'lucide-react';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

const Home = () => {
  const { t, tText } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile/main');
        if (res.data) {
          setProfile(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch profile/main', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-purple-600 animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-20 py-4 animate-fade-in">
      
      {/* HERO SECTION */}
      <header className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto px-4">
        {profile?.avatarUrl ? (
          <div className="relative group">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-full blur-md opacity-40 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src={profile.avatarUrl} 
              alt="Avatar" 
              className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white dark:border-[#09090b] shadow-2xl transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        ) : (
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-purple-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl relative group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500 to-blue-600 blur-sm opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative">H</span>
          </div>
        )}
        
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/50 dark:bg-white/[0.03] backdrop-blur-md text-purple-600 dark:text-purple-400 border border-purple-500/10 rounded-full text-xs font-semibold tracking-wider uppercase">
            <Compass className="w-3.5 h-3.5" /> {t('home_welcome_badge', 'Welcome to my creative space')}
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight text-apple-ink dark:text-apple-white leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
              {profile ? tText(profile.headline) : ''}
            </span>
          </h1>
          <p className="text-base sm:text-xl text-apple-grayNeutral dark:text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            {profile ? tText(profile.subHeadline) : ''}
          </p>

          {/* Social Links */}
          {profile?.socialLinks && (
            <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
              {profile.socialLinks.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/40 dark:bg-white/[0.03] border border-white/60 dark:border-white/5 text-apple-grayNeutral hover:text-apple-ink dark:hover:text-apple-white hover:border-purple-500/30 transition-all text-xs font-semibold hover:scale-105">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                    <path d="M9 18c-4.51 2-5-2-7-2"/>
                  </svg>
                  GitHub
                </a>
              )}
              {profile.socialLinks.linkedin && (
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/40 dark:bg-white/[0.03] border border-white/60 dark:border-white/5 text-apple-grayNeutral hover:text-apple-ink dark:hover:text-apple-white hover:border-blue-500/30 transition-all text-xs font-semibold hover:scale-105">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>
                  </svg>
                  LinkedIn
                </a>
              )}
              {profile.socialLinks.email && (
                <a href={`mailto:${profile.socialLinks.email}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/40 dark:bg-white/[0.03] border border-white/60 dark:border-white/5 text-apple-grayNeutral hover:text-apple-ink dark:hover:text-apple-white hover:border-purple-500/30 transition-all text-xs font-semibold hover:scale-105">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  Email
                </a>
              )}
            </div>
          )}
        </div>
      </header>

      {/* DUAL PATHWAYS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
        
        {/* Mobile App Pathway Card */}
        <Link 
          to="/mobile"
          className="group relative overflow-hidden rounded-3xl p-8 flex flex-col justify-between min-h-[380px] glass-panel glass-card-hover neon-purple-pulse border-purple-500/10"
        >
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-purple-500/10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-purple-500/20"></div>
          
          <div className="space-y-6 z-10">
            <div className="inline-flex p-4 rounded-2xl bg-purple-500/10 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400">
              <Smartphone className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-display font-black text-apple-ink dark:text-apple-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {t('home_mobile_title', 'Mobile Applications')}
              </h2>
              <p className="text-apple-grayNeutral dark:text-gray-300 leading-relaxed text-sm sm:text-base font-light">
                {t('home_mobile_desc', 'Chuyên phát triển ứng dụng di động đa nền tảng chất lượng cao cho iOS & Android bằng Flutter.')}
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-apple-grayBorderSoft/40 dark:border-white/[0.06] flex items-center justify-between text-purple-600 dark:text-purple-400 font-bold z-10 text-sm sm:text-base">
            <span>{t('home_mobile_cta', 'Explore Mobile Apps')}</span>
            <div className="p-2.5 rounded-full bg-purple-500/10 group-hover:translate-x-2 transition-transform duration-300">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Link>

        {/* Game Development Pathway Card */}
        <Link 
          to="/game"
          className="group relative overflow-hidden rounded-3xl p-8 flex flex-col justify-between min-h-[380px] glass-panel glass-card-hover neon-emerald-pulse border-emerald-500/10"
        >
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-emerald-500/20"></div>
          
          <div className="space-y-6 z-10">
            <div className="inline-flex p-4 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              <Gamepad2 className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-3xl font-display font-black text-apple-ink dark:text-apple-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {t('home_game_title', 'Game Development')}
              </h2>
              <p className="text-apple-grayNeutral dark:text-gray-300 leading-relaxed text-sm sm:text-base font-light">
                {t('home_game_desc', 'Đam mê xây dựng các trò chơi độc lập (Indie Games). Sử dụng Unity và Godot Engine.')}
              </p>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-apple-grayBorderSoft/40 dark:border-white/[0.06] flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-bold z-10 text-sm sm:text-base">
            <span>{t('home_game_cta', 'Enter Game Room')}</span>
            <div className="p-2.5 rounded-full bg-emerald-500/10 group-hover:translate-x-2 transition-transform duration-300">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Link>

      </section>

      {/* CORE TECH STACK */}
      {profile?.techStack && profile.techStack.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 pt-12 border-t border-apple-grayBorderSoft/40 dark:border-white/[0.06] text-center space-y-8">
          <h2 className="text-xl font-display font-bold text-apple-ink dark:text-apple-white tracking-widest uppercase flex items-center justify-center gap-2">
            <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400 animate-pulse" /> {t('home_tech_title', 'Core Technologies')}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {profile.techStack.map(tech => (
              <span 
                key={tech} 
                className="px-5 py-2.5 rounded-2xl text-sm font-semibold bg-white/40 dark:bg-white/[0.02] border border-white/60 dark:border-white/5 shadow-sm text-apple-ink dark:text-apple-white hover:border-purple-500/40 dark:hover:border-purple-400/30 hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-apple-grayNeutral opacity-75" />
                {t(tech, tech)}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
