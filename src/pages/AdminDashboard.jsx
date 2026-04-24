import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('projects');
  const [projects, setProjects] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  // Form states
  const [projectForm, setProjectForm] = useState({ title: '', description: '', imageUrl: '', projectUrl: '', technologies: '' });
  const [postForm, setPostForm] = useState({ title: '', slug: '', content: '', excerpt: '', coverImage: '', published: false });
  const [profileForm, setProfileForm] = useState({ headline: '', subHeadline: '', techStack: '', avatarUrl: '' });
  const [accountForm, setAccountForm] = useState({ currentPassword: '', newPassword: '' });
  const [editingId, setEditingId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    if (activeTab === 'projects') {
      const res = await api.get('/projects');
      setProjects(res.data);
    } else if (activeTab === 'posts') {
      const res = await api.get('/posts');
      setPosts(res.data);
    } else if (activeTab === 'profile') {
      const res = await api.get('/profile');
      if (res.data) {
        setProfileForm({
          headline: res.data.headline || '',
          subHeadline: res.data.subHeadline || '',
          techStack: res.data.techStack ? res.data.techStack.join(', ') : '',
          avatarUrl: res.data.avatarUrl || ''
        });
      }
    }
  };

  const handleImageUpload = async (e, formType) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    setUploadingImage(true);

    try {
      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (formType === 'project') {
        setProjectForm(prev => ({ ...prev, imageUrl: res.data.imageUrl }));
      } else if (formType === 'post') {
        setPostForm(prev => ({ ...prev, coverImage: res.data.imageUrl }));
      } else if (formType === 'profile') {
        setProfileForm(prev => ({ ...prev, avatarUrl: res.data.imageUrl }));
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed. Please check your Cloudinary configuration.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...projectForm,
      technologies: projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean)
    };
    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, data);
      } else {
        await api.post('/projects', data);
      }
      setProjectForm({ title: '', description: '', imageUrl: '', projectUrl: '', technologies: '' });
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/posts/${editingId}`, postForm);
      } else {
        await api.post('/posts', postForm);
      }
      setPostForm({ title: '', slug: '', content: '', excerpt: '', coverImage: '', published: false });
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const data = {
      headline: profileForm.headline,
      subHeadline: profileForm.subHeadline,
      techStack: profileForm.techStack.split(',').map(t => t.trim()).filter(Boolean),
      avatarUrl: profileForm.avatarUrl
    };
    try {
      await api.put('/profile', data);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/change-password', accountForm);
      alert('Password updated successfully!');
      setAccountForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating password');
    }
  };

  const editProject = (p) => {
    setProjectForm({ ...p, technologies: p.technologies.join(', ') });
    setEditingId(p._id);
  };

  const editPost = (p) => {
    setPostForm(p);
    setEditingId(p._id);
  };

  const deleteItem = async (id, type) => {
    if (window.confirm('Are you sure?')) {
      await api.delete(`/${type}/${id}`);
      fetchData();
    }
  };

  const tabs = [
    { key: 'profile', label: 'Profile Info' },
    { key: 'projects', label: 'Projects' },
    { key: 'posts', label: 'Blog Posts' },
    { key: 'account', label: 'Account' },
  ];

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

      {/* Mobile tab bar — horizontal scrollable */}
      <div className="md:hidden bg-white dark:bg-apple-graphiteA border-b border-apple-grayBorderSoft dark:border-apple-grayBorderMid overflow-x-auto">
        <div className="flex px-4 py-2 gap-1 min-w-max">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setEditingId(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.key
                  ? 'bg-apple-blueAction text-white'
                  : 'text-apple-grayNeutral hover:bg-apple-grayPale dark:hover:bg-apple-graphiteB hover:text-apple-ink dark:hover:text-apple-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow flex max-w-7xl mx-auto w-full p-4 sm:p-6 gap-6 sm:gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-52 lg:w-64 flex-col gap-2 shrink-0">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === tab.key ? 'bg-apple-blueAction text-white' : 'hover:bg-apple-grayBorderSoft dark:hover:bg-apple-graphiteB'}`}
              onClick={() => { setActiveTab(tab.key); setEditingId(null); }}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        <main className="flex-grow bg-white dark:bg-apple-graphiteA p-5 sm:p-8 rounded-2xl border border-apple-grayBorderSoft dark:border-apple-grayBorderMid shadow-sm min-w-0">
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <h2 className="text-xl sm:text-2xl font-semibold">Edit Homepage Profile</h2>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-apple-grayNeutral">Headline</label>
                  <input type="text" required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent" value={profileForm.headline} onChange={e => setProfileForm({...profileForm, headline: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-apple-grayNeutral">Sub-Headline</label>
                  <textarea required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent" rows={3} value={profileForm.subHeadline} onChange={e => setProfileForm({...profileForm, subHeadline: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-apple-grayNeutral">Tech Stack (comma separated)</label>
                  <input type="text" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent" value={profileForm.techStack} onChange={e => setProfileForm({...profileForm, techStack: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-apple-grayNeutral">Profile Avatar</label>
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'profile')} className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-sm" />
                    {uploadingImage && <span className="text-sm text-apple-grayNeutral">Uploading...</span>}
                  </div>
                  {profileForm.avatarUrl && <img src={profileForm.avatarUrl} alt="Avatar Preview" className="w-24 h-24 rounded-full object-cover mt-2" />}
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="bg-apple-ink dark:bg-white text-white dark:text-apple-ink px-6 py-2 rounded-lg font-medium">Save Profile</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-8">
              <h2 className="text-xl sm:text-2xl font-semibold">{editingId ? 'Edit Project' : 'New Project'}</h2>
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <input type="text" placeholder="Title" required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
                <textarea placeholder="Description" required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent" rows={3} value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} />
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'project')} className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-sm" />
                  {uploadingImage && <span className="text-sm text-apple-grayNeutral">Uploading...</span>}
                </div>
                {projectForm.imageUrl && <img src={projectForm.imageUrl} alt="Preview" className="h-20 rounded object-cover" />}
                <input type="text" placeholder="Project URL" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent" value={projectForm.projectUrl} onChange={e => setProjectForm({...projectForm, projectUrl: e.target.value})} />
                <input type="text" placeholder="Technologies (comma separated)" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent" value={projectForm.technologies} onChange={e => setProjectForm({...projectForm, technologies: e.target.value})} />
                <div className="flex gap-4">
                  <button type="submit" className="bg-apple-ink dark:bg-white text-white dark:text-apple-ink px-6 py-2 rounded-lg font-medium">{editingId ? 'Update' : 'Create'}</button>
                  {editingId && <button type="button" onClick={() => { setEditingId(null); setProjectForm({ title: '', description: '', imageUrl: '', projectUrl: '', technologies: '' }); }} className="px-6 py-2 border border-apple-grayBorderMid rounded-lg font-medium">Cancel</button>}
                </div>
              </form>

              <div className="space-y-4 mt-8">
                <h3 className="text-lg sm:text-xl font-semibold border-t border-apple-grayBorderSoft dark:border-apple-grayBorderMid pt-8">Existing Projects</h3>
                {projects.map(p => (
                  <div key={p._id} className="flex justify-between items-center p-4 border border-apple-grayBorderSoft dark:border-apple-grayBorderMid rounded-lg gap-3">
                    <span className="font-medium text-sm sm:text-base truncate">{p.title}</span>
                    <div className="flex gap-3 shrink-0">
                      <button onClick={() => editProject(p)} className="text-apple-blueAction text-sm">Edit</button>
                      <button onClick={() => deleteItem(p._id, 'projects')} className="text-red-500 text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="space-y-8">
              <h2 className="text-xl sm:text-2xl font-semibold">{editingId ? 'Edit Post' : 'New Post'}</h2>
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <input type="text" placeholder="Title" required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent" value={postForm.title} onChange={e => setPostForm({...postForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} />
                <input type="text" placeholder="Slug" required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent" value={postForm.slug} onChange={e => setPostForm({...postForm, slug: e.target.value})} />
                <textarea placeholder="Excerpt" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent" rows={2} value={postForm.excerpt} onChange={e => setPostForm({...postForm, excerpt: e.target.value})} />
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'post')} className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent text-sm" />
                  {uploadingImage && <span className="text-sm text-apple-grayNeutral">Uploading...</span>}
                </div>
                {postForm.coverImage && <img src={postForm.coverImage} alt="Preview" className="h-20 rounded object-cover" />}
                <label className="flex items-center space-x-2">
                  <input type="checkbox" checked={postForm.published} onChange={e => setPostForm({...postForm, published: e.target.checked})} />
                  <span>Published</span>
                </label>
                <div className="bg-white dark:bg-apple-graphiteA text-black h-64 mb-12">
                  <ReactQuill theme="snow" value={postForm.content} onChange={(content) => setPostForm({...postForm, content})} className="h-full" />
                </div>
                <div className="flex gap-4 pt-8">
                  <button type="submit" className="bg-apple-ink dark:bg-white text-white dark:text-apple-ink px-6 py-2 rounded-lg font-medium">{editingId ? 'Update' : 'Create'}</button>
                  {editingId && <button type="button" onClick={() => { setEditingId(null); setPostForm({ title: '', slug: '', content: '', excerpt: '', coverImage: '', published: false }); }} className="px-6 py-2 border border-apple-grayBorderMid rounded-lg font-medium">Cancel</button>}
                </div>
              </form>

              <div className="space-y-4 mt-8">
                <h3 className="text-lg sm:text-xl font-semibold border-t border-apple-grayBorderSoft dark:border-apple-grayBorderMid pt-8">Existing Posts</h3>
                {posts.map(p => (
                  <div key={p._id} className="flex justify-between items-center p-4 border border-apple-grayBorderSoft dark:border-apple-grayBorderMid rounded-lg gap-3">
                    <span className="font-medium text-sm sm:text-base truncate">{p.title} <span className="text-xs text-apple-grayNeutral ml-1">({p.published ? 'Published' : 'Draft'})</span></span>
                    <div className="flex gap-3 shrink-0">
                      <button onClick={() => editPost(p)} className="text-apple-blueAction text-sm">Edit</button>
                      <button onClick={() => deleteItem(p._id, 'posts')} className="text-red-500 text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="space-y-8">
              <h2 className="text-xl sm:text-2xl font-semibold">Account Settings</h2>
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-apple-grayNeutral">Current Password</label>
                  <input type="password" required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent" value={accountForm.currentPassword} onChange={e => setAccountForm({...accountForm, currentPassword: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-apple-grayNeutral">New Password</label>
                  <input type="password" required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent" value={accountForm.newPassword} onChange={e => setAccountForm({...accountForm, newPassword: e.target.value})} />
                </div>
                <button type="submit" className="bg-apple-ink dark:bg-white text-white dark:text-apple-ink px-6 py-2 rounded-lg font-medium">Update Password</button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
