import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SunIcon, MoonIcon, CpuChipIcon } from '@heroicons/react/24/outline';

const Layout = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [darkMode, location.pathname]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      {/* Gradient background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-white dark:bg-gray-950 transition-colors duration-200" />
        <motion.div 
          className="absolute -top-[20%] -left-[10%] h-96 w-96 rounded-full bg-blue-500/10 dark:bg-blue-500/20 blur-3xl"
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        />
        <motion.div 
          className="absolute top-[40%] -right-[10%] h-72 w-72 rounded-full bg-purple-500/10 dark:bg-purple-500/20 blur-3xl"
          animate={{ 
            x: [0, -100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">GS</span>
                </div>
                <span className="font-bold text-xl">GameSpec</span>
              </Link>
            </motion.div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <NavLink to="/" active={isActivePath('/')}>
                Home
              </NavLink>
              <NavLink to="/scan" active={isActivePath('/scan')}>
                <CpuChipIcon className="w-5 h-5 mr-1" />
                Scan Hardware
              </NavLink>
              <NavLink to="/games" active={isActivePath('/games')}>
                Game Library
              </NavLink>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <motion.button
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              onClick={toggleTheme}
              whileTap={{ scale: 0.9 }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </motion.button>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-lg focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-current mb-1.5 transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-current transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              <nav className="flex flex-col p-4 gap-4">
                <MobileNavLink to="/" active={isActivePath('/')}>
                  Home
                </MobileNavLink>
                <MobileNavLink to="/scan" active={isActivePath('/scan')}>
                  <span className="flex items-center">
                    <CpuChipIcon className="w-5 h-5 mr-2" />
                    Scan Hardware
                  </span>
                </MobileNavLink>
                <MobileNavLink to="/games" active={isActivePath('/games')}>
                  Game Library
                </MobileNavLink>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[calc(100vh-16rem)]"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-12 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GS</span>
                </div>
                <span className="font-bold">GameSpec</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Find detailed information about your favorite games
              </p>
            </div>
            <div className="flex space-x-6">
              <Link to="/scan" className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                Scan Hardware
              </Link>
              <Link to="/games" className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                Game Library
              </Link>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors">
                Privacy
              </a>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-8">
            © {new Date().getFullYear()} GameSpec. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

// Desktop navigation link component
const NavLink = ({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) => (
  <Link
    to={to}
    className={`flex items-center font-medium text-sm transition-colors ${
      active 
        ? 'text-blue-600 dark:text-blue-400' 
        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
    }`}
  >
    {children}
  </Link>
);

// Mobile navigation link component
const MobileNavLink = ({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) => (
  <Link
    to={to}
    className={`block w-full p-3 rounded-lg font-medium transition-colors ${
      active 
        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
        : 'hover:bg-gray-50 dark:hover:bg-gray-900/30 text-gray-800 dark:text-gray-200'
    }`}
  >
    {children}
  </Link>
);

export default Layout; 