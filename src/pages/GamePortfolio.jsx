import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Play, Video, Download, Cpu, Calendar, ChevronRight, X, ExternalLink, Activity } from 'lucide-react';
import api from '../api';
import { format } from 'date-fns';
import { useLanguage } from '../context/LanguageContext';

const GamePortfolio = () => {
  const { t, tText } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [games, setGames] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [activePlayUrl, setActivePlayUrl] = useState(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);
  const [activeGameTitle, setActiveGameTitle] = useState('');

  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const [profileRes, projectsRes, postsRes] = await Promise.all([
          api.get('/profile/game'),
          api.get('/projects?type=game'),
          api.get('/posts?category=game')
        ]);
        if (profileRes.data) setProfile(profileRes.data);
        // API without page/limit returns array directly
        if (projectsRes.data) setGames(Array.isArray(projectsRes.data) ? projectsRes.data : projectsRes.data.data || []);
        if (postsRes.data) setPosts(Array.isArray(postsRes.data) ? postsRes.data.filter(p => p.published) : postsRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch game portfolio data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGameData();
  }, []);

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) 
      ? `https://www.youtube.com/embed/${match[2]}` 
      : url;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-emerald-600 animate-spin"></div>
        </div>
      </div>
    );
  }

  const displayProfile = profile || {
    headline: {},
    subHeadline: {},
    techStack: [],
    socialLinks: {}
  };

  return (
    <div className="space-y-16 py-4 animate-fade-in text-apple-ink dark:text-apple-white relative">
      
      {/* Background Retro Scanline Grid */}
      <div className="absolute inset-0 -z-10 retro-grid pointer-events-none opacity-40 dark:opacity-75 rounded-3xl"></div>

      {/* GAME ROOM BANNER HERO */}
      <header className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-apple-ink dark:text-apple-white glass-panel neon-emerald-pulse border-emerald-500/25 shadow-lg flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Floating internal radial ball */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider">
            <Gamepad2 className="w-3.5 h-3.5" /> {t('arcade_cabin_room', 'Arcade Cabin Room')}
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight leading-tight neon-text-emerald">
            {tText(displayProfile.headline)}
          </h1>
          <p className="text-apple-grayNeutral dark:text-gray-300 text-sm sm:text-lg font-light leading-relaxed">
            {tText(displayProfile.subHeadline)}
          </p>
          
          {/* Social Profiles */}
          {displayProfile.socialLinks && (
            <div className="flex flex-wrap gap-3 pt-2">
              {displayProfile.socialLinks.itchio && (
                <a href={displayProfile.socialLinks.itchio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-650 text-white transition-colors text-xs font-semibold shadow-md hover:scale-105">
                  {t('itchio_channel', 'Itch.io Channel')}
                </a>
              )}
              {displayProfile.socialLinks.youtube && (
                <a href={displayProfile.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-650 hover:bg-red-700 text-white transition-colors text-xs font-semibold shadow-md hover:scale-105">
                  {t('youtube_devlogs', 'YouTube Devlogs')}
                </a>
              )}
              {displayProfile.socialLinks.github && (
                <a href={displayProfile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 transition-all text-xs font-semibold hover:scale-105">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg> GitHub
                </a>
              )}
            </div>
          )}
        </div>

        {/* Retro Gamepad icon */}
        <div className="shrink-0 relative hidden md:block">
          <div className="absolute inset-0 rounded-3xl bg-emerald-600/10 blur-xl"></div>
          <div className="relative p-6 bg-white/40 dark:bg-white/[0.02] border border-white/60 dark:border-white/10 rounded-3xl shadow-lg">
            <Gamepad2 className="w-16 h-16 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </header>

      {/* TECH STACKS */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-display font-black border-b border-apple-grayBorderSoft/40 dark:border-white/[0.06] pb-3 text-apple-ink dark:text-apple-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> {t('engine_systems_architecture', 'Engine & Systems Architecture')}
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {displayProfile.techStack && displayProfile.techStack.map(tech => (
            <span key={tech} className="px-4 py-2 bg-white/60 dark:bg-white/[0.02] border border-white/80 dark:border-white/5 shadow-sm rounded-2xl text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 hover:border-emerald-500/30 transition-colors">
              <Cpu className="w-3.5 h-3.5 opacity-75" />
              {t(tech, tech)}
            </span>
          ))}
        </div>
      </section>

      {/* GAMES GRID LIST */}
      <section className="space-y-8">
        <h2 className="text-xl sm:text-2xl font-display font-black border-b border-apple-grayBorderSoft/40 dark:border-white/[0.06] pb-3 text-apple-ink dark:text-apple-white">
          {t('my_games_collection', 'My Games Collection')} ({games.length})
        </h2>
        
        {games.length === 0 ? (
          <p className="text-apple-grayNeutral">{t('no_game_projects', 'Chưa có dự án Game nào được tải lên.')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {games.map((game) => {
              const playStoreUrl = game.downloadUrls?.playStore || '';
              const appStoreUrl = game.downloadUrls?.appStore || '';
              const itchioUrl = game.downloadUrls?.itchio || '';
              const steamUrl = game.downloadUrls?.steam || '';
              const projectUrl = game.projectUrl || '';

              return (
                <div key={game._id} className="group glass-panel border-emerald-500/10 rounded-3xl overflow-hidden flex flex-col hover:border-emerald-500/20 hover:shadow-xl transition-all duration-300">
                  
                  {/* Game Cover with glowing title overlay */}
                  <div className="aspect-video relative overflow-hidden bg-zinc-950">
                    {game.imageUrl ? (
                      <img 
                        src={game.imageUrl} 
                        alt={tText(game.title)} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Gamepad2 className="w-16 h-16 text-zinc-800" />
                      </div>
                    )}
                    
                    {/* Game Engine Badge */}
                    {game.engine && (
                      <span className="absolute top-4 left-4 px-2.5 py-1 rounded bg-black/85 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold font-mono tracking-widest uppercase">
                        {game.engine}
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4 flex flex-col flex-grow justify-between">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {game.platforms?.map(plat => (
                          <span key={plat} className="text-[9px] px-2 py-0.5 rounded bg-black/20 dark:bg-black/50 text-apple-grayNeutral font-black uppercase tracking-wider border border-white/5">
                            {plat}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                        {tText(game.title)}
                      </h3>

                      <p className="text-apple-grayNeutral dark:text-gray-300 text-sm leading-relaxed font-light line-clamp-3">
                        {tText(game.description)}
                      </p>

                      {/* Tech badges */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {game.technologies?.map(tech => (
                          <span key={tech} className="text-[10px] px-2.5 py-1 bg-white/40 dark:bg-[#09090b]/40 border border-white/60 dark:border-white/5 rounded text-apple-grayNeutral font-medium">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Console buttons */}
                    <div className="space-y-3.5 pt-4 border-t border-apple-grayBorderSoft/40 dark:border-white/[0.06]">
                      <div className="grid grid-cols-2 gap-2">
                        {game.playableUrl ? (
                          <button
                            onClick={() => {
                              setActivePlayUrl(game.playableUrl);
                              setActiveGameTitle(game.title);
                            }}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm hover:scale-[1.03]"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" /> {t('play_webgl', 'Play WebGL')}
                          </button>
                        ) : (
                          <span className="text-[10px] text-center text-apple-grayNeutral border border-dashed border-apple-grayBorderSoft/40 dark:border-white/[0.06] py-2 rounded-xl">
                            {t('webgl_na', 'Chạy WebGL (N/A)')}
                          </span>
                        )}

                        {game.videoUrl ? (
                          <button
                            onClick={() => {
                              setActiveVideoUrl(getYoutubeEmbedUrl(game.videoUrl));
                              setActiveGameTitle(game.title);
                            }}
                            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/50 hover:bg-white/80 dark:bg-[#121214] dark:hover:bg-[#121214]/80 text-apple-ink dark:text-apple-white text-xs font-bold transition-all border border-emerald-500/10 hover:scale-[1.03]"
                          >
                            <Video className="w-3.5 h-3.5" /> {t('watch_trailer', 'Watch Trailer')}
                          </button>
                        ) : (
                          <span className="text-[10px] text-center text-apple-grayNeutral border border-dashed border-apple-grayBorderSoft/40 dark:border-white/[0.06] py-2 rounded-xl">
                            {t('trailer_na', 'Trailer Video (N/A)')}
                          </span>
                        )}
                      </div>

                      {/* Store Links */}
                      <div className="flex flex-wrap gap-2.5 pt-1.5 justify-center sm:justify-start text-xs font-bold text-apple-grayNeutral">
                        {steamUrl && (
                          <a href={steamUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                            <Download className="w-3 h-3" /> {t('steam', 'Steam')}
                          </a>
                        )}
                        {itchioUrl && (
                          <a href={itchioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                            <Download className="w-3 h-3" /> {t('itchio', 'Itch.io')}
                          </a>
                        )}
                        {playStoreUrl && (
                          <a href={playStoreUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                            <Download className="w-3 h-3" /> {t('play_store', 'Play Store')}
                          </a>
                        )}
                        {appStoreUrl && (
                          <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                            <Download className="w-3 h-3" /> {t('app_store', 'App Store')}
                          </a>
                        )}
                        {projectUrl && (
                          <a href={projectUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors">
                            <ExternalLink className="w-3 h-3" /> {t('repo', 'Repo')}
                          </a>
                        )}
                      </div>


                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>


      {/* WebGL Modal with scanlines */}
      {activePlayUrl && (
        <div className="fixed inset-0 bg-black/95 z-[999] flex flex-col justify-center items-center p-4">
          <div className="w-full max-w-5xl bg-zinc-950 border border-emerald-500/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh] relative">
            
            {/* Scanline CRT overlay */}
            <div className="absolute inset-0 pointer-events-none z-30 opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%]"></div>
            
            <div className="flex justify-between items-center px-6 py-4 bg-zinc-950 border-b border-white/5 text-white z-20">
              <h3 className="font-bold text-lg flex items-center gap-2 tracking-wide font-mono">
                <Gamepad2 className="w-5 h-5 text-emerald-400 animate-pulse" /> {t('playing', 'PLAYING')}: {tText(activeGameTitle).toUpperCase()}
              </h3>
              <button 
                onClick={() => { setActivePlayUrl(null); setActiveGameTitle(''); }}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors text-white"
                aria-label="Close WebGL simulator"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-grow bg-black relative z-10">
              <iframe
                src={activePlayUrl}
                title="WebGL Simulator"
                className="w-full h-full border-none"
                allow="autoplay; fullscreen; keyboard; gamepad"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {activeVideoUrl && (
        <div className="fixed inset-0 bg-black/95 z-[999] flex flex-col justify-center items-center p-4">
          <div className="w-full max-w-4xl bg-zinc-950 border border-emerald-500/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 bg-zinc-950 border-b border-white/5 text-white">
              <h3 className="font-mono font-bold text-base tracking-wider">{t('cinematic_trailer', 'CINEMATIC TRAILER')}: {tText(activeGameTitle).toUpperCase()}</h3>
              <button 
                onClick={() => { setActiveVideoUrl(null); setActiveGameTitle(''); }}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                aria-label="Close trailer video screen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video bg-black">
              <iframe
                src={activeVideoUrl}
                title="Cinematic Trailer"
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* BLOG SEGMENT */}
      <section className="space-y-6 pt-6 border-t border-apple-grayBorderSoft/40 dark:border-white/[0.06]">
        <h2 className="text-xl sm:text-2xl font-display font-black text-apple-ink dark:text-apple-white flex items-center gap-2">
          {t('game_devlogs_chronicles', 'Game Devlogs & Chronicles')}
        </h2>
        
        {posts.length === 0 ? (
          <p className="text-apple-grayNeutral text-sm">{t('no_game_posts', 'Chưa có bài viết nào về Game Development.')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link key={post._id} to={`/blog/${post.slug}`} className="group glass-panel rounded-2xl p-5 hover:border-emerald-500/30 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-apple-grayNeutral">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-apple-ink dark:text-apple-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                    {tText(post.title)}
                  </h3>
                  <p className="text-apple-grayNeutral text-xs line-clamp-2 leading-relaxed font-light">
                    {tText(post.excerpt)}
                  </p>
                </div>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs mt-4 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                  {t('read_article', 'Read article')} <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default GamePortfolio;
