import { useState, useEffect, useCallback } from 'react';
import { Heart, Download, MousePointerClick } from 'lucide-react';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';

const Projects = () => {
  const { t, tText } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 9;

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (typeFilter) params.set('type', typeFilter);
      if (search) params.set('search', search);
      const res = await api.get(`/projects?${params.toString()}`);
      // API always returns { data, total, page, totalPages }
      if (res.data && res.data.data) {
        setProjects(res.data.data);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setProjects(Array.isArray(res.data) ? res.data : []);
      }
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  }, [page, typeFilter, search]);

  useEffect(() => {
    const timer = setTimeout(fetchProjects, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchProjects, search]);

  const handleTypeFilter = (type) => {
    setTypeFilter(type);
    setPage(1);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  // ─── Like project ───────────────────────────────────────────────────────────
  const handleLike = async (projectId) => {
    try {
      const res = await api.post(`/projects/${projectId}/like`);
      setProjects(prev =>
        prev.map(p => p._id === projectId ? { ...p, likesCount: res.data.likesCount } : p)
      );
    } catch (err) {
      console.error('Like failed', err);
    }
  };

  // ─── Click tracking ─────────────────────────────────────────────────────────
  const handleClick = async (projectId, destination, url) => {
    try {
      api.post(`/projects/${projectId}/click`, { destination });
    } catch {}
    // Open link regardless
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const getLocalizedTypeLabel = (type) => {
    switch (type) {
      case 'mobile': return '📱 ' + t('lbl_mobile', 'Mobile');
      case 'game': return '🎮 ' + t('lbl_game', 'Game');
      case 'web': return '🌐 ' + t('lbl_web', 'Web');
      default: return '⚙️ ' + t('lbl_other', 'Other');
    }
  };

  const typeConfig = {
    mobile: { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
    game:   { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
    web:    { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    other:  { color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/40 dark:text-gray-300' },
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-display font-semibold tracking-tight text-apple-ink dark:text-apple-white">{t('nav_projects', 'Projects')}</h1>
        <p className="text-lg text-apple-grayNeutral">{t('projects_subtitle', 'A collection of my recent work and side projects.')}</p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-grayNeutral" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder={t('lbl_search', 'Search projects...')}
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-apple-grayBorderMid bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 text-sm text-apple-ink dark:text-apple-white placeholder-apple-grayNeutral"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { key: '', label: t('lbl_filter_all', 'All') },
            { key: 'mobile', label: '📱 ' + t('lbl_mobile', 'Mobile') },
            { key: 'game', label: '🎮 ' + t('lbl_game', 'Game') },
            { key: 'web', label: '🌐 ' + t('lbl_web', 'Web') },
            { key: 'other', label: '⚙️ ' + t('lbl_other', 'Other') },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => handleTypeFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                typeFilter === f.key
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-white/60 dark:bg-white/[0.03] border border-apple-grayBorderSoft dark:border-white/5 text-apple-grayNeutral hover:text-apple-ink dark:hover:text-apple-white hover:border-purple-500/30'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-white/40 dark:bg-white/[0.02] border border-apple-grayBorderSoft dark:border-white/5 animate-pulse">
              <div className="aspect-video bg-apple-grayPale dark:bg-white/5" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-apple-grayPale dark:bg-white/5 rounded w-3/4" />
                <div className="h-3 bg-apple-grayPale dark:bg-white/5 rounded w-full" />
                <div className="h-3 bg-apple-grayPale dark:bg-white/5 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-apple-grayNeutral text-lg">{t('lbl_no_projects', 'No projects found.')}</p>
          {(search || typeFilter) && (
            <button onClick={() => { setSearch(''); setTypeFilter(''); setPage(1); }} className="mt-4 text-purple-600 dark:text-purple-400 font-medium hover:underline">
              {t('btn_clear_filters', 'Clear filters')}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const typeCfg = typeConfig[project.projectType] || typeConfig.other;
            const apkUrl = project.downloadUrls?.apk || project.apkUrl;
            const playStore = project.downloadUrls?.playStore;
            const githubUrl = project.projectUrl;
            return (
              <div key={project._id} className="group bg-white/60 dark:bg-white/[0.02] backdrop-blur-sm rounded-2xl border border-apple-grayBorderSoft dark:border-white/[0.06] overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-purple-500/20 dark:hover:border-purple-400/20 flex flex-col">
                {project.imageUrl && (
                  <div className="aspect-video overflow-hidden bg-apple-grayPale dark:bg-white/[0.02]">
                    <img
                      src={project.imageUrl}
                      alt={tText(project.title)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5 space-y-3 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${typeCfg.color}`}>
                      {getLocalizedTypeLabel(project.projectType)}
                    </span>
                    {project.platforms?.map(p => (
                      <span key={p} className="text-[10px] px-2 py-0.5 rounded-full bg-apple-grayPale dark:bg-white/5 text-apple-grayNeutral font-medium border border-apple-grayBorderSoft dark:border-white/5">
                        {p}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-lg font-semibold tracking-tight text-apple-ink dark:text-apple-white">{tText(project.title)}</h3>
                  <p className="text-apple-grayNeutral text-sm leading-relaxed line-clamp-3 flex-grow">{tText(project.description)}</p>

                  {project.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.technologies.map(tech => (
                        <span key={tech} className="text-[10px] px-2 py-0.5 bg-apple-grayPale dark:bg-white/[0.03] rounded font-medium text-apple-grayNeutral border border-apple-grayBorderSoft dark:border-white/5">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Like + Stats row */}
                  <div className="flex items-center gap-4 pt-2 text-xs text-apple-grayNeutral">
                    <button
                      onClick={() => handleLike(project._id)}
                      className="flex items-center gap-1 hover:text-red-500 transition-colors group/like"
                    >
                      <Heart className="w-3.5 h-3.5 group-hover/like:fill-red-500 group-hover/like:text-red-500 transition-colors" />
                      <span>{project.likesCount || 0} {t('lbl_likes', 'likes')}</span>
                    </button>
                    {project.clicks && (
                      <span className="flex items-center gap-1">
                        <MousePointerClick className="w-3.5 h-3.5" />
                        {Object.values(project.clicks).reduce((a, b) => a + b, 0)} {t('lbl_clicks', 'clicks')}
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2 pt-3 mt-auto border-t border-apple-grayBorderSoft/50 dark:border-white/[0.04]">
                    {project.demoUrl && (
                      <button onClick={() => handleClick(project._id, 'demo', project.demoUrl)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        {t('btn_demo', 'Demo')}
                      </button>
                    )}
                    {apkUrl && (
                      <button onClick={() => handleClick(project._id, 'apk', apkUrl)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-apple-grayBorderMid dark:border-white/10 text-apple-ink dark:text-apple-white text-xs font-semibold transition-colors hover:border-purple-500/40">
                        <Download className="w-3.5 h-3.5" />
                        {t('btn_apk', 'APK')}
                      </button>
                    )}
                    {playStore && (
                      <button onClick={() => handleClick(project._id, 'playstore', playStore)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-apple-grayBorderMid dark:border-white/10 text-apple-ink dark:text-apple-white text-xs font-semibold transition-colors hover:border-emerald-500/40">
                        {t('btn_play_store', 'Play Store')}
                      </button>
                    )}
                    {githubUrl && (
                      <button onClick={() => handleClick(project._id, 'github', githubUrl)}
                        className="inline-flex items-center gap-1.5 text-purple-600 dark:text-purple-400 text-xs font-semibold hover:underline">
                        {t('btn_github', 'GitHub')} →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl border border-apple-grayBorderMid text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-purple-500/40 transition-colors"
          >
            ← {t('lbl_prev', 'Prev')}
          </button>
          <span className="text-sm text-apple-grayNeutral">
            {t('lbl_page', 'Page')} <span className="font-semibold text-apple-ink dark:text-apple-white">{page}</span> / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border border-apple-grayBorderMid text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-purple-500/40 transition-colors"
          >
            {t('lbl_next', 'Next')} →
          </button>
        </div>
      )}
    </div>
  );
};

export default Projects;
