import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/admin');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-apple-grayPale dark:bg-apple-black font-sans px-4">
      <div className="max-w-md w-full bg-white dark:bg-apple-graphiteA p-8 rounded-2xl border border-apple-grayBorderSoft dark:border-apple-grayBorderMid shadow-xl space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-display font-semibold text-apple-ink dark:text-apple-white">Admin Portal</h1>
          <p className="text-sm text-apple-grayNeutral mt-2">Sign in to manage your portfolio</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-apple-ink dark:text-apple-white">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-apple-grayBorderMid bg-transparent dark:text-apple-white focus:outline-none focus:ring-2 focus:ring-apple-blueAction"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-apple-ink dark:text-apple-white">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-apple-grayBorderMid bg-transparent dark:text-apple-white focus:outline-none focus:ring-2 focus:ring-apple-blueAction"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-apple-blueAction text-white py-3 rounded-full font-medium hover:bg-apple-blueLuminance transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
