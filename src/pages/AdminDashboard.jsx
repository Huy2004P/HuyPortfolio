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
  const [selectedStaticPage, setSelectedStaticPage] = useState('list');
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

  // Dynamic custom pages state
  const [customPagesList, setCustomPagesList] = useState([]);
  const [customPageForm, setCustomPageForm] = useState({
    key: '',
    title_vi: '', title_en: '', title_ja: '', title_ko: '', title_zh: '',
    navTitle_vi: '', navTitle_en: '', navTitle_ja: '', navTitle_ko: '', navTitle_zh: '',
    content_vi: '', content_en: '', content_ja: '', content_ko: '', content_zh: '',
    showInHeader: false,
    showInFooter: false,
    isPublished: true,
    coverImage: '',
    template: 'default',
    graduationDate: '',
    familyThanks_vi: '', familyThanks_en: '', familyThanks_ja: '', familyThanks_ko: '', familyThanks_zh: '',
    teacherThanks_vi: '', teacherThanks_en: '', teacherThanks_ja: '', teacherThanks_ko: '', teacherThanks_zh: '',
    friendThanks_vi: '', friendThanks_en: '', friendThanks_ja: '', friendThanks_ko: '', friendThanks_zh: '',
    gallery: []
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

        try {
          const customPagesRes = await api.get('/pages');
          setCustomPagesList(Array.isArray(customPagesRes.data) ? customPagesRes.data : []);
        } catch (err) {
          console.error("Failed to load custom pages list", err);
        }

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

  const handleCustomPageSubmit = async (e) => {
    e.preventDefault();
    if (!customPageForm.key || !customPageForm.key.trim()) {
      alert("Page Key/Slug is required.");
      return;
    }
    const pageKey = customPageForm.key.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');
    
    const body = {
      title: {
        vi: customPageForm.title_vi,
        en: customPageForm.title_en,
        ja: customPageForm.title_ja,
        ko: customPageForm.title_ko,
        zh: customPageForm.title_zh
      },
      navTitle: {
        vi: customPageForm.navTitle_vi,
        en: customPageForm.navTitle_en,
        ja: customPageForm.navTitle_ja,
        ko: customPageForm.navTitle_ko,
        zh: customPageForm.navTitle_zh
      },
      content: {
        vi: customPageForm.content_vi,
        en: customPageForm.content_en,
        ja: customPageForm.content_ja,
        ko: customPageForm.content_ko,
        zh: customPageForm.content_zh
      },
      metadata: {
        isCustom: true,
        showInHeader: customPageForm.showInHeader,
        showInFooter: customPageForm.showInFooter,
        isPublished: customPageForm.isPublished,
        coverImage: customPageForm.coverImage,
        template: customPageForm.template || 'default',
        graduationDate: customPageForm.graduationDate || '',
        familyThanks_vi: customPageForm.familyThanks_vi || '',
        familyThanks_en: customPageForm.familyThanks_en || '',
        familyThanks_ja: customPageForm.familyThanks_ja || '',
        familyThanks_ko: customPageForm.familyThanks_ko || '',
        familyThanks_zh: customPageForm.familyThanks_zh || '',
        teacherThanks_vi: customPageForm.teacherThanks_vi || '',
        teacherThanks_en: customPageForm.teacherThanks_en || '',
        teacherThanks_ja: customPageForm.teacherThanks_ja || '',
        teacherThanks_ko: customPageForm.teacherThanks_ko || '',
        teacherThanks_zh: customPageForm.teacherThanks_zh || '',
        friendThanks_vi: customPageForm.friendThanks_vi || '',
        friendThanks_en: customPageForm.friendThanks_en || '',
        friendThanks_ja: customPageForm.friendThanks_ja || '',
        friendThanks_ko: customPageForm.friendThanks_ko || '',
        friendThanks_zh: customPageForm.friendThanks_zh || '',
        gallery: customPageForm.gallery || []
      }
    };

    try {
      await api.put(`/pages/${pageKey}`, body);
      alert('Custom page saved successfully!');
      setSelectedStaticPage('list');
      setCustomPageForm({
        key: '',
        title_vi: '', title_en: '', title_ja: '', title_ko: '', title_zh: '',
        navTitle_vi: '', navTitle_en: '', navTitle_ja: '', navTitle_ko: '', navTitle_zh: '',
        content_vi: '', content_en: '', content_ja: '', content_ko: '', content_zh: '',
        showInHeader: false,
        showInFooter: false,
        isPublished: true,
        coverImage: '',
        template: 'default',
        graduationDate: '',
        familyThanks_vi: '', familyThanks_en: '', familyThanks_ja: '', familyThanks_ko: '', familyThanks_zh: '',
        teacherThanks_vi: '', teacherThanks_en: '', teacherThanks_ja: '', teacherThanks_ko: '', teacherThanks_zh: '',
        friendThanks_vi: '', friendThanks_en: '', friendThanks_ja: '', friendThanks_ko: '', friendThanks_zh: '',
        gallery: []
      });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to save custom page: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCustomPageDelete = async (pageKey) => {
    if (!window.confirm(`Are you sure you want to delete the custom page "${pageKey}"?`)) return;
    try {
      await api.delete(`/pages/${pageKey}`);
      alert('Custom page deleted successfully!');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to delete page: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEditCustomPageClick = (page) => {
    setCustomPageForm({
      key: page.key,
      title_vi: page.title?.vi || '',
      title_en: page.title?.en || '',
      title_ja: page.title?.ja || '',
      title_ko: page.title?.ko || '',
      title_zh: page.title?.zh || '',
      navTitle_vi: page.navTitle?.vi || '',
      navTitle_en: page.navTitle?.en || '',
      navTitle_ja: page.navTitle?.ja || '',
      navTitle_ko: page.navTitle?.ko || '',
      navTitle_zh: page.navTitle?.zh || '',
      content_vi: page.content?.vi || '',
      content_en: page.content?.en || '',
      content_ja: page.content?.ja || '',
      content_ko: page.content?.ko || '',
      content_zh: page.content?.zh || '',
      showInHeader: page.metadata?.showInHeader || false,
      showInFooter: page.metadata?.showInFooter || false,
      isPublished: page.metadata?.isPublished !== false,
      coverImage: page.metadata?.coverImage || '',
      template: page.metadata?.template || 'default',
      graduationDate: page.metadata?.graduationDate || '',
      familyThanks_vi: page.metadata?.familyThanks_vi || '',
      familyThanks_en: page.metadata?.familyThanks_en || '',
      familyThanks_ja: page.metadata?.familyThanks_ja || '',
      familyThanks_ko: page.metadata?.familyThanks_ko || '',
      familyThanks_zh: page.metadata?.familyThanks_zh || '',
      teacherThanks_vi: page.metadata?.teacherThanks_vi || '',
      teacherThanks_en: page.metadata?.teacherThanks_en || '',
      teacherThanks_ja: page.metadata?.teacherThanks_ja || '',
      teacherThanks_ko: page.metadata?.teacherThanks_ko || '',
      teacherThanks_zh: page.metadata?.teacherThanks_zh || '',
      friendThanks_vi: page.metadata?.friendThanks_vi || '',
      friendThanks_en: page.metadata?.friendThanks_en || '',
      friendThanks_ja: page.metadata?.friendThanks_ja || '',
      friendThanks_ko: page.metadata?.friendThanks_ko || '',
      friendThanks_zh: page.metadata?.friendThanks_zh || '',
      gallery: page.metadata?.gallery || []
    });
    setSelectedStaticPage(page.key);
  };

  const handleImageUpload = async (e, formType) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setUploadingImage(true);
    try {
      if (formType === 'customPageGallery') {
        const urls = [];
        for (const file of files) {
          const formData = new FormData();
          formData.append('image', file);
          const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
          urls.push(res.data.imageUrl);
        }
        setCustomPageForm(prev => ({
          ...prev,
          gallery: [...(prev.gallery || []), ...urls]
        }));
      } else {
        const file = files[0];
        const formData = new FormData();
        formData.append('image', file);
        const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        const imageUrl = res.data.imageUrl;
        if (formType === 'project') setProjectForm(prev => ({ ...prev, imageUrl }));
        else if (formType === 'post') setPostForm(prev => ({ ...prev, coverImage: imageUrl }));
        else if (formType === 'profile') setProfileForm(prev => ({ ...prev, avatarUrl: imageUrl }));
        else if (formType === 'customPageCover') setCustomPageForm(prev => ({ ...prev, coverImage: imageUrl }));
        else if (formType === 'customPageContent') {
          const currentContentKey = `content_${formLang}`;
          const currentContent = customPageForm[currentContentKey] || '';
          const imgHtml = `<p><img src="${imageUrl}" alt="Image" style="max-width:100%; border-radius:12px; margin: 16px 0;" /></p>`;
          setCustomPageForm(prev => ({
            ...prev,
            [currentContentKey]: currentContent + imgHtml
          }));
        }
      }
      alert('Upload completed successfully!');
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
            <div className="space-y-8 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-apple-grayBorderSoft dark:border-apple-graphiteB pb-4 gap-4">
                <h2 className="text-xl sm:text-2xl font-semibold font-display">Manage Pages</h2>
                {selectedStaticPage !== 'list' && (
                  <button
                    onClick={() => setSelectedStaticPage('list')}
                    className="self-start px-4 py-2 text-xs font-semibold rounded-xl border border-apple-grayBorderMid hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  >
                    ← Back to List
                  </button>
                )}
              </div>

              {/* 1. LIST VIEW */}
              {selectedStaticPage === 'list' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-apple-grayNeutral">Edit system pages or create dynamic custom landing pages (e.g. graduation ceremony page).</p>
                    <button
                      onClick={() => {
                        setCustomPageForm({
                          key: '',
                          title_vi: '', title_en: '', title_ja: '', title_ko: '', title_zh: '',
                          content_vi: '', content_en: '', content_ja: '', content_ko: '', content_zh: '',
                          showInHeader: false,
                          showInFooter: false,
                          isPublished: true
                        });
                        setSelectedStaticPage('new_page');
                      }}
                      className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold transition-all shadow-sm"
                    >
                      + Create Custom Page
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-2xl border border-apple-grayBorderSoft dark:border-apple-graphiteB bg-white/40 dark:bg-black/10">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-apple-grayBorderSoft dark:border-apple-graphiteB bg-black/5 dark:bg-white/[0.02] text-xs font-bold uppercase tracking-wider text-apple-grayNeutral">
                          <th className="px-6 py-4">Page Title / URL Slug</th>
                          <th className="px-6 py-4">Type</th>
                          <th className="px-6 py-4 text-center">Navbar</th>
                          <th className="px-6 py-4 text-center">Footer</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-apple-grayBorderSoft/50 dark:divide-apple-graphiteB/50">
                        {/* System Page: Privacy */}
                        <tr>
                          <td className="px-6 py-4 font-medium text-apple-ink dark:text-apple-white">🔒 Privacy Policy <span className="block text-xs text-apple-grayNeutral font-normal mt-0.5">/privacy</span></td>
                          <td className="px-6 py-4 text-xs font-semibold text-blue-600 dark:text-blue-400">System</td>
                          <td className="px-6 py-4 text-center text-xs text-apple-grayNeutral">-</td>
                          <td className="px-6 py-4 text-center text-green-500 font-bold">✓</td>
                          <td className="px-6 py-4"><span className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-500/10 text-green-500">Published</span></td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => setSelectedStaticPage('privacy')} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-600 hover:bg-purple-500/25 transition-all">Edit</button>
                          </td>
                        </tr>
                        {/* System Page: Terms */}
                        <tr>
                          <td className="px-6 py-4 font-medium text-apple-ink dark:text-apple-white">📝 Terms of Service <span className="block text-xs text-apple-grayNeutral font-normal mt-0.5">/terms</span></td>
                          <td className="px-6 py-4 text-xs font-semibold text-blue-600 dark:text-blue-400">System</td>
                          <td className="px-6 py-4 text-center text-xs text-apple-grayNeutral">-</td>
                          <td className="px-6 py-4 text-center text-green-500 font-bold">✓</td>
                          <td className="px-6 py-4"><span className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-500/10 text-green-500">Published</span></td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => setSelectedStaticPage('terms')} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-600 hover:bg-purple-500/25 transition-all">Edit</button>
                          </td>
                        </tr>
                        {/* System Page: Donation */}
                        <tr>
                          <td className="px-6 py-4 font-medium text-apple-ink dark:text-apple-white">💝 Donation & Support <span className="block text-xs text-apple-grayNeutral font-normal mt-0.5">/donation</span></td>
                          <td className="px-6 py-4 text-xs font-semibold text-blue-600 dark:text-blue-400">System</td>
                          <td className="px-6 py-4 text-center text-xs text-apple-grayNeutral">-</td>
                          <td className="px-6 py-4 text-center text-green-500 font-bold">✓</td>
                          <td className="px-6 py-4"><span className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-500/10 text-green-500">Published</span></td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => setSelectedStaticPage('donation')} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-600 hover:bg-purple-500/25 transition-all">Edit</button>
                          </td>
                        </tr>
                        {/* Custom Dynamic Pages */}
                        {customPagesList.map(page => (
                          <tr key={page.key}>
                            <td className="px-6 py-4 font-medium text-apple-ink dark:text-apple-white">
                              🌐 {page.title?.vi || page.title?.en || page.key}
                              <span className="block text-xs text-apple-grayNeutral font-normal mt-0.5">/page/{page.key}</span>
                            </td>
                            <td className="px-6 py-4 text-xs font-semibold text-purple-600 dark:text-purple-400">Custom</td>
                            <td className="px-6 py-4 text-center font-bold text-xs">{page.metadata?.showInHeader ? <span className="text-green-500">✓</span> : <span className="text-apple-grayNeutral opacity-30">✗</span>}</td>
                            <td className="px-6 py-4 text-center font-bold text-xs">{page.metadata?.showInFooter ? <span className="text-green-500">✓</span> : <span className="text-apple-grayNeutral opacity-30">✗</span>}</td>
                            <td className="px-6 py-4">
                              {page.metadata?.isPublished !== false ? (
                                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-500/10 text-green-500">Published</span>
                              ) : (
                                <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-apple-grayNeutral/10 text-apple-grayNeutral">Draft</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => handleEditCustomPageClick(page)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-600 hover:bg-purple-500/25 transition-all">Edit</button>
                                <button onClick={() => handleCustomPageDelete(page.key)} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/10 text-red-500 hover:bg-red-500/25 transition-all">Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                        {customPagesList.length === 0 && (
                          <tr>
                            <td colSpan="6" className="px-6 py-8 text-center text-apple-grayNeutral text-xs">No custom pages created yet. Click "+ Create Custom Page" to start.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 2. SYSTEM PAGES FORM */}
              {['privacy', 'terms', 'donation'].includes(selectedStaticPage) && (
                <form onSubmit={handlePagesSubmit} className="space-y-6 animate-fade-in">
                  {(selectedStaticPage === 'privacy' || selectedStaticPage === 'terms') && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 capitalize">✏️ Editing System Page: {selectedStaticPage}</span>
                        <LangTabs />
                      </div>
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
                        <div className="flex justify-between items-center">
                          <span></span>
                          <LangTabs />
                        </div>
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
                          <div className="flex justify-between items-center">
                            <span></span>
                            <LangTabs />
                          </div>
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
              )}

              {/* 3. CUSTOM DYNAMIC PAGE FORM (CREATE / EDIT) */}
              {(selectedStaticPage === 'new_page' || (!['list', 'privacy', 'terms', 'donation'].includes(selectedStaticPage))) && (
                <form onSubmit={handleCustomPageSubmit} className="space-y-6 animate-fade-in">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 font-display">
                      {selectedStaticPage === 'new_page' ? '✨ Creating New Custom Page' : `✏️ Editing Custom Page: ${selectedStaticPage}`}
                    </span>
                    <LangTabs />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/40 dark:bg-white/[0.02] p-5 rounded-2xl border border-apple-grayBorderSoft dark:border-white/5">
                    <div className="space-y-4">
                      {/* Slug key */}
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-apple-grayNeutral">Page URL Slug / Key *</label>
                        <input
                          type="text"
                          required
                          disabled={selectedStaticPage !== 'new_page'}
                          placeholder="e.g. graduation-day"
                          value={customPageForm.key}
                          onChange={e => setCustomPageForm(prev => ({ ...prev, key: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-') }))}
                          className="w-full px-4 py-2.5 border border-apple-grayBorderMid rounded-xl bg-transparent text-sm disabled:opacity-50"
                        />
                        <p className="text-[10px] text-apple-grayNeutral">Use only lowercase letters, numbers, and dashes. This is the URL: e.g. /page/{customPageForm.key || 'your-slug'}</p>
                      </div>

                      {/* Title */}
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-apple-grayNeutral">Page Title ({formLang.toUpperCase()}) *</label>
                        <input
                          type="text"
                          required
                          value={customPageForm[`title_${formLang}`] || ''}
                          onChange={e => setCustomPageForm(prev => ({ ...prev, [`title_${formLang}`]: e.target.value }))}
                          placeholder={`Title in ${formLang === 'vi' ? 'Vietnamese' : 'English'}`}
                          className="w-full px-4 py-2.5 border border-apple-grayBorderMid rounded-xl bg-transparent text-sm"
                        />
                      </div>

                      {/* Short Navigation Title */}
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-apple-grayNeutral">Short Menu Title ({formLang.toUpperCase()}) - Optional</label>
                        <input
                          type="text"
                          value={customPageForm[`navTitle_${formLang}`] || ''}
                          onChange={e => setCustomPageForm(prev => ({ ...prev, [`navTitle_${formLang}`]: e.target.value }))}
                          placeholder={`Short text for Navbar Menu (e.g. Graduation)`}
                          className="w-full px-4 py-2.5 border border-apple-grayBorderMid rounded-xl bg-transparent text-sm"
                        />
                        <p className="text-[9px] text-apple-grayNeutral">If empty, the full Page Title will be used in the Navigation bar / Footer.</p>
                      </div>

                      {/* Template Selector */}
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-apple-grayNeutral">Giao diện Trang (Page Template)</label>
                        <select
                          value={customPageForm.template}
                          onChange={e => setCustomPageForm(prev => ({ ...prev, template: e.target.value }))}
                          className="w-full px-4 py-2.5 border border-apple-grayBorderMid rounded-xl bg-white dark:bg-apple-graphiteA text-sm"
                        >
                          <option value="default">Default (Trang văn bản thông thường)</option>
                          <option value="graduation">Graduation Ceremony (Lễ tốt nghiệp đặc biệt 🎓)</option>
                        </select>
                      </div>

                      {/* Cover Image */}
                      <div className="space-y-1">
                        <label className="block text-xs font-semibold text-apple-grayNeutral">Cover Image / Banner</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleImageUpload(e, 'customPageCover')}
                          className="w-full px-4 py-2 border border-apple-grayBorderMid rounded-xl bg-transparent text-sm"
                        />
                        {customPageForm.coverImage && (
                          <div className="mt-2 h-20 w-36 rounded-lg overflow-hidden border border-apple-grayBorderSoft">
                            <img src={customPageForm.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Checkboxes and settings */}
                    <div className="space-y-4 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-apple-grayNeutral uppercase tracking-wider mb-2">Attachment & Visibility</h4>
                        <div className="space-y-3">
                          <label className="flex items-center gap-3 cursor-pointer text-sm font-medium">
                            <input
                              type="checkbox"
                              checked={customPageForm.showInHeader}
                              onChange={e => setCustomPageForm(prev => ({ ...prev, showInHeader: e.target.checked }))}
                              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                            />
                            <span>Show in top Navigation Header</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer text-sm font-medium">
                            <input
                              type="checkbox"
                              checked={customPageForm.showInFooter}
                              onChange={e => setCustomPageForm(prev => ({ ...prev, showInFooter: e.target.checked }))}
                              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                            />
                            <span>Show in Footer Link Section</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer text-sm font-medium">
                            <input
                              type="checkbox"
                              checked={customPageForm.isPublished}
                              onChange={e => setCustomPageForm(prev => ({ ...prev, isPublished: e.target.checked }))}
                              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                            />
                            <span className="flex flex-col">
                              <span>Publish page</span>
                              <span className="text-[10px] text-apple-grayNeutral font-normal">If unchecked, it remains as a draft and is private</span>
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Content Image Uploader Helper */}
                      <div className="space-y-1 pt-4 border-t border-apple-grayBorderSoft/40">
                        <label className="block text-xs font-semibold text-purple-600 dark:text-purple-400">🖼️ Insert Image into Content</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleImageUpload(e, 'customPageContent')}
                          className="w-full px-4 py-2 border border-purple-500/20 rounded-xl bg-purple-500/5 text-xs text-purple-600 cursor-pointer"
                        />
                        <p className="text-[9px] text-apple-grayNeutral">Uploading here will automatically insert the image at the end of the editor for the active language ({formLang.toUpperCase()}).</p>
                      </div>
                    </div>
                  </div>

                  {/* GRADUATION TEMPLATE SPECIFIC OPTIONS */}
                  {customPageForm.template === 'graduation' && (
                    <div className="space-y-6 bg-gradient-to-br from-purple-500/10 to-blue-500/5 dark:from-purple-500/[0.05] dark:to-blue-500/[0.02] p-6 rounded-3xl border border-purple-500/20 dark:border-purple-500/10 animate-fade-in">
                      <h3 className="text-sm font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <span>🎓</span> Graduation Template Settings (Thiết lập trang tốt nghiệp)
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Date & Time */}
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-apple-grayNeutral">Graduation Date & Time (Ngày giờ làm lễ tốt nghiệp)</label>
                          <input
                            type="datetime-local"
                            value={customPageForm.graduationDate}
                            onChange={e => setCustomPageForm(prev => ({ ...prev, graduationDate: e.target.value }))}
                            className="w-full px-4 py-2 border border-apple-grayBorderMid rounded-xl bg-white dark:bg-apple-graphiteA text-sm"
                          />
                          <p className="text-[10px] text-apple-grayNeutral">Used to display countdown timers or graduation status.</p>
                        </div>

                        {/* Gallery Uploader */}
                        <div className="space-y-2">
                          <label className="block text-xs font-semibold text-apple-grayNeutral">Memory Gallery (Album ảnh kỷ niệm)</label>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={e => handleImageUpload(e, 'customPageGallery')}
                            className="w-full px-4 py-1.5 border border-apple-grayBorderMid rounded-xl bg-white dark:bg-apple-graphiteA text-xs"
                          />
                          <p className="text-[10px] text-apple-grayNeutral">Upload multiple pictures for a beautiful gallery display.</p>

                          {/* Gallery Thumbnail Preview */}
                          {customPageForm.gallery && customPageForm.gallery.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2 max-h-24 overflow-y-auto p-1.5 border border-apple-grayBorderSoft rounded-xl">
                              {customPageForm.gallery.map((img, idx) => (
                                <div key={idx} className="relative h-12 w-12 rounded overflow-hidden border border-apple-grayBorderSoft group">
                                  <img src={img} alt="Gallery Thumb" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => setCustomPageForm(prev => ({
                                      ...prev,
                                      gallery: prev.gallery.filter((_, i) => i !== idx)
                                    }))}
                                    className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    Delete
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Gratitude Cards inputs */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-apple-grayBorderSoft/40">
                        {/* Family thanks */}
                        <div className="space-y-2 border border-red-500/10 rounded-2xl p-4 bg-red-500/[0.02]">
                          <label className="block text-xs font-bold text-red-500/80">👨‍👩‍👧‍👦 Tri ân Gia Đình ({formLang.toUpperCase()})</label>
                          <textarea
                            rows={3}
                            placeholder="Lời cảm ơn bố mẹ, người thân..."
                            value={customPageForm[`familyThanks_${formLang}`] || ''}
                            onChange={e => setCustomPageForm(prev => ({ ...prev, [`familyThanks_${formLang}`]: e.target.value }))}
                            className="w-full px-3 py-2 border border-apple-grayBorderMid rounded-xl bg-white dark:bg-apple-graphiteA text-xs"
                          />
                        </div>

                        {/* Teacher thanks */}
                        <div className="space-y-2 border border-blue-500/10 rounded-2xl p-4 bg-blue-500/[0.02]">
                          <label className="block text-xs font-bold text-blue-500/80">👨‍🏫 Tri ân Thầy Cô ({formLang.toUpperCase()})</label>
                          <textarea
                            rows={3}
                            placeholder="Lời cảm ơn thầy cô, nhà trường..."
                            value={customPageForm[`teacherThanks_${formLang}`] || ''}
                            onChange={e => setCustomPageForm(prev => ({ ...prev, [`teacherThanks_${formLang}`]: e.target.value }))}
                            className="w-full px-3 py-2 border border-apple-grayBorderMid rounded-xl bg-white dark:bg-apple-graphiteA text-xs"
                          />
                        </div>

                        {/* Friend thanks */}
                        <div className="space-y-2 border border-emerald-500/10 rounded-2xl p-4 bg-emerald-500/[0.02]">
                          <label className="block text-xs font-bold text-emerald-500/80">🤝 Tri ân Bạn Bè ({formLang.toUpperCase()})</label>
                          <textarea
                            rows={3}
                            placeholder="Lời cảm ơn bạn bè, chiến hữu..."
                            value={customPageForm[`friendThanks_${formLang}`] || ''}
                            onChange={e => setCustomPageForm(prev => ({ ...prev, [`friendThanks_${formLang}`]: e.target.value }))}
                            className="w-full px-3 py-2 border border-apple-grayBorderMid rounded-xl bg-white dark:bg-apple-graphiteA text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rich Text Editor */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-apple-grayNeutral">Page Content ({formLang.toUpperCase()})</label>
                    <div className="bg-white dark:bg-apple-graphiteA text-black h-96 mb-12 rounded-xl overflow-hidden border border-apple-grayBorderMid">
                      <ReactQuill
                        theme="snow"
                        value={customPageForm[`content_${formLang}`] || ''}
                        onChange={(content) => setCustomPageForm(prev => ({ ...prev, [`content_${formLang}`]: content }))}
                        className="h-full pb-12"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={uploadingImage}
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50 flex items-center gap-2"
                    >
                      {uploadingImage && (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin"></div>
                      )}
                      {uploadingImage ? 'Uploading...' : (selectedStaticPage === 'new_page' ? 'Create Page' : 'Update Page')}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedStaticPage('list')}
                      className="px-6 py-2.5 border border-apple-grayBorderMid rounded-xl text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
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
