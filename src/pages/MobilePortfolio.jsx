import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Smartphone, Download, ExternalLink, Cpu, Calendar, ChevronLeft, ChevronRight, Share2, Layers } from 'lucide-react';
import api from '../api';
import { format } from 'date-fns';
import { useLanguage } from '../context/LanguageContext';

const MobilePortfolio = () => {
  const { t, tText } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeScreenshotIndices, setActiveScreenshotIndices] = useState({});

  useEffect(() => {
    const fetchMobileData = async () => {
      try {
        const [profileRes, projectsRes, postsRes] = await Promise.all([
          api.get('/profile/mobile'),
          api.get('/projects?type=mobile'),
          api.get('/posts?category=mobile')
        ]);
        if (profileRes.data) setProfile(profileRes.data);
        // API without page/limit returns array directly
        if (projectsRes.data) setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : projectsRes.data.data || []);
        if (postsRes.data) setPosts(Array.isArray(postsRes.data) ? postsRes.data.filter(p => p.published) : postsRes.data.data || []);
      } catch (error) {
        console.error('Failed to fetch mobile portfolio data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMobileData();
  }, []);

  const nextScreenshot = (projectId, max) => {
    setActiveScreenshotIndices(prev => ({
      ...prev,
      [projectId]: ((prev[projectId] || 0) + 1) % max
    }));
  };

  const prevScreenshot = (projectId, max) => {
    setActiveScreenshotIndices(prev => ({
      ...prev,
      [projectId]: ((prev[projectId] || 0) - 1 + max) % max
    }));
  };

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

  const displayProfile = profile || {
    headline: {},
    subHeadline: {},
    techStack: [],
    socialLinks: {}
  };

  return (
    <div className="space-y-16 py-4 animate-fade-in text-apple-ink dark:text-apple-white relative">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 -z-10 retro-grid-purple pointer-events-none opacity-40 dark:opacity-60 rounded-3xl"></div>

      {/* MOBILE PORTFOLIO HERO BANNER */}
      <header className="relative overflow-hidden rounded-3xl p-8 sm:p-12 text-apple-ink dark:text-apple-white glass-panel border-purple-500/10 shadow-lg flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Floating background glowing ball inside header */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-2xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20 text-xs font-semibold uppercase tracking-wider">
            <Smartphone className="w-3.5 h-3.5" /> {t('mobile_branch_profile', 'Mobile Branch Profile')}
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight leading-tight">
            {tText(displayProfile.headline)}
          </h1>
          <p className="text-apple-grayNeutral dark:text-gray-300 text-sm sm:text-lg font-light leading-relaxed">
            {tText(displayProfile.subHeadline)}
          </p>
          
          {/* Social Links */}
          {displayProfile.socialLinks && (
            <div className="flex flex-wrap gap-3 pt-2">
              {displayProfile.socialLinks.github && (
                <a href={displayProfile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/20 transition-colors text-xs font-semibold">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg> GitHub
                </a>
              )}
              {displayProfile.socialLinks.playStore && (
                <a href={displayProfile.socialLinks.playStore} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors text-xs font-semibold shadow-sm">
                  {t('google_play_profile', 'Google Play Profile')}
                </a>
              )}
              {displayProfile.socialLinks.appStore && (
                <a href={displayProfile.socialLinks.appStore} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-colors text-xs font-semibold shadow-sm">
                  {t('app_store_profile', 'App Store Profile')}
                </a>
              )}
            </div>
          )}
        </div>

        {/* Dynamic Mobile Icon floating badge */}
        <div className="shrink-0 relative hidden md:block">
          <div className="absolute inset-0 rounded-3xl bg-purple-600/10 blur-xl"></div>
          <div className="relative p-6 bg-white/40 dark:bg-white/[0.02] border border-white/60 dark:border-white/10 rounded-3xl shadow-lg">
            <Smartphone className="w-16 h-16 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </header>

      {/* SPECIALIZED SKILLSET */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-display font-black border-b border-apple-grayBorderSoft/40 dark:border-white/[0.06] pb-3 text-apple-ink dark:text-apple-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400" /> {t('mobile_tech_specs', 'Mobile Tech Specs')}
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {displayProfile.techStack && displayProfile.techStack.map(tech => (
            <span key={tech} className="px-4 py-2 bg-white/60 dark:bg-white/[0.02] border border-white/80 dark:border-white/5 shadow-sm rounded-2xl text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 hover:border-purple-500/30 transition-colors">
              <Cpu className="w-3.5 h-3.5 opacity-75" />
              {t(tech, tech)}
            </span>
          ))}
        </div>
      </section>

      {/* MOBILE PROJECTS SECTION */}
      <section className="space-y-12">
        <h2 className="text-xl sm:text-2xl font-display font-black border-b border-apple-grayBorderSoft/40 dark:border-white/[0.06] pb-3 text-apple-ink dark:text-apple-white">
          {t('mobile_projects', 'Mobile Projects')} ({projects.length})
        </h2>
        
        {projects.length === 0 ? (
          <p className="text-apple-grayNeutral">{t('no_mobile_projects', 'Chưa có dự án Mobile nào được tải lên.')}</p>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            {projects.map((project) => {
              const screenshots = project.screenshots || [];
              const activeIndex = activeScreenshotIndices[project._id] || 0;
              const hasScreenshots = screenshots.length > 0;
              
              const playStoreUrl = project.downloadUrls?.playStore || '';
              const appStoreUrl = project.downloadUrls?.appStore || '';
              const apkUrl = project.downloadUrls?.apk || project.apkUrl || '';
              const demoUrl = project.demoUrl || '';

              return (
                <div key={project._id} className="glass-panel overflow-hidden border-purple-500/10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-8 rounded-3xl hover:border-purple-500/20 transition-all duration-300">
                  
                  {/* Smartphone Device Mockup Slider (iPhone style) */}
                  <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4">
                    {hasScreenshots ? (
                      <div className="relative w-64 h-[470px] bg-zinc-950 rounded-[45px] border-[10px] border-zinc-900 shadow-2xl overflow-hidden flex items-center justify-center group/phone ring-4 ring-white/10">
                        
                        {/* Dynamic Island Notch */}
                        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4.5 bg-black rounded-full z-20 flex items-center justify-between px-2.5 text-[8px] text-white/30">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#111] shadow-inner"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-[#111] shadow-inner"></div>
                        </div>

                        {/* Top Battery/Signal Icons (Simulated) */}
                        <div className="absolute top-1 w-full px-6 flex justify-between text-[8px] font-bold text-white/60 z-20 font-sans pointer-events-none">
                          <span>9:41</span>
                          <div className="flex items-center gap-1">
                            <span>LTE</span>
                            <div className="w-3.5 h-2 border border-white/60 rounded-[3px] p-[1px] flex items-center"><div className="w-2 h-full bg-white/80 rounded-[1px]"></div></div>
                          </div>
                        </div>

                        {/* Main Screen Screenshot Image */}
                        <img 
                          src={screenshots[activeIndex]} 
                          alt={`${tText(project.title)} Slide ${activeIndex + 1}`} 
                          className="w-full h-full object-cover rounded-[35px]"
                        />
                        
                        {/* Interactive Left/Right Buttons */}
                        {screenshots.length > 1 && (
                          <>
                            <button 
                              onClick={() => prevScreenshot(project._id, screenshots.length)}
                              className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors opacity-0 group-hover/phone:opacity-100 z-20"
                              aria-label="Previous screenshot"
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => nextScreenshot(project._id, screenshots.length)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors opacity-0 group-hover/phone:opacity-100 z-20"
                              aria-label="Next screenshot"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                            {/* Slide Dots Indicator */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/55 px-3 py-1.5 rounded-full z-20">
                              {screenshots.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setActiveScreenshotIndices(prev => ({ ...prev, [project._id]: idx }))}
                                  className={`w-1.5 h-1.5 rounded-full transition-all ${idx === activeIndex ? 'bg-purple-400 w-3' : 'bg-white/40'}`}
                                />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="w-full aspect-video rounded-2xl bg-white/40 dark:bg-white/[0.02] border border-white/50 dark:border-white/5 flex items-center justify-center overflow-hidden">
                        {project.imageUrl ? (
                          <img src={project.imageUrl} alt={tText(project.title)} className="w-full h-full object-cover" />
                        ) : (
                          <Smartphone className="w-16 h-16 text-purple-600/40" />
                        )}
                      </div>
                    )}
                    {hasScreenshots && (
                      <span className="text-[11px] text-apple-grayNeutral font-medium">
                        {t('slide_indicator', 'Slide')} {activeIndex + 1} / {screenshots.length} {t('hover_phone_hint', '(Rê chuột vào màn hình điện thoại)')}
                      </span>
                    )}
                  </div>

                  {/* Project Specs & Description */}
                  <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      
                      {/* Platforms badging */}
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                          {t('cross_platform_app', 'Cross-Platform App')}
                        </span>
                        {project.platforms?.map(p => (
                          <span key={p} className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/60 dark:bg-white/[0.02] border border-white/80 dark:border-white/5 text-apple-grayNeutral">
                            {p}
                          </span>
                        ))}
                      </div>

                      <h3 className="text-2xl sm:text-3xl font-display font-black text-apple-ink dark:text-apple-white">
                        {tText(project.title)}
                      </h3>

                      <p className="text-apple-grayNeutral dark:text-gray-300 leading-relaxed text-sm sm:text-base font-light">
                        {tText(project.description)}
                      </p>

                      <div className="space-y-2 pt-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-apple-grayNeutral">{t('tech_stack_built_with', 'Tech Stack Built-with')}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies?.map(tech => (
                            <span key={tech} className="text-xs px-2.5 py-1 bg-white/40 dark:bg-[#09090b]/40 border border-white/60 dark:border-white/5 rounded-lg font-medium text-apple-grayNeutral dark:text-gray-300">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Premium action store badges */}
                    <div className="flex flex-wrap gap-3 pt-4 border-t border-apple-grayBorderSoft/40 dark:border-white/[0.06]">
                      {demoUrl && (
                        <a 
                          href={demoUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm hover:scale-105"
                        >
                          <ExternalLink className="w-4 h-4" /> {t('appetize_demo', 'Appetize Demo')}
                        </a>
                      )}
                      
                      {playStoreUrl && (
                        <a 
                          href={playStoreUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-purple-500/20 text-purple-700 dark:text-purple-400 hover:bg-purple-500/10 text-xs font-bold transition-all hover:scale-105"
                        >
                          {t('google_play', 'Google Play')}
                        </a>
                      )}
                      
                      {appStoreUrl && (
                        <a 
                          href={appStoreUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 text-xs font-bold transition-all hover:scale-105"
                        >
                          {t('app_store', 'App Store')}
                        </a>
                      )}

                      {apkUrl && (
                        <a 
                          href={apkUrl} 
                          download
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-apple-ink dark:bg-white text-white dark:text-apple-ink hover:scale-105 transition-all shadow-md text-xs font-bold"
                        >
                          <Download className="w-4 h-4" /> {t('download_apk', 'Download APK')}
                        </a>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* BLOG SEGMENT */}
      <section className="space-y-6 pt-6 border-t border-apple-grayBorderSoft/40 dark:border-white/[0.06]">
        <h2 className="text-xl sm:text-2xl font-display font-black text-apple-ink dark:text-apple-white flex items-center gap-2">
          {t('mobile_developer_chronicles', 'Mobile Developer Chronicles')}
        </h2>
        
        {posts.length === 0 ? (
          <p className="text-apple-grayNeutral text-sm">{t('no_mobile_posts', 'Chưa có bài viết nào về Mobile Development.')}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <Link key={post._id} to={`/blog/${post.slug}`} className="group glass-panel rounded-2xl p-5 hover:border-purple-500/30 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-apple-grayNeutral">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{format(new Date(post.createdAt), 'MMMM d, yyyy')}</span>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg text-apple-ink dark:text-apple-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {tText(post.title)}
                  </h3>
                  <p className="text-apple-grayNeutral text-xs line-clamp-2 leading-relaxed font-light">
                    {tText(post.excerpt)}
                  </p>
                </div>
                <span className="text-purple-600 dark:text-purple-400 font-bold text-xs mt-4 flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
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

export default MobilePortfolio;
