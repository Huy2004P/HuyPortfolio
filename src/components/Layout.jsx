import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { SunIcon, MoonIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Layout = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLinkClick = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-apple-black/70 border-b border-apple-grayBorderSoft dark:border-apple-graphiteA transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <Link to="/" onClick={handleLinkClick} className="text-xl font-display font-semibold tracking-tight">
              Huy Portfolio
            </Link>

            {/* Desktop nav */}
            <div className="hidden sm:flex items-center space-x-6 text-sm">
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
              <button
                onClick={toggleDarkMode}
                className="p-1 text-apple-grayNeutral hover:text-apple-ink dark:hover:text-apple-white transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile controls */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                onClick={toggleDarkMode}
                className="p-2 text-apple-grayNeutral hover:text-apple-ink dark:hover:text-apple-white transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-apple-grayNeutral hover:text-apple-ink dark:hover:text-apple-white transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-white/95 dark:bg-apple-black/95 border-t border-apple-grayBorderSoft dark:border-apple-graphiteA px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={handleLinkClick}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-apple-grayPale dark:bg-apple-graphiteA text-apple-ink dark:text-apple-white'
                    : 'text-apple-grayNeutral hover:bg-apple-grayPale dark:hover:bg-apple-graphiteA hover:text-apple-ink dark:hover:text-apple-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </nav>

      <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Outlet />
      </main>

      <footer className="border-t border-apple-grayBorderSoft dark:border-apple-graphiteA py-6 sm:py-8 text-center text-apple-grayNeutral text-sm mt-auto">
        <p>&copy; {new Date().getFullYear()} Huy Portfolio. Built with React & Node.</p>
      </footer>
    </div>
  );
};

export default Layout;
