import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AdminLogin = () => {
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data));
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const res = await api.post('/auth/forgot-password', { username, newPassword });
      setMessage(res.data.message);
      setTimeout(() => {
        setIsForgotPassword(false);
        setPassword('');
        setNewPassword('');
        setMessage('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-apple-grayPale dark:bg-apple-black font-sans px-4">
      <div className="max-w-md w-full bg-white dark:bg-apple-graphiteA p-8 rounded-2xl border border-apple-grayBorderSoft dark:border-apple-grayBorderMid shadow-xl space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-display font-semibold text-apple-ink dark:text-apple-white">
            {isForgotPassword ? 'Reset Password' : 'Admin Portal'}
          </h1>
          <p className="text-sm text-apple-grayNeutral mt-2">
            {isForgotPassword ? 'Enter your username and new password' : 'Sign in to manage your portfolio'}
          </p>
        </div>

        {!isForgotPassword ? (
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
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-apple-ink dark:text-apple-white">Password</label>
                <button type="button" onClick={() => setIsForgotPassword(true)} className="text-sm text-apple-blueAction hover:underline">Forgot?</button>
              </div>
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
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-6">
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
              <label className="block text-sm font-medium text-apple-ink dark:text-apple-white">New Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-apple-grayBorderMid bg-transparent dark:text-apple-white focus:outline-none focus:ring-2 focus:ring-apple-blueAction"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {message && <p className="text-green-500 text-sm text-center">{message}</p>}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => { setIsForgotPassword(false); setError(''); setMessage(''); }}
                className="w-full border border-apple-grayBorderMid text-apple-ink dark:text-apple-white py-3 rounded-full font-medium hover:bg-apple-grayPale dark:hover:bg-apple-graphiteB transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                className="w-full bg-apple-blueAction text-white py-3 rounded-full font-medium hover:bg-apple-blueLuminance transition-colors"
              >
                Reset
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
