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
  const [profileForm, setProfileForm] = useState({ headline: '', subHeadline: '', techStack: '' });
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
          techStack: res.data.techStack ? res.data.techStack.join(', ') : ''
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
        setProjectForm({ ...projectForm, imageUrl: res.data.imageUrl });
      } else {
        setPostForm({ ...postForm, coverImage: res.data.imageUrl });
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
      techStack: profileForm.techStack.split(',').map(t => t.trim()).filter(Boolean)
    };
    try {
      await api.put('/profile', data);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
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

  return (
    <div className="min-h-screen bg-apple-grayPale dark:bg-apple-black text-apple-ink dark:text-apple-white font-sans flex flex-col">
      <nav className="bg-white dark:bg-apple-graphiteA border-b border-apple-grayBorderSoft dark:border-apple-grayBorderMid px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <div className="space-x-4">
          <button onClick={() => navigate('/')} className="text-sm font-medium hover:text-apple-blueAction">View Site</button>
          <button onClick={handleLogout} className="text-sm font-medium text-red-500 hover:text-red-700">Logout</button>
        </div>
      </nav>

      <div className="flex-grow flex max-w-7xl mx-auto w-full p-6 gap-8">
        <aside className="w-64 flex flex-col gap-2">
          <button 
            className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'profile' ? 'bg-apple-blueAction text-white' : 'hover:bg-apple-grayBorderSoft dark:hover:bg-apple-graphiteB'}`}
            onClick={() => { setActiveTab('profile'); setEditingId(null); }}
          >
            Profile Info
          </button>
          <button 
            className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'projects' ? 'bg-apple-blueAction text-white' : 'hover:bg-apple-grayBorderSoft dark:hover:bg-apple-graphiteB'}`}
            onClick={() => { setActiveTab('projects'); setEditingId(null); }}
          >
            Projects
          </button>
          <button 
            className={`text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'posts' ? 'bg-apple-blueAction text-white' : 'hover:bg-apple-grayBorderSoft dark:hover:bg-apple-graphiteB'}`}
            onClick={() => { setActiveTab('posts'); setEditingId(null); }}
          >
            Blog Posts
          </button>
        </aside>

        <main className="flex-grow bg-white dark:bg-apple-graphiteA p-8 rounded-2xl border border-apple-grayBorderSoft dark:border-apple-grayBorderMid shadow-sm">
          {activeTab === 'profile' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold">Edit Homepage Profile</h2>
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
                <div className="flex gap-4">
                  <button type="submit" className="bg-apple-ink dark:bg-white text-white dark:text-apple-ink px-6 py-2 rounded-lg font-medium">Save Profile</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold">{editingId ? 'Edit Project' : 'New Project'}</h2>
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                <input type="text" placeholder="Title" required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
                <textarea placeholder="Description" required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent" rows={3} value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} />
                <div className="flex gap-4 items-center">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'project')} className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent" />
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
                <h3 className="text-xl font-semibold border-t border-apple-grayBorderSoft dark:border-apple-grayBorderMid pt-8">Existing Projects</h3>
                {projects.map(p => (
                  <div key={p._id} className="flex justify-between items-center p-4 border border-apple-grayBorderSoft dark:border-apple-grayBorderMid rounded-lg">
                    <span className="font-medium">{p.title}</span>
                    <div className="space-x-3">
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
              <h2 className="text-2xl font-semibold">{editingId ? 'Edit Post' : 'New Post'}</h2>
              <form onSubmit={handlePostSubmit} className="space-y-4">
                <input type="text" placeholder="Title" required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent" value={postForm.title} onChange={e => setPostForm({...postForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} />
                <input type="text" placeholder="Slug" required className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent" value={postForm.slug} onChange={e => setPostForm({...postForm, slug: e.target.value})} />
                <textarea placeholder="Excerpt" className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent" rows={2} value={postForm.excerpt} onChange={e => setPostForm({...postForm, excerpt: e.target.value})} />
                <div className="flex gap-4 items-center">
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'post')} className="w-full px-4 py-2 border border-apple-grayBorderMid rounded bg-transparent" />
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
                <h3 className="text-xl font-semibold border-t border-apple-grayBorderSoft dark:border-apple-grayBorderMid pt-8">Existing Posts</h3>
                {posts.map(p => (
                  <div key={p._id} className="flex justify-between items-center p-4 border border-apple-grayBorderSoft dark:border-apple-grayBorderMid rounded-lg">
                    <span className="font-medium">{p.title} <span className="text-xs text-apple-grayNeutral ml-2">({p.published ? 'Published' : 'Draft'})</span></span>
                    <div className="space-x-3">
                      <button onClick={() => editPost(p)} className="text-apple-blueAction text-sm">Edit</button>
                      <button onClick={() => deleteItem(p._id, 'posts')} className="text-red-500 text-sm">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
