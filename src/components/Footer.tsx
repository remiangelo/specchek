import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white brutal-border mt-4">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-xl font-mono font-bold text-brutalist-dark">
              SPEC<span className="text-brutalist-accent">CHEK</span>
            </span>
            <p className="text-sm text-brutalist-gray mt-1">
              Check if your computer can run the games you want.
            </p>
          </div>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <a 
              href="#" 
              className="font-mono text-brutalist-dark hover:text-brutalist-accent transition-colors mb-2 md:mb-0"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="font-mono text-brutalist-dark hover:text-brutalist-accent transition-colors mb-2 md:mb-0"
            >
              Terms of Service
            </a>
            <a 
              href="#" 
              className="font-mono text-brutalist-dark hover:text-brutalist-accent transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
        <div className="mt-6 border-t-2 border-brutalist-dark pt-4 text-center text-sm text-brutalist-gray">
          <p>&copy; {new Date().getFullYear()} SpecChek. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 