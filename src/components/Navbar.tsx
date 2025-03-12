import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white brutal-border mb-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-mono font-bold text-brutalist-dark">
                SPEC<span className="text-brutalist-accent">CHEK</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4">
            <Link 
              to="/" 
              className="font-mono text-brutalist-dark hover:text-brutalist-accent transition-colors"
            >
              Home
            </Link>
            <Link 
              to="/results" 
              className="font-mono text-brutalist-dark hover:text-brutalist-accent transition-colors"
            >
              Scan Results
            </Link>
            <Link 
              to="/games" 
              className="font-mono text-brutalist-dark hover:text-brutalist-accent transition-colors"
            >
              Game Library
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="brutal-border p-1"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6 text-brutalist-dark" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-brutalist-dark" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white brutal-border mt-2 p-4">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className="font-mono text-brutalist-dark hover:text-brutalist-accent transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/results" 
                className="font-mono text-brutalist-dark hover:text-brutalist-accent transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Scan Results
              </Link>
              <Link 
                to="/games" 
                className="font-mono text-brutalist-dark hover:text-brutalist-accent transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Game Library
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 