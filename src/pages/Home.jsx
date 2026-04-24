import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import api from '../api';

const Home = () => {
  const [profile, setProfile] = useState({
    headline: "Hi, I'm a Developer.",
    subHeadline: "I build beautiful applications.",
    techStack: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        if (res.data) setProfile(res.data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div className="text-center py-20 text-apple-grayNeutral">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-10 animate-fade-in">
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-semibold tracking-tighter text-apple-ink dark:text-apple-white">
          {profile.headline}
        </h1>
        <p className="text-xl sm:text-2xl text-apple-grayNeutral font-light max-w-2xl mx-auto leading-relaxed">
          {profile.subHeadline}
        </p>
      </div>

      <div className="flex space-x-4">
        <Link 
          to="/projects" 
          className="bg-apple-ink dark:bg-apple-white text-apple-white dark:text-apple-ink px-6 py-3 rounded-full font-medium hover:scale-105 transition-transform flex items-center gap-2"
        >
          View Projects <ArrowRightIcon className="w-4 h-4" />
        </Link>
        <Link 
          to="/contact" 
          className="bg-apple-grayPale dark:bg-apple-graphiteA text-apple-ink dark:text-apple-white px-6 py-3 rounded-full font-medium hover:bg-apple-grayBorderSoft dark:hover:bg-apple-graphiteB transition-colors"
        >
          Contact Me
        </Link>
      </div>

      {profile.techStack && profile.techStack.length > 0 && (
        <div className="mt-20 pt-10 border-t border-apple-grayBorderSoft dark:border-apple-graphiteA w-full max-w-4xl text-left">
          <h2 className="text-2xl font-display font-semibold mb-6">Tech Stack</h2>
          <div className="flex flex-wrap gap-3">
            {profile.techStack.map(tech => (
              <span key={tech} className="px-4 py-2 border border-apple-grayBorderSoft dark:border-apple-graphiteB rounded-full text-sm font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
