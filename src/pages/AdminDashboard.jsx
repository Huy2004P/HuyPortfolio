import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLanguage } from '../context/LanguageContext';

const AdminDashboard = () => {
  const { tText } = useLanguage();
  const [activeTab, setActiveTab] = useState('stats');
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  // Profile management states
  const [profileType, setProfileType] = useState('main');
  const [profileForm, setProfileForm] = useState({
    headline_vi: '', headline_en: '', headline_ja: '', headline_ko: '', headline_zh: '',
    subHeadline_vi: '', subHeadline_en: '', subHeadline_ja: '', subHeadline_ko: '', subHeadline_zh: '',
    techStack: '',
    avatarUrl: '',
    github: '', linkedin: '', itchio: '', youtube: '', playStore: '', appStore: ''
  });

  // Project form state (bilingual)
  const [projectForm, setProjectForm] = useState({
    title_vi: '', title_en: '', title_ja: '', title_ko: '', title_zh: '',
    description_vi: '', description_en: '', description_ja: '', description_ko: '', description_zh: '',
    imageUrl: '', screenshots: '',
    projectType: 'web',
    projectUrl: '', demoUrl: '', apkUrl: '',
    engine: '', platforms: '', videoUrl: '', playableUrl: '',
    playStore: '', appStore: '', itchio: '', steam: '',
    technologies: ''
  });

  // Post form state (bilingual)
  const [postForm, setPostForm] = useState({
    title_vi: '', title_en: '', title_ja: '', title_ko: '', title_zh: '',
    slug: '',
    content_vi: '', content_en: '', content_ja: '', content_ko: '', content_zh: '',
    excerpt_vi: '', excerpt_en: '', excerpt_ja: '', excerpt_ko: '', excerpt_zh: '',
    coverImage: '',
    category: 'general',
    tags: '',
    published: false
  });

  // Dashboard stats
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Comments moderation
  const [comments, setComments] = useState([]);
  const [commentFilter, setCommentFilter] = useState('pending');

  // Contact messages
  const [messages, setMessages] = useState([]);

  // Subscribers
  const [subscribers, setSubscribers] = useState([]);

  // Dictionary
  const [dictEntries, setDictEntries] = useState([]);
  const [editingDictKey, setEditingDictKey] = useState(null);
  const [dictForm, setDictForm] = useState({ vi: '', en: '', ja: '', ko: '', zh: '' });

  // Static Pages state
  const [selectedStaticPage, setSelectedStaticPage] = useState('privacy');
  const [pagesForm, setPagesForm] = useState({
    privacy_title_vi: '', privacy_title_en: '', privacy_title_ja: '', privacy_title_ko: '', privacy_title_zh: '',
    privacy_content_vi: '', privacy_content_en: '', privacy_content_ja: '', privacy_content_ko: '', privacy_content_zh: '',
    terms_title_vi: '', terms_title_en: '', terms_title_ja: '', terms_title_ko: '', terms_title_zh: '',
    terms_content_vi: '', terms_content_en: '', terms_content_ja: '', terms_content_ko: '', terms_content_zh: '',
    donation_title_vi: '', donation_title_en: '', donation_title_ja: '', donation_title_ko: '', donation_title_zh: '',
    donation_content_vi: '', donation_content_en: '', donation_content_ja: '', donation_content_ko: '', donation_content_zh: '',
    donation_bank_name_vi: '', donation_bank_name_en: '', donation_bank_name_ja: '', donation_bank_name_ko: '', donation_bank_name_zh: '',
    donation_account_number: '',
    donation_account_name: '',
    donation_branch_vi: '', donation_branch_en: '', donation_branch_ja: '', donation_branch_ko: '', donation_branch_zh: '',
    donation_qr_code_url: '',
    donation_momo_name: '', donation_momo_phone: '',
    donation_zalopay_name: '', donation_zalopay_phone: '',
    donation_buymeacoffee_url: '',
    donation_kofi_url: ''
  });

  const [accountForm, setAccountForm] = useState({ currentPassword: '', newPassword: '' });
  const [editingId, setEditingId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingApk, setUploadingApk] = useState(false);

  // Lang tab for bilingual form inputs
  const [formLang, setFormLang] = useState('vi');

  useEffect(() => {
    fetchData();
  }, [activeTab, profileType, commentFilter]);

  const fetchData = async () => {
    try {
      if (activeTab === 'projects') {
        const res = await api.get('/projects');
        setProjects(Array.isArray(res.data) ? res.data : res.data?.data || []);
      } else if (activeTab === 'posts') {
        const res = await api.get('/posts');
        setPosts(Array.isArray(res.data) ? res.data : res.data?.data || []);
      } else if (activeTab === 'profile') {
        const res = await api.get(`/profile/${profileType}`);
        if (res.data) {
          const d = res.data;
          setProfileForm({
            headline_vi: d.headline?.vi || '',
            headline_en: d.headline?.en || '',
            headline_ja: d.headline?.ja || '',
            headline_ko: d.headline?.ko || '',
            headline_zh: d.headline?.zh || '',
            subHeadline_vi: d.subHeadline?.vi || '',
            subHeadline_en: d.subHeadline?.en || '',
            subHeadline_ja: d.subHeadline?.ja || '',
            subHeadline_ko: d.subHeadline?.ko || '',
            subHeadline_zh: d.subHeadline?.zh || '',
            techStack: d.techStack ? d.techStack.join(', ') : '',
            avatarUrl: d.avatarUrl || '',
            github: d.socialLinks?.github || '',
            linkedin: d.socialLinks?.linkedin || '',
            itchio: d.socialLinks?.itchio || '',
            youtube: d.socialLinks?.youtube || '',
            playStore: d.socialLinks?.playStore || '',
            appStore: d.socialLinks?.appStore || '',
          });
        }
      } else if (activeTab === 'stats') {
        setStatsLoading(true);
        try {
          const res = await api.get('/admin/dashboard-stats');
          setStats(res.data);
        } catch { setStats(null); }
        setStatsLoading(false);
      } else if (activeTab === 'comments') {
        const res = await api.get(`/comments?status=${commentFilter}`);
        setComments(Array.isArray(res.data) ? res.data : []);
      } else if (activeTab === 'contact') {
        const res = await api.get('/contact');
        setMessages(Array.isArray(res.data) ? res.data : []);
      } else if (activeTab === 'subscribers') {
        const res = await api.get('/subscriber');
        setSubscribers(Array.isArray(res.data) ? res.data : []);
      } else if (activeTab === 'dictionary') {
        const res = await api.get('/dictionary');
        setDictEntries(Array.isArray(res.data) ? res.data : []);
      } else if (activeTab === 'pages') {
        const res = await api.get('/dictionary');
        const items = Array.isArray(res.data) ? res.data : [];
        setDictEntries(items);

        const newForm = {
          privacy_title_vi: '', privacy_title_en: '', privacy_title_ja: '', privacy_title_ko: '', privacy_title_zh: '',
          privacy_content_vi: '', privacy_content_en: '', privacy_content_ja: '', privacy_content_ko: '', privacy_content_zh: '',
          terms_title_vi: '', terms_title_en: '', terms_title_ja: '', terms_title_ko: '', terms_title_zh: '',
          terms_content_vi: '', terms_content_en: '', terms_content_ja: '', terms_content_ko: '', terms_content_zh: '',
          donation_title_vi: '', donation_title_en: '', donation_title_ja: '', donation_title_ko: '', donation_title_zh: '',
          donation_content_vi: '', donation_content_en: '', donation_content_ja: '', donation_content_ko: '', donation_content_zh: '',
          donation_bank_name_vi: '', donation_bank_name_en: '', donation_bank_name_ja: '', donation_bank_name_ko: '', donation_bank_name_zh: '',
          donation_account_number: '',
          donation_account_name: '',
          donation_branch_vi: '', donation_branch_en: '', donation_branch_ja: '', donation_branch_ko: '', donation_branch_zh: '',
          donation_qr_code_url: '',
          donation_momo_name: '', donation_momo_phone: '',
          donation_zalopay_name: '', donation_zalopay_phone: '',
          donation_buymeacoffee_url: '',
          donation_kofi_url: ''
        };

        const keys = [
          'privacy_title', 'privacy_content',
          'terms_title', 'terms_content',
          'donation_title', 'donation_content',
          'donation_bank_name', 'donation_account_number', 'donation_account_name',
          'donation_branch', 'donation_qr_code_url',
          'donation_momo_name', 'donation_momo_phone',
          'donation_zalopay_name', 'donation_zalopay_phone',
          'donation_buymeacoffee_url', 'donation_kofi_url'
        ];

        keys.forEach(k => {
          const entry = items.find(item => item.key === k);
          const trans = entry?.translations || {};
          ['vi', 'en', 'ja', 'ko', 'zh'].forEach(l => {
            const val = trans[l] || '';
            if (['donation_account_number', 'donation_account_name', 'donation_qr_code_url', 'donation_momo_phone', 'donation_zalopay_phone', 'donation_buymeacoffee_url', 'donation_kofi_url'].includes(k)) {
              newForm[k] = trans['vi'] || trans['en'] || val;
            } else {
              newForm[`${k}_${l}`] = val;
            }
          });
        });
        setPagesForm(newForm);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    }
  };

  const handlePagesSubmit = async (e) => {
    e.preventDefault();
    let keysToUpdate = [];
    if (selectedStaticPage === 'privacy') {
      keysToUpdate = ['privacy_title', 'privacy_content'];
    } else if (selectedStaticPage === 'terms') {
      keysToUpdate = ['terms_title', 'terms_content'];
    } else if (selectedStaticPage === 'donation') {
      keysToUpdate = [
        'donation_title', 'donation_content',
        'donation_bank_name', 'donation_account_number', 'donation_account_name',
        'donation_branch', 'donation_qr_code_url',
        'donation_momo_name', 'donation_momo_phone',
        'donation_zalopay_name', 'donation_zalopay_phone',
        'donation_buymeacoffee_url', 'donation_kofi_url'
      ];
    }

    try {
      for (const k of keysToUpdate) {
        const translations = {};
        ['vi', 'en', 'ja', 'ko', 'zh'].forEach(l => {
          if (['donation_account_number', 'donation_account_name', 'donation_qr_code_url', 'donation_momo_phone', 'donation_zalopay_phone', 'donation_buymeacoffee_url', 'donation_kofi_url'].includes(k)) {
            translations[l] = pagesForm[k];
          } else {
            translations[l] = pagesForm[`${k}_${l}`];
          }
        });
        await api.put(`/dictionary/${k}`, { key: k, translations });
      }
      alert('Page settings saved and auto-translated successfully!');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to save page settings.');
    }
  };

  const handleImageUpload = async (e, formType) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploadingImage(true);
    try {
      const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (formType === 'project') setProjectForm(prev => ({ ...prev, imageUrl: res.data.imageUrl }));
      else if (formType === 'post') setPostForm(prev => ({ ...prev, coverImage: res.data.imageUrl }));
      else if (formType === 'profile') setProfileForm(prev => ({ ...prev, avatarUrl: res.data.imageUrl }));
    } catch (err) {
      console.error(err);
      alert('Upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleScreenshotUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploadingImage(true);
    try {
      const urls = [];
      for (const file of files) {
        const fd = new FormData();
        fd.append('image', file);
        const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        urls.push(res.data.imageUrl);
      }
      setProjectForm(prev => ({
        ...prev,
        screenshots: prev.screenshots ? `${prev.screenshots}, ${urls.join(', ')}` : urls.join(', ')
      }));
    } catch (err) {
      alert('Screenshots upload failed.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleApkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('apk', file);
    setUploadingApk(true);
    try {
      const res = await api.post('/upload/apk', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setProjectForm(prev => ({ ...prev, apkUrl: res.data.apkUrl }));
    } catch (err) {
      alert('APK upload failed.');
    } finally {
      setUploadingApk(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // ─── Profile ────────────────────────────────────────────────────────────────
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const data = {
      headline: {
        vi: profileForm.headline_vi,
        en: profileForm.headline_en,
        ja: profileForm.headline_ja,
        ko: profileForm.headline_ko,
        zh: profileForm.headline_zh
      },
      subHeadline: {
        vi: profileForm.subHeadline_vi,
        en: profileForm.subHeadline_en,
        ja: profileForm.subHeadline_ja,
        ko: profileForm.subHeadline_ko,
        zh: profileForm.subHeadline_zh
      },
      techStack: profileForm.techStack.split(',').map(t => t.trim()).filter(Boolean),
      avatarUrl: profileForm.avatarUrl,
      socialLinks: {
        github: profileForm.github, linkedin: profileForm.linkedin,
        itchio: profileForm.itchio, youtube: profileForm.youtube,
        playStore: profileForm.playStore, appStore: profileForm.appStore,
      }
    };
    try {
      await api.put(`/profile/${profileType}`, data);
      alert('Profile updated!');
    } catch (err) {
      alert('Failed to update profile.');
    }
  };

  // ─── Projects ───────────────────────────────────────────────────────────────
  const emptyProjectForm = {
    title_vi: '', title_en: '', title_ja: '', title_ko: '', title_zh: '',
    description_vi: '', description_en: '', description_ja: '', description_ko: '', description_zh: '',
    imageUrl: '', screenshots: '', projectType: 'web', projectUrl: '', demoUrl: '',
    apkUrl: '', engine: '', platforms: '', videoUrl: '', playableUrl: '',
    playStore: '', appStore: '', itchio: '', steam: '', technologies: ''
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title: {
        vi: projectForm.title_vi,
        en: projectForm.title_en,
        ja: projectForm.title_ja,
        ko: projectForm.title_ko,
        zh: projectForm.title_zh
      },
      description: {
        vi: projectForm.description_vi,
        en: projectForm.description_en,
        ja: projectForm.description_ja,
        ko: projectForm.description_ko,
        zh: projectForm.description_zh
      },
      imageUrl: projectForm.imageUrl,
      screenshots: projectForm.screenshots ? projectForm.screenshots.split(',').map(s => s.trim()).filter(Boolean) : [],
      projectType: projectForm.projectType,
      projectUrl: projectForm.projectUrl,
      demoUrl: projectForm.demoUrl,
      apkUrl: projectForm.apkUrl,
      engine: projectForm.engine,
      platforms: projectForm.platforms ? projectForm.platforms.split(',').map(p => p.trim()).filter(Boolean) : [],
      videoUrl: projectForm.videoUrl,
      playableUrl: projectForm.playableUrl,
      technologies: projectForm.technologies ? projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean) : [],
      downloadUrls: {
        playStore: projectForm.playStore, appStore: projectForm.appStore,
        itchio: projectForm.itchio, steam: projectForm.steam, apk: projectForm.apkUrl
      }
    };
    try {
      if (editingId) await api.put(`/projects/${editingId}`, data);
      else await api.post('/projects', data);
      setProjectForm(emptyProjectForm);
      setEditingId(null);
      fetchData();
      alert('Project saved!');
    } catch (err) {
      alert('Failed to save project.');
    }
  };

  const editProject = (p) => {
    setProjectForm({
      title_vi: p.title?.vi || (typeof p.title === 'string' ? p.title : ''),
      title_en: p.title?.en || (typeof p.title === 'string' ? p.title : ''),
      title_ja: p.title?.ja || '',
      title_ko: p.title?.ko || '',
      title_zh: p.title?.zh || '',
      description_vi: p.description?.vi || (typeof p.description === 'string' ? p.description : ''),
      description_en: p.description?.en || (typeof p.description === 'string' ? p.description : ''),
      description_ja: p.description?.ja || '',
      description_ko: p.description?.ko || '',
      description_zh: p.description?.zh || '',
      imageUrl: p.imageUrl || '',
      screenshots: p.screenshots ? p.screenshots.join(', ') : '',
      projectType: p.projectType || 'web',
      projectUrl: p.projectUrl || '',
      demoUrl: p.demoUrl || '',
      apkUrl: p.downloadUrls?.apk || p.apkUrl || '',
      engine: p.engine || '',
      platforms: p.platforms ? p.platforms.join(', ') : '',
      videoUrl: p.videoUrl || '',
      playableUrl: p.playableUrl || '',
      playStore: p.downloadUrls?.playStore || '',
      appStore: p.downloadUrls?.appStore || '',
      itchio: p.downloadUrls?.itchio || '',
      steam: p.downloadUrls?.steam || '',
      technologies: p.technologies ? p.technologies.join(', ') : ''
    });
    setEditingId(p._id);
  };

  // ─── Posts ──────────────────────────────────────────────────────────────────
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const data = {
      title: {
        vi: postForm.title_vi,
        en: postForm.title_en,
        ja: postForm.title_ja,
        ko: postForm.title_ko,
        zh: postForm.title_zh
      },
      slug: postForm.slug,
      content: {
        vi: postForm.content_vi,
        en: postForm.content_en,
        ja: postForm.content_ja,
        ko: postForm.content_ko,
        zh: postForm.content_zh
      },
      excerpt: {
        vi: postForm.excerpt_vi,
        en: postForm.excerpt_en,
        ja: postForm.excerpt_ja,
        ko: postForm.excerpt_ko,
        zh: postForm.excerpt_zh
      },
      coverImage: postForm.coverImage,
      category: postForm.category,
      tags: postForm.tags ? postForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      published: postForm.published
    };
    try {
      if (editingId) await api.put(`/posts/${editingId}`, data);
      else await api.post('/posts', data);
      setPostForm({
        title_vi: '', title_en: '', title_ja: '', title_ko: '', title_zh: '',
        slug: '',
        content_vi: '', content_en: '', content_ja: '', content_ko: '', content_zh: '',
        excerpt_vi: '', excerpt_en: '', excerpt_ja: '', excerpt_ko: '', excerpt_zh: '',
        coverImage: '', category: 'general', tags: '', published: false
      });
      setEditingId(null);
      fetchData();
      alert('Post saved!');
    } catch (err) {
      alert('Failed to save post.');
    }
  };

  const editPost = (p) => {
    setPostForm({
      title_vi: p.title?.vi || (typeof p.title === 'string' ? p.title : ''),
      title_en: p.title?.en || (typeof p.title === 'string' ? p.title : ''),
      title_ja: p.title?.ja || '',
      title_ko: p.title?.ko || '',
      title_zh: p.title?.zh || '',
      slug: p.slug || '',
      content_vi: p.content?.vi || (typeof p.content === 'string' ? p.content : ''),
      content_en: p.content?.en || (typeof p.content === 'string' ? p.content : ''),
      content_ja: p.content?.ja || '',
      content_ko: p.content?.ko || '',
      content_zh: p.content?.zh || '',
      excerpt_vi: p.excerpt?.vi || (typeof p.excerpt === 'string' ? p.excerpt : ''),
      excerpt_en: p.excerpt?.en || (typeof p.excerpt === 'string' ? p.excerpt : ''),
      excerpt_ja: p.excerpt?.ja || '',
      excerpt_ko: p.excerpt?.ko || '',
      excerpt_zh: p.excerpt?.zh || '',
      coverImage: p.coverImage || '',
      category: p.category || 'general',
      tags: p.tags ? p.tags.join(', ') : '',
      published: p.published || false
    });
    setEditingId(p._id);
  };

  // ─── Comments ───────────────────────────────────────────────────────────────
  const approveComment = async (id) => {
    try {
      await api.put(`/comments/${id}/status`, { status: 'approved' });
      fetchData();
    } catch { }
  };
  const deleteComment = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try { await api.delete(`/comments/${id}`); fetchData(); } catch { }
  };

  // ─── Contact ────────────────────────────────────────────────────────────────
  const markRead = async (id) => {
    try { await api.put(`/contact/${id}/read`); fetchData(); } catch { }
  };
  const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try { await api.delete(`/contact/${id}`); fetchData(); } catch { }
  };

  // ─── Subscribers ────────────────────────────────────────────────────────────
  const deleteSubscriber = async (id) => {
    if (!window.confirm('Remove this subscriber?')) return;
    try { await api.delete(`/subscriber/${id}`); fetchData(); } catch { }
  };

  // ─── Dictionary ─────────────────────────────────────────────────────────────
  const startEditDict = (entry) => {
    setEditingDictKey(entry.key);
    setDictForm({
      vi: entry.translations?.vi || '',
      en: entry.translations?.en || '',
      ja: entry.translations?.ja || '',
      ko: entry.translations?.ko || '',
      zh: entry.translations?.zh || '',
    });
  };
  const saveDictEntry = async () => {
    if (!editingDictKey) return;
    try {
      await api.put(`/dictionary/${editingDictKey}`, { key: editingDictKey, translations: dictForm });
      setEditingDictKey(null);
      fetchData();
    } catch { alert('Failed to save.'); }
  };

  const deleteItem = async (id, type) => {
    if (window.confirm('Are you sure?')) {
      await api.delete(`/${type}/${id}`);
      fetchData();
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/change-password', accountForm);
      alert('Password updated!');
      setAccountForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating password');
    }
  };

  const tabs = [
    { key: 'stats', label: '📊 Dashboard' },
    { key: 'profile', label: '👤 Profiles' },
    { key: 'pages', label: '📄 Pages' },
    { key: 'projects', label: '📁 Projects' },
    { key: 'posts', label: '✍️ Blog Posts' },
    { key: 'comments', label: '💬 Comments' },
    { key: 'contact', label: '📬 Messages' },
    { key: 'subscribers', label: '📧 Subscribers' },
    { key: 'dictionary', label: '🌐 Dictionary' },
    { key: 'account', label: '⚙️ Account' },
  ];

  // ─── Language Tab Switcher Component ────────────────────────────────────────
  const LangTabs = () => {
    const langLabels = {
      vi: '🇻🇳 VI',
      en: '🇬🇧 EN',
      ja: '🇯🇵 JA',
      ko: '🇰🇷 KO',
      zh: '🇨🇳 ZH'
    };
    return (
      <div className="flex gap-1 mb-3">
        {['vi', 'en', 'ja', 'ko', 'zh'].map(l => (
          <button key={l} type="button"
            onClick={() => setFormLang(l)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${formLang === l ? 'bg-purple-600 text-white' : 'bg-white/60 dark:bg-white/[0.03] border border-apple-grayBorderSoft dark:border-white/5 text-apple-grayNeutral'}`}
          >
            {langLabels[l]}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-apple-grayPale dark:bg-apple-black text-apple-ink dark:text-apple-white font-sans flex flex-col">
      {/* Top nav */}
      <nav className="bg-white dark:bg-apple-graphiteA border-b border-apple-grayBorderSoft dark:border-apple-grayBorderMid px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-base sm:text-xl font-semibold">Admin Dashboard</h1>
        <div className="flex items-center gap-3 sm:gap-4">
          <button onClick={() => navigate('/')} className="text-xs sm:text-sm font-medium hover:text-apple-blueAction">View Site</button>
          <button onClick={handleLogout} className="text-xs sm:text-sm font-medium text-red-500 hover:text-red-700">Logout</button>
        </div>
      </nav>

      {/* Mobile tab bar */}
      <div className="md:hidden bg-white dark:bg-apple-graphiteA border-b border-apple-grayBorderSoft dark:border-apple-grayBorderMid overflow-x-auto">
        <div className="flex px-4 py-2 gap-1 min-w-max">
          {tabs.map(tab => (
            <button key={tab.key}
              onClick={() => { setActiveTab(tab.key); setEditingId(null); }}
              className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeTab === tab.key ? 'bg-apple-blueAction text-white' : 'text-apple-grayNeutral hover:bg-apple-grayPale dark:hover:bg-apple-graphiteB'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow flex max-w-7xl mx-auto w-full p-4 sm:p-6 gap-6 sm:gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-52 lg:w-64 flex-col gap-1 shrink-0">
          {tabs.map(tab => (
            <button key={tab.key}
              className={`text-left px-4 py-3 rounded-lg font-medium text-sm transition-colors ${activeTab === tab.key ? 'bg-apple-blueAction text-white' : 'hover:bg-apple-grayBorderSoft dark:hover:bg-apple-graphiteB'}`}
              onClick={() => { setActiveTab(tab.key); setEditingId(null); }}
            >
              {tab.label}
              {tab.key === 'contact' && stats?.counts?.unreadMessages > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">{stats.counts.unreadMessages}</span>
              )}
              {tab.key === 'comments' && stats?.counts?.comments > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-yellow-500 text-black text-[10px] font-bold">{stats.counts.comments}</span>
              )}
            </button>
          ))}
        </aside>

        <main className="flex-grow bg-white dark:bg-apple-graphiteA p-5 sm:p-8 rounded-2xl border border-apple-grayBorderSoft dark:border-apple-grayBorderMid shadow-sm min-w-0 overflow-auto">

          {/* ═══════ STATS TAB ═══════ */}
          {activeTab === 'stats' && (
            <div className="space-y-8">
              <h2 className="text-xl sm:text-2xl font-semibold">📊 Dashboard Overview</h2>
              {statsLoading ? (
                <p className="text-apple-grayNeutral">Loading stats...</p>
              ) : !stats ? (
                <p className="text-apple-grayNeutral">Could not load stats.</p>
              ) : (
                <>
                  {/* Count cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {[
                      { label: 'Projects', value: stats.counts?.projects, color: 'text-purple-600' },
                      { label: 'Posts', value: stats.counts?.posts, color: 'text-blue-600' },
                      { label: 'Comments', value: stats.counts?.comments, color: 'text-yellow-600' },
                      { label: 'Subscribers', value: stats.counts?.subscribers, color: 'text-emerald-600' },
                      { label: 'Messages', value: stats.counts?.messages, color: 'text-pink-600' },
                      { label: 'Unread', value: stats.counts?.unreadMessages, color: 'text-red-600' },
                    ].map(card => (
                      <div key={card.label} className="p-4 rounded-2xl border border-apple-grayBorderSoft dark:border-white/5 bg-white/60 dark:bg-white/[0.02] text-center space-y-1">
                        <div className={`text-2xl font-black ${card.color}`}>{card.value ?? 0}</div>
                        <div className="text-xs text-apple-grayNeutral font-medium">{card.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Engagement */}
                  {stats.engagement && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Engagement</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl border border-apple-grayBorderSoft dark:border-white/5 text-center">
                          <div className="text-xl font-bold text-purple-600">{stats.engagement.totalProjectClicks}</div>
                          <div className="text-xs text-apple-grayNeutral">Total Project Clicks</div>
                        </div>
                        <div className="p-4 rounded-xl border border-apple-grayBorderSoft dark:border-white/5 text-center">
                          <div className="text-xl font-bold text-red-500">{stats.engagement.totalProjectLikes}</div>
                          <div className="text-xs text-apple-grayNeutral">Total Project Likes</div>
                        </div>
                        <div className="p-4 rounded-xl border border-apple-grayBorderSoft dark:border-white/5 text-center">
                          <div className="text-xl font-bold text-pink-500">{stats.engagement.totalPostLikes}</div>
                          <div className="text-xs text-apple-grayNeutral">Total Post Likes</div>
                        </div>
                      </div>

                      {stats.engagement.projectStats?.length > 0 && (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left text-xs text-apple-grayNeutral border-b border-apple-grayBorderSoft dark:border-white/5">
                                <th className="pb-2 pr-4">Project</th>
                                <th className="pb-2 pr-4">Clicks</th>
                                <th className="pb-2">Likes</th>
                              </tr>
                            </thead>
                            <tbody>
                              {stats.engagement.projectStats.map(ps => (
                                <tr key={ps.id} className="border-b border-apple-grayBorderSoft/30 dark:border-white/[0.03]">
                                  <td className="py-2 pr-4 font-medium">{tText(ps.title)}</td>
                                  <td className="py-2 pr-4">{ps.clicks}</td>
                                  <td className="py-2">{ps.likes}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* System info */}
                  {stats.system && (
                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold">System</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className="p-3 rounded-xl border border-apple-grayBorderSoft dark:border-white/5">
                          <span className="text-apple-grayNeutral">Platform:</span> <strong>{stats.system.platform} {stats.system.arch}</strong>
                        </div>
                        <div className="p-3 rounded-xl border border-apple-grayBorderSoft dark:border-white/5">
                          <span className="text-apple-grayNeutral">CPUs:</span> <strong>{stats.system.cpuCount}</strong>
                        </div>
                        <div className="p-3 rounded-xl border border-apple-grayBorderSoft dark:border-white/5">
                          <span className="text-apple-grayNeutral">Memory:</span> <strong>{stats.system.memoryUsagePercent}%</strong>
                          <span className="text-apple-grayNeutral ml-1">({stats.system.freeMemoryGB}/{stats.system.totalMemoryGB} GB)</span>
                        </div>
                        <div className="p-3 rounded-xl border border-apple-grayBorderSoft dark:border-white/5">
                          <span className="text-apple-grayNeutral">Node:</span> <strong>{stats.system.nodeVersion}</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* ═══════ PROFILE TAB ═══════ */}
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-apple-grayBorderSoft dark:border-apple-graphiteB pb-4 gap-4">
                <h2 className="text-xl sm:text-2xl font-semibold">Edit Profile</h2>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-apple-grayNeutral">Branch:</label>
                  <select value={profileType} onChange={e => setProfileType(e.target.value)}
                    className="px-3 py-1.5 border border-apple-grayBorderMid rounded-lg bg-transparent text-sm focus:ring-2 focus:ring-apple-blueAction focus:outline-none">
                    <option value="main" className="dark:text-black">Main Portfolio</option>
                    <option value="mobile" className="dark:text-black">Mobile Apps</option>
                    <option value="game" className="dark:text-black">Game Branch</option>
                  </select>
                </div>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <LangTabs />
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-apple-grayNeutral">Headline ({formLang.toUpperCase()})</label>
                  <input type="text" required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent"
                    value={profileForm[`headline_${formLang}`] || ''}
                    onChange={e => setProfileForm({ ...profileForm, [`headline_${formLang}`]: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-apple-grayNeutral">Sub-Headline ({formLang.toUpperCase()})</label>
                  <textarea required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent" rows={3}
                    value={profileForm[`subHeadline_${formLang}`] || ''}
                    onChange={e => setProfileForm({ ...profileForm, [`subHeadline_${formLang}`]: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-apple-grayNeutral">Tech Stack (comma separated)</label>
                  <input type="text" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent"
                    value={profileForm.techStack} onChange={e => setProfileForm({ ...profileForm, techStack: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-apple-grayNeutral">Profile Avatar</label>
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'profile')} className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-sm" />
                    {uploadingImage && <span className="text-sm text-apple-grayNeutral">Uploading...</span>}
                  </div>
                  {profileForm.avatarUrl && <img src={profileForm.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full object-cover mt-2" />}
                </div>

                {/* Social Links */}
                <div className="space-y-4 border-t border-apple-grayBorderSoft dark:border-apple-graphiteB pt-4">
                  <h3 className="text-lg font-medium text-apple-blueAction">Social Links</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-apple-grayNeutral uppercase">GitHub URL</label>
                      <input type="url" placeholder="https://github.com/..." className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-sm"
                        value={profileForm.github} onChange={e => setProfileForm({ ...profileForm, github: e.target.value })} />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-apple-grayNeutral uppercase">LinkedIn URL</label>
                      <input type="url" placeholder="https://linkedin.com/in/..." className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-sm"
                        value={profileForm.linkedin} onChange={e => setProfileForm({ ...profileForm, linkedin: e.target.value })} />
                    </div>
                    {profileType === 'game' && (<>
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-apple-grayNeutral uppercase">Itch.io</label>
                        <input type="url" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-sm"
                          value={profileForm.itchio} onChange={e => setProfileForm({ ...profileForm, itchio: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-apple-grayNeutral uppercase">YouTube</label>
                        <input type="url" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-sm"
                          value={profileForm.youtube} onChange={e => setProfileForm({ ...profileForm, youtube: e.target.value })} />
                      </div>
                    </>)}
                    {profileType === 'mobile' && (<>
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-apple-grayNeutral uppercase">Google Play</label>
                        <input type="url" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-sm"
                          value={profileForm.playStore} onChange={e => setProfileForm({ ...profileForm, playStore: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-apple-grayNeutral uppercase">App Store</label>
                        <input type="url" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-sm"
                          value={profileForm.appStore} onChange={e => setProfileForm({ ...profileForm, appStore: e.target.value })} />
                      </div>
                    </>)}
                  </div>
                </div>

                <button type="submit" className="bg-apple-ink dark:bg-white text-white dark:text-apple-ink px-6 py-2 rounded-lg font-medium mt-4">Save Profile</button>
              </form>
            </div>
          )}

          {/* ═══════ PAGES TAB ═══════ */}
          {activeTab === 'pages' && (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-apple-grayBorderSoft dark:border-apple-graphiteB pb-4 gap-4">
                <h2 className="text-xl sm:text-2xl font-semibold font-display">Edit Static Pages</h2>
                <div className="flex gap-2">
                  {['privacy', 'terms', 'donation'].map(p => (
                    <button key={p} type="button" onClick={() => setSelectedStaticPage(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedStaticPage === p ? 'bg-purple-600 text-white shadow-md' : 'bg-white/60 dark:bg-white/[0.03] border border-apple-grayBorderSoft dark:border-white/5 text-apple-grayNeutral'}`}
                    >
                      {p === 'privacy' && '🔒 Privacy Policy'}
                      {p === 'terms' && '📝 Terms of Service'}
                      {p === 'donation' && '💝 Donation & Support'}
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handlePagesSubmit} className="space-y-6">
                {(selectedStaticPage === 'privacy' || selectedStaticPage === 'terms') && (
                  <div className="space-y-4">
                    <LangTabs />
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-apple-grayNeutral">Page Title ({formLang.toUpperCase()})</label>
                      <input type="text" required className="w-full px-4 py-2.5 border border-apple-grayBorderMid rounded-xl bg-transparent"
                        value={pagesForm[`${selectedStaticPage}_title_${formLang}`] || ''}
                        onChange={e => setPagesForm({ ...pagesForm, [`${selectedStaticPage}_title_${formLang}`]: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-apple-grayNeutral">Page Content (Markdown) ({formLang.toUpperCase()})</label>
                      <textarea required className="w-full px-4 py-3 border border-apple-grayBorderMid rounded-2xl bg-transparent font-mono text-sm" rows={12}
                        value={pagesForm[`${selectedStaticPage}_content_${formLang}`] || ''}
                        onChange={e => setPagesForm({ ...pagesForm, [`${selectedStaticPage}_content_${formLang}`]: e.target.value })} />
                    </div>
                  </div>
                )}

                {selectedStaticPage === 'donation' && (
                  <div className="space-y-6">
                    <div className="border border-purple-500/20 rounded-2xl p-5 bg-purple-500/5 space-y-4">
                      <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400">💝 Donation Title & Message</h3>
                      <LangTabs />
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-apple-grayNeutral">Section Title ({formLang.toUpperCase()})</label>
                        <input type="text" required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded-xl bg-transparent text-sm"
                          value={pagesForm[`donation_title_${formLang}`] || ''}
                          onChange={e => setPagesForm({ ...pagesForm, [`donation_title_${formLang}`]: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-apple-grayNeutral">Support Paragraph (Markdown) ({formLang.toUpperCase()})</label>
                        <textarea required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded-xl bg-transparent text-sm" rows={4}
                          value={pagesForm[`donation_content_${formLang}`] || ''}
                          onChange={e => setPagesForm({ ...pagesForm, [`donation_content_${formLang}`]: e.target.value })} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Bank Details */}
                      <div className="border border-indigo-500/20 rounded-2xl p-5 bg-indigo-500/5 space-y-4">
                        <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400">🏦 Bank Transfer Details</h3>
                        <LangTabs />
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-apple-grayNeutral">Bank Name ({formLang.toUpperCase()})</label>
                          <input type="text" required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded-xl bg-transparent text-sm"
                            value={pagesForm[`donation_bank_name_${formLang}`] || ''}
                            onChange={e => setPagesForm({ ...pagesForm, [`donation_bank_name_${formLang}`]: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-apple-grayNeutral">Account Number (Same for all languages)</label>
                          <input type="text" required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded-xl bg-transparent text-sm"
                            value={pagesForm.donation_account_number || ''}
                            onChange={e => setPagesForm({ ...pagesForm, donation_account_number: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-apple-grayNeutral">Account Holder Name (Same for all languages)</label>
                          <input type="text" required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded-xl bg-transparent text-sm"
                            value={pagesForm.donation_account_name || ''}
                            onChange={e => setPagesForm({ ...pagesForm, donation_account_name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-apple-grayNeutral">Branch Location ({formLang.toUpperCase()})</label>
                          <input type="text" required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded-xl bg-transparent text-sm"
                            value={pagesForm[`donation_branch_${formLang}`] || ''}
                            onChange={e => setPagesForm({ ...pagesForm, [`donation_branch_${formLang}`]: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-apple-grayNeutral">QR Code Image URL (Same for all languages)</label>
                          <input type="url" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded-xl bg-transparent text-sm"
                            value={pagesForm.donation_qr_code_url || ''}
                            onChange={e => setPagesForm({ ...pagesForm, donation_qr_code_url: e.target.value })} />
                        </div>
                      </div>

                      {/* E-Wallets & Platforms */}
                      <div className="space-y-6">
                        <div className="border border-pink-500/20 rounded-2xl p-5 bg-pink-500/5 space-y-4">
                          <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400">📱 Mobile E-Wallets</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-xs text-apple-grayNeutral">MoMo Name</label>
                              <input type="text" placeholder="Ví MoMo" className="w-full px-3 py-1.5 border border-apple-grayBorderMid rounded-lg bg-transparent text-xs"
                                value={pagesForm.donation_momo_name || ''}
                                onChange={e => setPagesForm({ ...pagesForm, donation_momo_name: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-xs text-apple-grayNeutral">MoMo Phone</label>
                              <input type="text" className="w-full px-3 py-1.5 border border-apple-grayBorderMid rounded-lg bg-transparent text-xs"
                                value={pagesForm.donation_momo_phone || ''}
                                onChange={e => setPagesForm({ ...pagesForm, donation_momo_phone: e.target.value })} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-xs text-apple-grayNeutral">ZaloPay Name</label>
                              <input type="text" placeholder="Ví ZaloPay" className="w-full px-3 py-1.5 border border-apple-grayBorderMid rounded-lg bg-transparent text-xs"
                                value={pagesForm.donation_zalopay_name || ''}
                                onChange={e => setPagesForm({ ...pagesForm, donation_zalopay_name: e.target.value })} />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-xs text-apple-grayNeutral">ZaloPay Phone</label>
                              <input type="text" className="w-full px-3 py-1.5 border border-apple-grayBorderMid rounded-lg bg-transparent text-xs"
                                value={pagesForm.donation_zalopay_phone || ''}
                                onChange={e => setPagesForm({ ...pagesForm, donation_zalopay_phone: e.target.value })} />
                            </div>
                          </div>
                        </div>

                        <div className="border border-amber-500/20 rounded-2xl p-5 bg-amber-500/5 space-y-4">
                          <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400">☕ External Platforms</h3>
                          <div className="space-y-2">
                            <label className="block text-xs font-semibold text-apple-grayNeutral">Buy Me A Coffee Link</label>
                            <input type="url" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded-xl bg-transparent text-sm"
                              value={pagesForm.donation_buymeacoffee_url || ''}
                              onChange={e => setPagesForm({ ...pagesForm, donation_buymeacoffee_url: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs font-semibold text-apple-grayNeutral">Ko-fi Link</label>
                            <input type="url" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded-xl bg-transparent text-sm"
                              value={pagesForm.donation_kofi_url || ''}
                              onChange={e => setPagesForm({ ...pagesForm, donation_kofi_url: e.target.value })} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <button type="submit" className="bg-apple-ink dark:bg-white text-white dark:text-apple-ink px-6 py-2.5 rounded-xl font-medium mt-4 hover:scale-[1.01] transition-transform">
                  Save Page Settings
                </button>
              </form>
            </div>
          )}

          {/* ═══════ PROJECTS TAB ═══════ */}
          {activeTab === 'projects' && (
            <div className="space-y-8">
              <h2 className="text-xl sm:text-2xl font-semibold">{editingId ? 'Edit Project' : 'New Project'}</h2>
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <LangTabs />
                <input type="text" placeholder={`Title (${formLang.toUpperCase()})`} required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent"
                  value={projectForm[`title_${formLang}`] || ''}
                  onChange={e => setProjectForm({ ...projectForm, [`title_${formLang}`]: e.target.value })} />
                <textarea placeholder={`Description (${formLang.toUpperCase()})`} required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent" rows={3}
                  value={projectForm[`description_${formLang}`] || ''}
                  onChange={e => setProjectForm({ ...projectForm, [`description_${formLang}`]: e.target.value })} />

                {/* Project Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-apple-grayNeutral">Project Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['web', 'mobile', 'game', 'other'].map((type) => (
                      <label key={type} className={`flex items-center justify-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${projectForm.projectType === type ? 'border-apple-blueAction bg-apple-blueAction/10 text-apple-blueAction' : 'border-apple-grayBorderMid'}`}>
                        <input type="radio" name="projectType" value={type} checked={projectForm.projectType === type}
                          onChange={e => setProjectForm({ ...projectForm, projectType: e.target.value })} className="sr-only" />
                        <span className="text-sm capitalize font-medium">
                          {type === 'web' && '🌐 Web'}{type === 'mobile' && '📱 Mobile'}{type === 'game' && '🎮 Game'}{type === 'other' && '⚙️ Other'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Cover + Screenshots */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-b border-apple-grayBorderSoft dark:border-apple-graphiteB py-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-apple-grayNeutral">Cover Image</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'project')} className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-xs" />
                    {projectForm.imageUrl && <img src={projectForm.imageUrl} alt="Cover" className="h-16 rounded object-cover mt-2" />}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-apple-grayNeutral">Screenshots (Multi)</label>
                    <input type="file" accept="image/*" multiple onChange={handleScreenshotUpload} className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-xs" />
                    <input type="text" placeholder="Or paste comma-separated urls" className="w-full px-3 py-1 border border-apple-grayBorderMid rounded text-xs bg-transparent mt-1"
                      value={projectForm.screenshots} onChange={e => setProjectForm({ ...projectForm, screenshots: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-apple-grayNeutral">Platforms</label>
                    <input type="text" placeholder="Windows, macOS, Web" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-sm"
                      value={projectForm.platforms} onChange={e => setProjectForm({ ...projectForm, platforms: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-apple-grayNeutral">Repository URL</label>
                    <input type="url" placeholder="https://github.com/..." className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-sm"
                      value={projectForm.projectUrl} onChange={e => setProjectForm({ ...projectForm, projectUrl: e.target.value })} />
                  </div>
                </div>

                {/* Mobile Specific */}
                {projectForm.projectType === 'mobile' && (
                  <div className="space-y-4 border border-purple-500/20 rounded-2xl p-4 bg-purple-500/5">
                    <h4 className="text-sm font-bold text-purple-600 dark:text-purple-400">📱 Mobile Config</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-apple-grayNeutral">Demo URL</label>
                        <input type="url" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-sm"
                          value={projectForm.demoUrl} onChange={e => setProjectForm({ ...projectForm, demoUrl: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-apple-grayNeutral">APK URL / Upload</label>
                        <input type="file" accept=".apk" onChange={handleApkUpload} className="w-full px-3 py-1 border border-apple-grayBorderMid rounded bg-transparent text-xs" />
                        {uploadingApk && <span className="text-xs text-purple-600">Uploading...</span>}
                        <input type="url" placeholder="Or direct APK link" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-sm mt-1"
                          value={projectForm.apkUrl} onChange={e => setProjectForm({ ...projectForm, apkUrl: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-apple-grayNeutral">Google Play</label>
                        <input type="url" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-sm"
                          value={projectForm.playStore} onChange={e => setProjectForm({ ...projectForm, playStore: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-apple-grayNeutral">App Store</label>
                        <input type="url" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-sm"
                          value={projectForm.appStore} onChange={e => setProjectForm({ ...projectForm, appStore: e.target.value })} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Game Specific */}
                {projectForm.projectType === 'game' && (
                  <div className="space-y-4 border border-emerald-500/20 rounded-2xl p-4 bg-emerald-500/5">
                    <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-400">🎮 Game Config</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-apple-grayNeutral">Engine</label>
                        <input type="text" placeholder="Unity" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-sm"
                          value={projectForm.engine} onChange={e => setProjectForm({ ...projectForm, engine: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-apple-grayNeutral">Trailer Video</label>
                        <input type="url" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-sm"
                          value={projectForm.videoUrl} onChange={e => setProjectForm({ ...projectForm, videoUrl: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-apple-grayNeutral">WebGL Playable</label>
                        <input type="url" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-sm"
                          value={projectForm.playableUrl} onChange={e => setProjectForm({ ...projectForm, playableUrl: e.target.value })} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-apple-grayNeutral">Itch.io</label>
                        <input type="url" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-sm"
                          value={projectForm.itchio} onChange={e => setProjectForm({ ...projectForm, itchio: e.target.value })} />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-apple-grayNeutral">Steam</label>
                        <input type="url" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-sm"
                          value={projectForm.steam} onChange={e => setProjectForm({ ...projectForm, steam: e.target.value })} />
                      </div>
                    </div>
                  </div>
                )}

                <input type="text" placeholder="Technologies (comma separated)" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent"
                  value={projectForm.technologies} onChange={e => setProjectForm({ ...projectForm, technologies: e.target.value })} />

                <div className="flex gap-4">
                  <button type="submit" className="bg-apple-ink dark:bg-white text-white dark:text-apple-ink px-6 py-2 rounded-lg font-medium">{editingId ? 'Update' : 'Create'}</button>
                  {editingId && <button type="button" onClick={() => { setEditingId(null); setProjectForm(emptyProjectForm); }} className="px-6 py-2 border border-apple-grayBorderMid rounded-lg font-medium">Cancel</button>}
                </div>
              </form>

              <div className="space-y-4 mt-8">
                <h3 className="text-lg sm:text-xl font-semibold border-t border-apple-grayBorderSoft dark:border-apple-grayBorderMid pt-8">Existing Projects</h3>
                {projects.map(p => (
                  <div key={p._id} className="flex justify-between items-center p-4 border border-apple-grayBorderSoft dark:border-apple-grayBorderMid rounded-lg gap-3">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-xs">
                        {p.projectType === 'mobile' && '📱'}{p.projectType === 'game' && '🎮'}{p.projectType === 'web' && '🌐'}{p.projectType === 'other' && '⚙️'}
                      </span>
                      <span className="font-medium text-sm truncate">{tText(p.title)}</span>
                    </div>
                    <div className="flex gap-3 shrink-0">
                      <button onClick={() => editProject(p)} className="text-apple-blueAction text-sm">Edit</button>
                      <button onClick={() => deleteItem(p._id, 'projects')} className="text-red-500 text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════ BLOG POSTS TAB ═══════ */}
          {activeTab === 'posts' && (
            <div className="space-y-8">
              <h2 className="text-xl sm:text-2xl font-semibold">{editingId ? 'Edit Post' : 'New Post'}</h2>
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <LangTabs />
                <input type="text" placeholder={`Title (${formLang.toUpperCase()})`} required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent"
                  value={postForm[`title_${formLang}`] || ''}
                  onChange={e => {
                    const val = e.target.value;
                    setPostForm(prev => ({
                      ...prev,
                      [`title_${formLang}`]: val,
                      ...(formLang === 'vi' ? { slug: val.toLowerCase().replace(/ /g, '-') } : {})
                    }));
                  }} />
                <input type="text" placeholder="Slug" required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent"
                  value={postForm.slug} onChange={e => setPostForm({ ...postForm, slug: e.target.value })} />

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-apple-grayNeutral">Category</label>
                  <select value={postForm.category} onChange={e => setPostForm({ ...postForm, category: e.target.value })}
                    className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent dark:text-black">
                    <option value="general">General</option>
                    <option value="mobile">Mobile</option>
                    <option value="game">Game Development</option>
                  </select>
                </div>

                <textarea placeholder={`Excerpt (${formLang.toUpperCase()})`} className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent" rows={2}
                  value={postForm[`excerpt_${formLang}`] || ''}
                  onChange={e => setPostForm({ ...postForm, [`excerpt_${formLang}`]: e.target.value })} />

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'post')} className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-sm" />
                  {uploadingImage && <span className="text-sm text-apple-grayNeutral">Uploading...</span>}
                </div>
                {postForm.coverImage && <img src={postForm.coverImage} alt="Preview" className="h-20 rounded object-cover" />}

                <input type="text" placeholder="Tags (comma separated)" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent"
                  value={postForm.tags} onChange={e => setPostForm({ ...postForm, tags: e.target.value })} />

                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={postForm.published} onChange={e => setPostForm({ ...postForm, published: e.target.checked })} />
                  <span>Published</span>
                </label>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-apple-grayNeutral">Content ({formLang.toUpperCase()})</label>
                  <div className="bg-white dark:bg-apple-graphiteA text-black h-64 mb-12">
                    <ReactQuill theme="snow"
                      value={postForm[`content_${formLang}`] || ''}
                      onChange={(content) => setPostForm(prev => ({ ...prev, [`content_${formLang}`]: content }))}
                      className="h-full" />
                  </div>
                </div>

                <div className="flex gap-4 pt-8">
                  <button type="submit" className="bg-apple-ink dark:bg-white text-white dark:text-apple-ink px-6 py-2 rounded-lg font-medium">{editingId ? 'Update' : 'Create'}</button>
                  {editingId && <button type="button" onClick={() => { setEditingId(null); setPostForm({ title_vi: '', title_en: '', slug: '', content_vi: '', content_en: '', excerpt_vi: '', excerpt_en: '', coverImage: '', category: 'general', tags: '', published: false }); }} className="px-6 py-2 border border-apple-grayBorderMid rounded-lg font-medium">Cancel</button>}
                </div>
              </form>

              <div className="space-y-4 mt-8">
                <h3 className="text-lg sm:text-xl font-semibold border-t border-apple-grayBorderSoft dark:border-apple-grayBorderMid pt-8">Existing Posts</h3>
                {posts.map(p => (
                  <div key={p._id} className="flex justify-between items-center p-4 border border-apple-grayBorderSoft dark:border-apple-grayBorderMid rounded-lg gap-3">
                    <span className="font-medium text-sm truncate">
                      {tText(p.title)}
                      <span className="text-xs text-apple-grayNeutral ml-1">({p.category}) ({p.published ? 'Published' : 'Draft'})</span>
                    </span>
                    <div className="flex gap-3 shrink-0">
                      <button onClick={() => editPost(p)} className="text-apple-blueAction text-sm">Edit</button>
                      <button onClick={() => deleteItem(p._id, 'posts')} className="text-red-500 text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══════ COMMENTS TAB ═══════ */}
          {activeTab === 'comments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-xl sm:text-2xl font-semibold">💬 Comment Moderation</h2>
                <div className="flex gap-2">
                  {['pending', 'approved'].map(s => (
                    <button key={s} onClick={() => setCommentFilter(s)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${commentFilter === s ? 'bg-apple-blueAction text-white' : 'border border-apple-grayBorderMid text-apple-grayNeutral'}`}
                    >
                      {s === 'pending' ? '⏳ Pending' : '✅ Approved'}
                    </button>
                  ))}
                </div>
              </div>

              {comments.length === 0 ? (
                <p className="text-apple-grayNeutral text-sm">No {commentFilter} comments.</p>
              ) : (
                <div className="space-y-3">
                  {comments.map(c => (
                    <div key={c._id} className="p-4 border border-apple-grayBorderSoft dark:border-white/5 rounded-xl space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm">
                          <strong>{c.playerName}</strong>
                          {c.email && <span className="text-apple-grayNeutral ml-1 text-xs">{c.email}</span>}
                        </div>
                        <time className="text-xs text-apple-grayNeutral">{new Date(c.createdAt).toLocaleDateString()}</time>
                      </div>
                      <p className="text-sm text-apple-ink dark:text-apple-white">{c.content}</p>
                      <div className="flex gap-2 pt-1">
                        {c.status === 'pending' && (
                          <button onClick={() => approveComment(c._id)}
                            className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-semibold hover:bg-emerald-500/20 transition-colors">
                            ✅ Approve
                          </button>
                        )}
                        <button onClick={() => deleteComment(c._id)}
                          className="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 text-xs font-semibold hover:bg-red-500/20 transition-colors">
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════ CONTACT/MESSAGES TAB ═══════ */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold">📬 Contact Messages</h2>

              {messages.length === 0 ? (
                <p className="text-apple-grayNeutral text-sm">No messages.</p>
              ) : (
                <div className="space-y-3">
                  {messages.map(m => (
                    <div key={m._id} className={`p-4 border rounded-xl space-y-2 ${m.read ? 'border-apple-grayBorderSoft dark:border-white/5' : 'border-blue-500/30 bg-blue-500/5'}`}>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="text-sm">
                          <strong>{m.name}</strong>
                          <span className="text-apple-grayNeutral ml-2 text-xs">{m.email}</span>
                          {!m.read && <span className="ml-2 px-1.5 py-0.5 rounded bg-blue-500 text-white text-[10px] font-bold">NEW</span>}
                        </div>
                        <time className="text-xs text-apple-grayNeutral">{new Date(m.createdAt).toLocaleDateString()}</time>
                      </div>
                      {m.subject && <p className="text-xs font-semibold text-apple-blueAction">{m.subject}</p>}
                      <p className="text-sm text-apple-ink dark:text-apple-white whitespace-pre-wrap">{m.message}</p>
                      <div className="flex gap-2 pt-1">
                        {!m.read && (
                          <button onClick={() => markRead(m._id)}
                            className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 text-xs font-semibold hover:bg-blue-500/20 transition-colors">
                            ✓ Mark Read
                          </button>
                        )}
                        <button onClick={() => deleteMessage(m._id)}
                          className="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 text-xs font-semibold hover:bg-red-500/20 transition-colors">
                          🗑 Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════ SUBSCRIBERS TAB ═══════ */}
          {activeTab === 'subscribers' && (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold">📧 Newsletter Subscribers ({subscribers.length})</h2>

              {subscribers.length === 0 ? (
                <p className="text-apple-grayNeutral text-sm">No subscribers yet.</p>
              ) : (
                <div className="space-y-2">
                  {subscribers.map(s => (
                    <div key={s._id} className="flex items-center justify-between p-3 border border-apple-grayBorderSoft dark:border-white/5 rounded-xl">
                      <div className="text-sm">
                        <span className="font-medium">{s.email}</span>
                        <span className="text-xs text-apple-grayNeutral ml-2">{new Date(s.createdAt).toLocaleDateString()}</span>
                      </div>
                      <button onClick={() => deleteSubscriber(s._id)}
                        className="px-3 py-1 rounded-lg bg-red-500/10 text-red-500 text-xs font-semibold hover:bg-red-500/20 transition-colors">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════ DICTIONARY TAB ═══════ */}
          {activeTab === 'dictionary' && (
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold">🌐 Translation Dictionary</h2>

              {dictEntries.length === 0 ? (
                <p className="text-apple-grayNeutral text-sm">No dictionary entries.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left border-b border-apple-grayBorderSoft dark:border-white/5 text-apple-grayNeutral">
                        <th className="pb-2 pr-3 font-semibold">Key</th>
                        <th className="pb-2 pr-3 font-semibold">🇻🇳 VI</th>
                        <th className="pb-2 pr-3 font-semibold">🇬🇧 EN</th>
                        <th className="pb-2 pr-3 font-semibold">🇯🇵 JA</th>
                        <th className="pb-2 pr-3 font-semibold">🇰🇷 KO</th>
                        <th className="pb-2 pr-3 font-semibold">🇨🇳 ZH</th>
                        <th className="pb-2 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dictEntries.map(entry => (
                        <tr key={entry.key} className="border-b border-apple-grayBorderSoft/30 dark:border-white/[0.03]">
                          <td className="py-2 pr-3 font-mono font-bold text-purple-600 dark:text-purple-400">{entry.key}</td>
                          {editingDictKey === entry.key ? (
                            <>
                              {['vi', 'en', 'ja', 'ko', 'zh'].map(lang => (
                                <td key={lang} className="py-2 pr-3">
                                  <input type="text" className="w-full px-2 py-1 border border-apple-grayBorderMid rounded text-xs bg-transparent"
                                    value={dictForm[lang]} onChange={e => setDictForm(prev => ({ ...prev, [lang]: e.target.value }))} />
                                </td>
                              ))}
                              <td className="py-2">
                                <div className="flex gap-1">
                                  <button onClick={saveDictEntry} className="px-2 py-1 rounded bg-emerald-500 text-white text-[10px] font-bold">Save</button>
                                  <button onClick={() => setEditingDictKey(null)} className="px-2 py-1 rounded bg-gray-300 dark:bg-gray-700 text-[10px] font-bold">Cancel</button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="py-2 pr-3">{entry.translations?.vi || '-'}</td>
                              <td className="py-2 pr-3">{entry.translations?.en || '-'}</td>
                              <td className="py-2 pr-3">{entry.translations?.ja || '-'}</td>
                              <td className="py-2 pr-3">{entry.translations?.ko || '-'}</td>
                              <td className="py-2 pr-3">{entry.translations?.zh || '-'}</td>
                              <td className="py-2">
                                <button onClick={() => startEditDict(entry)} className="text-apple-blueAction text-[10px] font-semibold hover:underline">Edit</button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ═══════ ACCOUNT TAB ═══════ */}
          {activeTab === 'account' && (
            <div className="space-y-8">
              <h2 className="text-xl sm:text-2xl font-semibold">⚙️ Account Settings</h2>
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-apple-grayNeutral">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-apple-grayNeutral">Current Password</label>
                    <input type="password" required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent"
                      value={accountForm.currentPassword} onChange={e => setAccountForm({ ...accountForm, currentPassword: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-apple-grayNeutral">New Password</label>
                    <input type="password" required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent"
                      value={accountForm.newPassword} onChange={e => setAccountForm({ ...accountForm, newPassword: e.target.value })} />
                  </div>
                  <button type="submit" className="bg-apple-ink dark:bg-white text-white dark:text-apple-ink px-6 py-2 rounded-lg font-medium">Update Password</button>
                </form>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
