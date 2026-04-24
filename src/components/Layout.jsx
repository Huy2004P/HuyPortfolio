import { Outlet, Link, useLocation } from 'react-router-dom';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

const Layout = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-apple-black/70 border-b border-apple-grayBorderSoft dark:border-apple-graphiteA transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <Link to="/" className="text-xl font-display font-semibold tracking-tight">Huy Portfolio</Link>
            
            <div className="flex items-center space-x-6 text-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${
                    location.pathname === link.path
                      ? 'text-apple-ink dark:text-apple-white font-medium'
                      : 'text-apple-grayNeutral hover:text-apple-ink dark:hover:text-apple-grayPale'
                  } transition-colors`}
                >
                  {link.name}
                </Link>
              ))}
              <button onClick={toggleDarkMode} className="p-1 text-apple-grayNeutral hover:text-apple-ink dark:hover:text-apple-white transition-colors">
                {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <Outlet />
      </main>

      <footer className="border-t border-apple-grayBorderSoft dark:border-apple-graphiteA py-8 text-center text-apple-grayNeutral text-sm mt-auto">
        <p>&copy; {new Date().getFullYear()} Huy Portfolio. Built with React & Node.</p>
      </footer>
    </div>
  );
};

export default Layout;
