import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { format } from 'date-fns';
import { useLanguage } from '../context/LanguageContext';

const Blog = () => {
  const { t, tText } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 6;

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      const res = await api.get(`/posts?${params.toString()}`);
      // With page/limit params, API returns { data, total, page, totalPages }
      if (res.data && res.data.data) {
        setPosts(res.data.data);
        setTotalPages(res.data.totalPages || 1);
      } else {
        setPosts(Array.isArray(res.data) ? res.data.filter(p => p.published) : []);
      }
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setLoading(false);
    }
  }, [page, category, search]);

  useEffect(() => {
    const timer = setTimeout(fetchPosts, search ? 400 : 0);
    return () => clearTimeout(timer);
  }, [fetchPosts, search]);

  const handleCategory = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const getLocalizedCategoryLabel = (cat) => {
    switch (cat) {
      case 'general': return '📝 ' + t('lbl_general', 'General');
      case 'mobile': return '📱 ' + t('lbl_mobile', 'Mobile');
      case 'game': return '🎮 ' + t('lbl_game', 'Game');
      default: return cat;
    }
  };

  const categoryConfig = {
    general: { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    mobile:  { color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' },
    game:    { color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  };

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      {/* Header */}
      <div className="space-y-3 border-b border-apple-grayBorderSoft dark:border-white/[0.06] pb-8">
        <h1 className="text-4xl font-display font-semibold tracking-tight text-apple-ink dark:text-apple-white">{t('blog_title', 'Writing')}</h1>
        <p className="text-lg text-apple-grayNeutral">{t('blog_subtitle', 'Thoughts on software engineering, design, and life.')}</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-apple-grayNeutral" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder={t('search_articles', 'Search articles...')}
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-apple-grayBorderMid bg-white/60 dark:bg-white/[0.03] backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-sm text-apple-ink dark:text-apple-white placeholder-apple-grayNeutral"
          />
        </div>

        <div className="flex gap-2">
          {[
            { key: '', label: t('lbl_filter_all', 'All') },
            { key: 'general', label: '📝 ' + t('lbl_general', 'General') },
            { key: 'mobile', label: '📱 ' + t('lbl_mobile', 'Mobile') },
            { key: 'game', label: '🎮 ' + t('lbl_game', 'Game') },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => handleCategory(f.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                category === f.key
                  ? 'bg-apple-ink dark:bg-apple-white text-white dark:text-apple-ink shadow-md'
                  : 'bg-white/60 dark:bg-white/[0.03] border border-apple-grayBorderSoft dark:border-white/5 text-apple-grayNeutral hover:text-apple-ink dark:hover:text-apple-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-3">
              <div className="h-3 bg-apple-grayPale dark:bg-white/5 rounded w-1/4" />
              <div className="h-6 bg-apple-grayPale dark:bg-white/5 rounded w-3/4" />
              <div className="h-4 bg-apple-grayPale dark:bg-white/5 rounded w-full" />
              <div className="h-4 bg-apple-grayPale dark:bg-white/5 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-apple-grayNeutral text-lg">{t('no_articles_found', 'No articles found.')}</p>
          {(search || category) && (
            <button onClick={() => { setSearch(''); setCategory(''); setPage(1); }} className="mt-4 text-apple-blueAction font-medium hover:underline">
              {t('btn_clear_filters', 'Clear filters')}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-0 divide-y divide-apple-grayBorderSoft dark:divide-white/[0.05]">
          {posts.map((post) => {
            const catCfg = categoryConfig[post.category];
            return (
              <article key={post._id} className="group py-8 first:pt-0">
                <Link to={`/blog/${post.slug}`} className="block space-y-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <time className="text-sm text-apple-grayNeutral">
                      {format(new Date(post.createdAt), 'MMMM d, yyyy')}
                    </time>
                    {catCfg && (
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${catCfg.color}`}>
                        {getLocalizedCategoryLabel(post.category)}
                      </span>
                    )}
                    {post.tags?.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-apple-grayPale dark:bg-white/[0.03] text-apple-grayNeutral font-medium border border-apple-grayBorderSoft dark:border-white/5">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {post.coverImage && (
                    <div className="aspect-video rounded-xl overflow-hidden bg-apple-grayPale dark:bg-white/[0.02]">
                      <img
                        src={post.coverImage}
                        alt={tText(post.title)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <h2 className="text-2xl font-semibold tracking-tight text-apple-ink dark:text-apple-white group-hover:text-apple-blueAction transition-colors">
                    {tText(post.title)}
                  </h2>
                  <p className="text-apple-grayNeutral leading-relaxed line-clamp-3">
                    {tText(post.excerpt)}
                  </p>
                  <div className="text-apple-blueAction text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
                    {t('read_more', 'Read more')} →
                  </div>
                </Link>
              </article>
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
            className="px-4 py-2 rounded-xl border border-apple-grayBorderMid text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-apple-blueAction/40 transition-colors"
          >
            ← {t('lbl_prev', 'Prev')}
          </button>
          <span className="text-sm text-apple-grayNeutral">
            {t('lbl_page', 'Page')} <span className="font-semibold text-apple-ink dark:text-apple-white">{page}</span> / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl border border-apple-grayBorderMid text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-apple-blueAction/40 transition-colors"
          >
            {t('lbl_next', 'Next')} →
          </button>
        </div>
      )}
    </div>
  );
};

export default Blog;
