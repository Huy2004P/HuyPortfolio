import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, Clock, Share2, ArrowLeft, Heart, Award, Users, ChevronLeft, ChevronRight, X, Sparkles, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import 'react-quill/dist/quill.snow.css'; // Essential for rich content text sizes & alignment

const CustomStaticPage = () => {
  const { key } = useParams();
  const navigate = useNavigate();
  const { tText, loading: langLoading, t, lang } = useLanguage();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  
  // Countdown state for graduation template
  const [timeLeft, setTimeLeft] = useState(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/pages/${key}`);
        setPage(res.data);
      } catch (err) {
        console.error('Failed to fetch custom page', err);
        if (err.response && err.response.status === 404) {
          setError(t('page_not_found', 'Page not found'));
        } else if (err.response && err.response.status === 403) {
          setError(t('page_draft_error', 'This page is currently a draft and is not publicly accessible.'));
        } else {
          setError(t('page_load_error', 'Failed to load page content.'));
        }
      } finally {
        setLoading(false);
      }
    };

    if (key) {
      fetchPage();
    }
  }, [key, t]);

  // Countdown timer logic
  useEffect(() => {
    if (!page || page.metadata?.template !== 'graduation' || !page.metadata?.graduationDate) return;

    const gradDate = new Date(page.metadata.graduationDate);
    if (isNaN(gradDate.getTime())) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const target = gradDate.getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft(null);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [page]);

  // Gallery keyboard navigation listener
  useEffect(() => {
    const gallery = page?.metadata?.gallery || [];
    if (activePhotoIdx === null || gallery.length === 0) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActivePhotoIdx(null);
      else if (e.key === 'ArrowLeft') {
        setActivePhotoIdx(prev => (prev > 0 ? prev - 1 : gallery.length - 1));
      } else if (e.key === 'ArrowRight') {
        setActivePhotoIdx(prev => (prev < gallery.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIdx, page]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading || langLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-purple-500/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-purple-600 animate-spin"></div>
        </div>
        <p className="text-sm text-apple-grayNeutral font-semibold tracking-wide animate-pulse">
          {t('lbl_loading', 'Loading Page...')}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-24 text-center space-y-8 animate-fade-in">
        <div className="inline-flex p-5 rounded-3xl bg-red-500/10 text-red-500 dark:text-red-400 shadow-inner">
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-display font-bold text-apple-ink dark:text-apple-white">{error}</h1>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm font-semibold transition-all shadow-lg hover:shadow-purple-500/20 hover:scale-[1.02]"
        >
          {t('btn_go_home', 'Go back home')}
        </button>
      </div>
    );
  }

  if (!page) return null;

  const title = tText(page.title);
  const content = tText(page.content) || '';
  const coverImage = page.metadata?.coverImage || '';
  const template = page.metadata?.template || 'default';
  const updatedAt = page.updatedAt ? new Date(page.updatedAt) : new Date();

  // Simple reading time estimator (e.g. 200 words per minute)
  const plainText = content.replace(/<[^>]+>/g, '');
  const wordCount = plainText.trim().split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Render standard template
  const renderDefaultTemplate = () => (
    <div className="relative overflow-hidden rounded-3xl border border-apple-grayBorderSoft dark:border-white/[0.06] bg-white/40 dark:bg-black/10 backdrop-blur-xl shadow-2xl p-6 sm:p-12 space-y-8">
      {/* Colorful gradient mesh background blur inside card */}
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-purple-500/10 blur-[60px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-blue-500/10 blur-[60px] pointer-events-none"></div>

      <header className="space-y-6 relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:bg-purple-400/10 dark:text-purple-400 border border-purple-500/20">
          <span>✨</span>
          <span>{t('dynamic_page_label', 'Personal Page')}</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight bg-gradient-to-r from-apple-ink via-purple-950 to-apple-ink dark:from-white dark:via-purple-100 dark:to-apple-white bg-clip-text text-transparent leading-tight sm:leading-none">
          {title}
        </h1>

        {/* Meta Information Bar */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5 text-xs text-apple-grayNeutral font-medium border-y border-apple-grayBorderSoft/40 dark:border-white/[0.05] py-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 opacity-70" />
            <span>{format(updatedAt, 'MMMM d, yyyy')}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 opacity-70" />
            <span>{readingTime} {t('lbl_read_time', 'min read')}</span>
          </span>

          {/* Share Button */}
          <button 
            onClick={handleShare}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-apple-grayPale dark:bg-white/5 hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 transition-all border border-transparent hover:border-purple-500/20"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? t('copied', 'Copied!') : t('share', 'Share')}</span>
          </button>
        </div>
      </header>

      {/* Banner Cover Image */}
      {coverImage && (
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-apple-grayBorderSoft dark:border-white/5 hover:scale-[1.005] transition-transform duration-500 z-10">
          <img src={coverImage} alt={title} className="w-full h-auto max-h-[420px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>
      )}

      {/* Dynamic Rich Text Render Container */}
      <div className="relative z-10">
        <div className="ql-snow">
          <div 
            className="ql-editor prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-img:rounded-2xl prose-img:shadow-lg prose-blockquote:border-purple-500/40"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  );  // Render special graduation template
  const renderGraduationTemplate = () => {
    const gradDateStr = page.metadata?.graduationDate;
    const gradDate = gradDateStr ? new Date(gradDateStr) : null;
    const isFuture = gradDate && gradDate > new Date();
    const isVi = lang === 'vi';

    const getEnhancedImageUrl = (url) => {
      if (!url) return '';
      if (url.includes('res.cloudinary.com')) {
        // Cloudinary AI-based automatic quality, format, and enhance transformations
        return url.replace('/image/upload/', '/image/upload/e_improve,q_auto,f_auto/');
      }
      return url;
    };

    const getTranslation = (key) => {
      const translations = {
        graduated: {
          vi: 'Đã Tốt Nghiệp',
          en: 'Graduated',
          ja: '卒業しました',
          ko: '졸업함',
          zh: '已毕业'
        },
        graduatingSoon: {
          vi: 'Sắp Tốt Nghiệp',
          en: 'Graduating Soon',
          ja: 'もうすぐ卒業',
          ko: '곧 졸업',
          zh: '即将毕业'
        },
        degreeAchieved: {
          vi: '🎉 Hoàn thành chương trình Đại học!',
          en: "🎉 Bachelor's Degree Achieved!",
          ja: '🎉 学士課程修了！',
          ko: '🎉 학사 학위 취득!',
          zh: '🎉 大学毕业！'
        },
        gratitudeTitle: {
          vi: '💖 Lời Tri Ân Sâu Sắc',
          en: '💖 My Gratitude',
          ja: '💖 感謝の言葉',
          ko: '💖 깊은 감사',
          zh: '💖 深切的谢意'
        },
        family: {
          vi: '👨‍👩‍👧‍👦 Gia Đình',
          en: '👨‍👩‍👧‍👦 Family',
          ja: '👨‍👩‍👧‍👦 家族',
          ko: '👨‍👩‍👧‍👦 가족',
          zh: '👨‍👩‍👧‍👦 家人'
        },
        teachers: {
          vi: '👨‍🏫 Thầy Cô & Mái Trường',
          en: '👨‍🏫 Teachers & School',
          ja: '👨‍🏫 先生と学校',
          ko: '👨‍🏫 선생님과 학교',
          zh: '👨‍🏫 老师与学校'
        },
        friends: {
          vi: '🤝 Bạn Bè & Bạn Học',
          en: '🤝 Friends & Classmates',
          ja: '🤝 友達と同級生',
          ko: '🤝 친구와 동창',
          zh: '🤝 朋友与同学'
        },
        galleryTitle: {
          vi: '📸 Album Ảnh Kỷ Niệm',
          en: '📸 Memory Gallery',
          ja: '📸 思い出のギャラリー',
          ko: '📸 추억 갤러리',
          zh: '📸 回忆相册'
        },
        zoomPhoto: {
          vi: 'Xem ảnh',
          en: 'Zoom photo',
          ja: '写真を表示',
          ko: '사진 보기',
          zh: '查看照片'
        },
        sharePage: {
          vi: 'Chia sẻ',
          en: 'Share Page',
          ja: 'シェア',
          ko: '페이지 공유',
          zh: '分享页面'
        },
        days: { vi: 'Ngày', en: 'Days', ja: '日', ko: '일', zh: '天' },
        hours: { vi: 'Giờ', en: 'Hours', ja: '時間', ko: '시간', zh: '小时' },
        mins: { vi: 'Phút', en: 'Mins', ja: '分', ko: '분', zh: '分钟' },
        secs: { vi: 'Giây', en: 'Secs', ja: '秒', ko: '초', zh: '秒' }
      };
      
      return translations[key]?.[lang] || translations[key]?.en || '';
    };

    const familyThanks = tText({
      vi: page.metadata?.familyThanks_vi,
      en: page.metadata?.familyThanks_en,
      ja: page.metadata?.familyThanks_ja,
      ko: page.metadata?.familyThanks_ko,
      zh: page.metadata?.familyThanks_zh
    });
    const teacherThanks = tText({
      vi: page.metadata?.teacherThanks_vi,
      en: page.metadata?.teacherThanks_en,
      ja: page.metadata?.teacherThanks_ja,
      ko: page.metadata?.teacherThanks_ko,
      zh: page.metadata?.teacherThanks_zh
    });
    const friendThanks = tText({
      vi: page.metadata?.friendThanks_vi,
      en: page.metadata?.friendThanks_en,
      ja: page.metadata?.friendThanks_ja,
      ko: page.metadata?.friendThanks_ko,
      zh: page.metadata?.friendThanks_zh
    });
    const gallery = page.metadata?.gallery || [];

    return (
      <div className="relative w-full animate-gradient-flow py-12 sm:py-20 px-6 sm:px-12 md:px-16 lg:px-24 space-y-20 overflow-hidden">
        
        {/* Floating graduation caps animation style */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;600;700;800;900&display=swap');
          
          .font-grad-serif {
            font-family: 'Lora', serif;
          }
          .font-grad-sans {
            font-family: 'Outfit', sans-serif;
          }



          @keyframes gradientBG {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          
          .animate-gradient-flow {
            background: linear-gradient(-45deg, rgba(59, 130, 246, 0.09), rgba(139, 92, 246, 0.09), rgba(99, 102, 241, 0.07), rgba(6, 182, 212, 0.06));
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
          }
          
          .dark .animate-gradient-flow {
            background: linear-gradient(-45deg, rgba(30, 58, 138, 0.4), rgba(76, 29, 149, 0.4), rgba(17, 24, 39, 0.98), rgba(15, 23, 42, 0.98));
            background-size: 400% 400%;
            animation: gradientBG 15s ease infinite;
          }

          @keyframes fallDown {
            0% {
              transform: translateY(-10vh) rotate(0deg) scale(0.6);
              opacity: 0;
            }
            10% { opacity: 0.45; }
            90% { opacity: 0.45; }
            100% {
              transform: translateY(115vh) rotate(360deg) scale(1.2);
              opacity: 0;
            }
          }
          .animate-fall-slow { animation: fallDown 16s infinite linear; filter: blur(2px); }
          .animate-fall-medium { animation: fallDown 12s infinite linear; filter: blur(1px); }
          .animate-fall-fast { animation: fallDown 9s infinite linear; filter: blur(0.5px); }

          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
          }
          .animate-heartbeat {
            animation: heartbeat 2.5s infinite ease-in-out;
          }

          @keyframes pulse-gold {
            0%, 100% {
              border-color: rgba(234, 179, 8, 0.3);
              box-shadow: 0 0 15px rgba(234, 179, 8, 0.05);
            }
            50% {
              border-color: rgba(234, 179, 8, 0.7);
              box-shadow: 0 0 30px rgba(234, 179, 8, 0.2);
            }
          }
          .animate-pulse-gold {
            animation: pulse-gold 4s infinite ease-in-out;
          }

          @keyframes scaleUp {
            from { transform: scale(0.96); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-scale-up {
            animation: scaleUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
        `}</style>

        {/* Falling blurred cap and sparkle elements in background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <span className="absolute text-4xl animate-fall-slow" style={{ left: '6%', animationDelay: '0s', top: '-60px' }}>🎓</span>
          <span className="absolute text-5xl animate-fall-medium" style={{ left: '24%', animationDelay: '4s', top: '-60px' }}>🎓</span>
          <span className="absolute text-3xl animate-fall-fast" style={{ left: '56%', animationDelay: '1.5s', top: '-60px' }}>🎓</span>
          <span className="absolute text-4xl animate-fall-slow" style={{ left: '74%', animationDelay: '7s', top: '-60px' }}>🎓</span>
          <span className="absolute text-5xl animate-fall-medium" style={{ left: '92%', animationDelay: '2.5s', top: '-60px' }}>🎓</span>
          <span className="absolute text-3xl animate-fall-fast" style={{ left: '38%', animationDelay: '5s', top: '-60px' }}>✨</span>
          <span className="absolute text-4xl animate-fall-slow" style={{ left: '64%', animationDelay: '2s', top: '-60px' }}>✨</span>
          <span className="absolute text-3xl animate-fall-medium" style={{ left: '15%', animationDelay: '9s', top: '-60px' }}>✨</span>
          <span className="absolute text-4xl animate-fall-fast" style={{ left: '82%', animationDelay: '11s', top: '-60px' }}>🎓</span>
        </div>

        {/* Aurora Blurred Gradient Mesh - Animated for high-end floating blurred look */}
        <div className="absolute top-10 left-10 w-[550px] h-[550px] rounded-full bg-purple-600/15 dark:bg-purple-600/10 blur-[130px] pointer-events-none animate-float-blob z-0"></div>
        <div className="absolute bottom-20 right-10 w-[600px] h-[600px] rounded-full bg-blue-600/20 dark:bg-blue-600/10 blur-[140px] pointer-events-none animate-float-blob-reverse z-0"></div>
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full bg-cyan-500/15 dark:bg-cyan-500/8 blur-[110px] pointer-events-none animate-float-blob z-0" style={{ animationDelay: '5s' }}></div>

        {/* Hero Section */}
        <header className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/20 font-grad-sans">
            <span>🎓</span>
            <span>{isFuture ? getTranslation('graduatingSoon') : getTranslation('graduated')}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-grad-serif font-black leading-tight tracking-tight text-purple-950 dark:text-white pb-2">
            {title}
          </h1>

          {/* Share Button & Date */}
          <div className="flex justify-center items-center gap-4">
            {gradDate && (
              <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 font-grad-sans">
                📅 {format(gradDate, 'MMMM d, yyyy')}
              </span>
            )}
            <button 
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 hover:bg-purple-600 hover:text-white transition-all text-xs font-bold font-grad-sans"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? t('copied', 'Copied!') : getTranslation('sharePage')}</span>
            </button>
          </div>

          {/* Countdown Clock or Celebration Widget */}
          {gradDate && (
            <div className="w-full pt-4">
              {isFuture && timeLeft ? (
                <div className="max-w-xl mx-auto grid grid-cols-4 gap-4 p-5 rounded-2xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-md font-grad-sans">
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">{timeLeft.days}</div>
                    <div className="text-[10px] uppercase font-bold text-apple-grayNeutral">{getTranslation('days')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">{timeLeft.hours}</div>
                    <div className="text-[10px] uppercase font-bold text-apple-grayNeutral">{getTranslation('hours')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">{timeLeft.minutes}</div>
                    <div className="text-[10px] uppercase font-bold text-apple-grayNeutral">{getTranslation('mins')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 animate-pulse">{timeLeft.seconds}</div>
                    <div className="text-[10px] uppercase font-bold text-apple-grayNeutral">{getTranslation('secs')}</div>
                  </div>
                </div>
              ) : (
                <div className="relative max-w-xl mx-auto p-8 rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/[0.04] via-purple-500/[0.02] to-transparent dark:from-yellow-500/[0.02] dark:via-black/20 dark:to-transparent backdrop-blur-xl animate-pulse-gold overflow-hidden">
                  {/* Decorative corners */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-yellow-500/40"></div>
                  <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-yellow-500/40"></div>
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-yellow-500/40"></div>
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-yellow-500/40"></div>
                  
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 text-white shadow-xl shadow-yellow-500/10">
                      <Trophy className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-[10px] uppercase tracking-widest font-grad-sans font-bold text-yellow-600 dark:text-yellow-500/80">
                        {lang === 'vi' ? 'Chứng nhận Học vị' : 'Degree Certification'}
                      </h3>
                      <p className="text-xl sm:text-2xl font-grad-serif font-bold text-purple-950 dark:text-purple-100 leading-tight">
                        {getTranslation('degreeAchieved')}
                      </p>
                    </div>
                    {/* Gold Ribbon details */}
                    <div className="flex items-center gap-2 text-[10px] font-semibold text-apple-grayNeutral uppercase tracking-widest">
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                      <span>{isVi ? 'Hành trình rực rỡ' : 'A glorious journey'}</span>
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Large Cover Image Banner */}
        {coverImage && (
          <div className="max-w-6xl mx-auto w-full relative rounded-3xl overflow-hidden shadow-2xl border border-purple-500/10 dark:border-white/5 hover:scale-[1.002] transition-transform duration-500 z-10">
            <img src={getEnhancedImageUrl(coverImage)} alt={title} className="w-full h-[320px] sm:h-[460px] object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
          </div>
        )}

        {/* Gratitude Cards Section */}
        {(familyThanks || teacherThanks || friendThanks) && (
          <section className="max-w-6xl mx-auto w-full space-y-8 relative z-10">
            <h2 className="text-3xl font-grad-serif font-black text-purple-950 dark:text-purple-200 text-center tracking-tight">
              {getTranslation('gratitudeTitle')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Family */}
              {familyThanks && (
                <div className="rounded-3xl border border-red-500/10 bg-red-500/[0.02] dark:bg-red-500/[0.005] p-8 shadow-xl relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-500 backdrop-blur-md">
                  {/* Watermark Quote */}
                  <span className="absolute -top-6 -left-2 text-[120px] font-serif text-red-500/[0.03] select-none pointer-events-none">“</span>
                  <div className="absolute top-6 right-6 text-red-500/20 text-4xl group-hover:scale-110 transition-all duration-500 animate-heartbeat"><Heart className="fill-red-500/10" /></div>
                  <h3 className="text-lg font-grad-serif font-extrabold text-red-600 dark:text-red-400 mb-4 flex items-center gap-2">
                    {getTranslation('family')}
                  </h3>
                  <p className="text-sm leading-relaxed text-apple-ink/85 dark:text-apple-white/80 whitespace-pre-line font-medium relative z-10">
                    {familyThanks}
                  </p>
                </div>
              )}

              {/* Teachers */}
              {teacherThanks && (
                <div className="rounded-3xl border border-blue-500/10 bg-blue-500/[0.02] dark:bg-blue-500/[0.005] p-8 shadow-xl relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-500 backdrop-blur-md">
                  {/* Watermark Quote */}
                  <span className="absolute -top-6 -left-2 text-[120px] font-serif text-blue-500/[0.03] select-none pointer-events-none">“</span>
                  <div className="absolute top-6 right-6 text-blue-500/20 text-4xl group-hover:scale-110 transition-all duration-500"><Award className="w-8 h-8" /></div>
                  <h3 className="text-lg font-grad-serif font-extrabold text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
                    {getTranslation('teachers')}
                  </h3>
                  <p className="text-sm leading-relaxed text-apple-ink/85 dark:text-apple-white/80 whitespace-pre-line font-medium relative z-10">
                    {teacherThanks}
                  </p>
                </div>
              )}

              {/* Friends */}
              {friendThanks && (
                <div className="rounded-3xl border border-emerald-500/10 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.005] p-8 shadow-xl relative overflow-hidden group hover:-translate-y-1.5 transition-all duration-500 backdrop-blur-md">
                  {/* Watermark Quote */}
                  <span className="absolute -top-6 -left-2 text-[120px] font-serif text-emerald-500/[0.03] select-none pointer-events-none">“</span>
                  <div className="absolute top-6 right-6 text-emerald-500/20 text-4xl group-hover:scale-110 transition-all duration-500"><Users className="w-8 h-8" /></div>
                  <h3 className="text-lg font-grad-serif font-extrabold text-emerald-600 dark:text-emerald-400 mb-4 flex items-center gap-2">
                    {getTranslation('friends')}
                  </h3>
                  <p className="text-sm leading-relaxed text-apple-ink/85 dark:text-apple-white/80 whitespace-pre-line font-medium relative z-10">
                    {friendThanks}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Main Story Content (Quill Content) */}
        {content && (
          <section className="max-w-6xl mx-auto w-full relative z-10 border-t border-purple-500/10 dark:border-white/[0.05] pt-10">
            <div className="ql-snow">
              <div 
                className="ql-editor prose prose-lg dark:prose-invert max-w-none prose-headings:font-display prose-headings:font-black prose-headings:tracking-tight prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-img:rounded-2xl prose-img:shadow-xl"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </section>
        )}

        {/* Memory Grid Photo Gallery */}
        {gallery.length > 0 && (
          <section className="max-w-7xl mx-auto w-full space-y-8 relative z-10 border-t border-purple-500/10 dark:border-white/[0.05] pt-10">
            <h2 className="text-3xl font-grad-serif font-black text-purple-950 dark:text-purple-200 text-center tracking-tight">
              {getTranslation('galleryTitle')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {gallery.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setActivePhotoIdx(idx)}
                  className="group relative rounded-3xl overflow-hidden shadow-lg border border-purple-500/10 dark:border-white/5 cursor-pointer bg-apple-grayPale dark:bg-white/5 aspect-square"
                >
                  <img 
                    src={img} 
                    alt={`Memory photo ${idx + 1}`} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-xs font-bold tracking-wider px-4 py-2 border border-white/40 rounded-full uppercase bg-black/20 backdrop-blur-sm font-grad-sans transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      {getTranslation('zoomPhoto')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    );
  };

  const isGraduation = template === 'graduation';
  const gallery = page?.metadata?.gallery || [];

  return (
    <>
      <div className={`${isGraduation ? 'w-full max-w-none py-0' : 'max-w-4xl mx-auto py-2 sm:py-6'} animate-fade-in relative`}>
        
        {/* Back button */}
        {!isGraduation && (
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center text-xs font-semibold text-apple-grayNeutral hover:text-apple-ink dark:hover:text-apple-white transition-colors mb-6 group relative z-10"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5 transform group-hover:-translate-x-0.5 transition-transform" /> 
            {t('btn_back', 'Back')}
          </button>
        )}

        {isGraduation ? renderGraduationTemplate() : renderDefaultTemplate()}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {activePhotoIdx !== null && gallery.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-fade-in">
          {/* Close button */}
          <button 
            onClick={() => setActivePhotoIdx(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 z-50 border border-white/10"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Left Arrow */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActivePhotoIdx(prev => (prev > 0 ? prev - 1 : gallery.length - 1));
            }}
            className="absolute left-2 sm:left-6 p-2.5 sm:p-4 rounded-full bg-white/5 hover:bg-white/15 text-white transition-all hover:scale-105 z-50 border border-white/5"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Center Image */}
          <div className="relative max-w-5xl max-h-[85vh] px-4 flex flex-col items-center justify-center select-none" onClick={() => setActivePhotoIdx(null)}>
            <img 
              src={gallery[activePhotoIdx]} 
              alt={`Zoomed memory photo ${activePhotoIdx + 1}`} 
              className="max-w-full max-h-[70vh] sm:max-h-[75vh] rounded-2xl object-contain shadow-2xl border border-white/10 animate-scale-up" 
              onClick={(e) => e.stopPropagation()} 
            />
            {/* Index Counter */}
            <div className="mt-4 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-semibold tracking-wider border border-white/10 font-grad-sans">
              {activePhotoIdx + 1} / {gallery.length}
            </div>
          </div>

          {/* Right Arrow */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActivePhotoIdx(prev => (prev < gallery.length - 1 ? prev + 1 : 0));
            }}
            className="absolute right-2 sm:right-6 p-2.5 sm:p-4 rounded-full bg-white/5 hover:bg-white/15 text-white transition-all hover:scale-105 z-50 border border-white/5"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      )}
    </>
  );
};

export default CustomStaticPage;
